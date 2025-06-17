const { QdrantClient } = require('@qdrant/js-client-rest');
const { OpenAI } = require('openai');
const { extractTextContent } = require('./embedding.service');

const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL || 'http://localhost:6333',
  apiKey: process.env.QDRANT_API_KEY,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const COLLECTION_NAME = 'page_embeddings';
const SIMILARITY_THRESHOLD = 0.7; // Minimum similarity score to consider content related

/**
 * Generate embedding for text content
 * @param {string} text - Text to generate embedding for
 * @returns {Promise<number[]>} Embedding vector
 */
async function generateEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

/**
 * Find similar content in the workspace
 * @param {string} text - Text to find similar content for
 * @param {string} workspaceId - Workspace ID to search in
 * @param {number} limit - Maximum number of results
 * @returns {Promise<Array>} Array of similar pages with scores
 */
async function findSimilarContent(text, workspaceId, limit = 5) {
  try {
    const vector = await generateEmbedding(text);
    
    const response = await qdrant.search(COLLECTION_NAME, {
      vector,
      limit,    
      filter: {
        must: [
          {
            key: 'workspaceId',
            match: { value: workspaceId },
          },
        ],
      },
    });

    // Filter results by similarity threshold
    return response
      .filter(result => result.score >= SIMILARITY_THRESHOLD)
      .map(result => ({
        pageId: result.payload.pageId,
        title: result.payload.title,
        score: result.score,
        snippet: result.payload.snippet,
      }));
  } catch (error) {
    console.error('Error finding similar content:', error);
    throw error;
  }
}

/**
 * Analyze text for potential link suggestions
 * @param {string} text - Text to analyze
 * @param {string} workspaceId - Workspace ID
 * @returns {Promise<Array>} Array of link suggestions
 */
async function getLinkSuggestions(text, workspaceId) {
  try {
    // Find similar content
    const similarPages = await findSimilarContent(text, workspaceId);
    
    if (similarPages.length === 0) {
      return [];
    }

    // Use OpenAI to analyze the relationship and generate link suggestions
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a content linking assistant. Analyze the relationship between content and suggest appropriate link text and context.'
        },
        {
          role: 'user',
          content: `Analyze this text and suggest how to link it with similar content:\n\nText: ${text}\n\nSimilar pages:\n${similarPages.map(p => `- ${p.title} (relevance: ${Math.round(p.score * 100)}%)`).join('\n')}`
        }
      ],
      temperature: 0.3,
    });

    const suggestions = response.choices[0].message.content
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        const match = line.match(/\[(.*?)\]\((.*?)\)/);
        if (match) {
          return {
            linkText: match[1],
            pageId: similarPages.find(p => p.title.includes(match[2]))?.pageId,
            context: line.replace(/\[.*?\]\(.*?\)/, '').trim()
          };
        }
        return null;
      })
      .filter(Boolean);

    return suggestions;
  } catch (error) {
    console.error('Error getting link suggestions:', error);
    throw error;
  }
}

module.exports = {
  findSimilarContent,
  getLinkSuggestions,
}; 