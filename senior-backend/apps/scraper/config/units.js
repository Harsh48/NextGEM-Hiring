const { default: axios } = require('axios');
const request = require('axios');

async function getWethPriceUsd() {
  // Replace with your preferred API endpoint and access key if needed
  const baseUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=exactly-weth&vs_currencies=usd';
  const url = baseUrl;

  try {
    const {data} = await axios.get(url);
    console.log(data)
    return data['exactly-weth'].usd;

  } catch (error) {
    throw error; // Re-throw for proper error handling
  }
}
 
 async function getGemaiPriceEth() {
    // Replace with your preferred API endpoint and access key if needed
    const apiKey = ''
    const baseUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=the-next-gem-ai&vs_currencies=eth';
    const url = baseUrl;
    try {
        const {data} = await axios.get(url);
        console.log(data)
        return data['the-next-gem-ai'].eth;
      } catch (error) {
        throw error; // Re-throw for proper error handling
      }
}

module.exports = { getWethPriceUsd, getGemaiPriceEth };