const { QdrantClient } = require('@qdrant/js-client-rest');
const { v4: uuidv4 } = require('uuid');

// Initialize Qdrant client
const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL || 'http://localhost:6333',
  apiKey: process.env.QDRANT_API_KEY,
});

const COLLECTION_NAME = 'page_embeddings';
const VECTOR_SIZE = 1536; // OpenAI's text-embedding-ada-002 model dimension

/**
 * Convert MongoDB ObjectId to UUID format
 * @param {string} objectId - MongoDB ObjectId
 * @returns {string} UUID format string
 */
function objectIdToUUID(objectId) {
  // Generate a simple UUID v4 and return both UUID and original ObjectId
  return {
    uuid: uuidv4(),
    originalId: objectId
  };
}

/**
 * Initialize the Qdrant collection if it doesn't exist
 */
async function initCollection() {
  try {
    const collections = await qdrant.getCollections();
    const exists = collections.collections.some(c => c.name === COLLECTION_NAME);

    if (!exists) {
      await qdrant.createCollection(COLLECTION_NAME, {
        vectors: {
          size: VECTOR_SIZE,
          distance: 'Cosine',
        },
      });
      console.log('Created Qdrant collection:', COLLECTION_NAME);
    }
  } catch (error) {
    console.error('Error initializing Qdrant collection:', error);
    throw error;
  }
}

/**
 * Store a page embedding in Qdrant
 * @param {string} pageId - MongoDB page ID
 * @param {string} workspaceId - MongoDB workspace ID
 * @param {number[]} vector - The embedding vector
 * @param {Object} payload - Additional metadata to store
 */
async function storeEmbedding(pageId, workspaceId, vector, payload = {}) {
  try {
    // Extract string ID if pageId is an ObjectId
    const pageIdStr = pageId.toString();
    const { uuid, originalId } = objectIdToUUID(pageIdStr);
    console.log("this is uuid", uuid);
    await qdrant.upsert(COLLECTION_NAME, {
      points: [
        {
          id: uuid,
          vector,
          payload: {
            pageId: originalId, // Store original MongoDB ID in payload
            workspaceId,
            ...payload,
          },
        },
      ],
    });
  } catch (error) {
    console.error('Error storing embedding in Qdrant:', error);
    throw error;
  }
}

/**
 * Search for similar pages using a query vector
 * @param {number[]} vector - The query vector
 * @param {string} workspaceId - Filter by workspace ID
 * @param {number} limit - Maximum number of results
 * @returns {Promise<Array>} Array of similar pages
 */
async function searchSimilar(vector, workspaceId, limit = 5) {
  try {
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

    return response.map(result => ({
      pageId: result.id,
      score: result.score,
      ...result.payload,
    }));
  } catch (error) {
    console.error('Error searching in Qdrant:', error);
    throw error;
  }
}

/**
 * Delete a page's embedding from Qdrant
 * @param {string} pageId - MongoDB page ID
 */
async function deleteEmbedding(pageId) {
  try {
    await qdrant.delete(COLLECTION_NAME, {
      points: [pageId],
    });
  } catch (error) {
    console.error('Error deleting embedding from Qdrant:', error);
    throw error;
  }
}

module.exports = {
  initCollection,
  storeEmbedding,
  searchSimilar,
  deleteEmbedding,
}; 