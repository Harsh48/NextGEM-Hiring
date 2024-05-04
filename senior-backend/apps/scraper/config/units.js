const { default: axios } = require('axios');
const request = require('axios');

async function getWethPriceUsd() {
  const baseUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=exactly-weth&vs_currencies=usd';
  try {
    const {data} = await axios.get(baseUrl);
    return data['exactly-weth'].usd;

  } catch (error) {
    throw error; 
  }
}
 
 async function getGemaiPriceEth() {
    const baseUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=the-next-gem-ai&vs_currencies=eth';
    try {
        const {data} = await axios.get(baseUrl);
        return data['the-next-gem-ai'].eth;
      } catch (error) {
        throw error; 
      }
}

module.exports = { getWethPriceUsd, getGemaiPriceEth };