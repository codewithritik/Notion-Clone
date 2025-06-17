const { OpenAI } = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Call OpenAI API with the given parameters
 * @param {Object} params - The parameters for the OpenAI API call
 * @param {string} params.model - The model to use (e.g., 'gpt-3.5-turbo')
 * @param {Array} params.messages - Array of message objects with role and content
 * @param {number} [params.temperature=0.7] - Controls randomness (0-1)
 * @param {number} [params.max_tokens] - Maximum number of tokens to generate
 * @returns {Promise<Object>} The OpenAI API response
 */
async function callOpenAI({ model, messages, temperature = 0.7, max_tokens }) {
  try {
    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature,
      ...(max_tokens && { max_tokens }),
    });

    return response;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate response from OpenAI');
  }
}

module.exports = {
  callOpenAI,
}; 