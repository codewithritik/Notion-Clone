const { OpenAI } = require('openai');
const { storeEmbedding, deleteEmbedding } = require('./qdrant.service');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Extract text content from TipTap JSON structure
 * @param {Object} content - TipTap JSON content
 * @returns {string} Plain text content
 */
function extractTextContent(content) {
  if (!content) return '';
  
  if (typeof content === 'string') {
    return content;
  }

  if (content.type === 'text') {
    return content.text || '';
  }

  if (Array.isArray(content)) {
    return content.map(extractTextContent).join(' ');
  }

  if (content.content) {
    return extractTextContent(content.content);
  }

  return '';
}

/**
 * Generate embedding for page content
 * @param {Object} content - TipTap JSON content
 * @returns {Promise<number[]>} Embedding vector
 */
async function generateEmbedding(content) {
  try {
    const text = extractTextContent(content);
    
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
 * Process page content and store embedding
 * @param {string} pageId - MongoDB page ID
 * @param {string} workspaceId - MongoDB workspace ID
 * @param {Object} content - TipTap JSON content
 * @param {Object} metadata - Additional metadata to store
 */
async function processPageContent(pageId, workspaceId, content, metadata = {}) {
  try {
    console.log("this is pageid", pageId);
    const text = extractTextContent(content);
    const vector = await generateEmbedding(text);
    
    // Extract a snippet for context (first 200 characters)
    const snippet = text.slice(0, 200) + (text.length > 200 ? '...' : '');
    
    await storeEmbedding(pageId, workspaceId, vector, {
      ...metadata,
      snippet,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error processing page content:', error);
    throw error;
  }
}

/**
 * Remove page embedding
 * @param {string} pageId - MongoDB page ID
 */
async function removePageEmbedding(pageId) {
  try {
    await deleteEmbedding(pageId);
  } catch (error) {
    console.error('Error removing page embedding:', error);
    throw error;
  }
}

module.exports = {
  generateEmbedding,
  processPageContent,
  removePageEmbedding,
  extractTextContent,
}; 