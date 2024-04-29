const connectDB = require('./config/db')
const Transaction= require('./models/transaction.model')
const socketIO = require('socket.io');
require('dotenv').config()
const app = require('http').createServer();
const { ethers } = require('ethers');
const commonABI = require('./abi/TransferAbi.json')
const {getGemaiPriceEth, getWethPriceUsd}=  require('./config/units');
const PORT = process.env.PORT || 3005

const INFURA_URL = process.env.INFURA_URL
const GEMAI_CONTRACT_ADDRESS = process.env.GEMAI_CONTRACT_ADDRESS
const UNISWAP_V3_ROUTER = process.env.UNISWAP_V3_ROUTER


// connecting to db
connectDB();

async function main(){
const io = socketIO(app);

io.on('connection', (socket) => {
  console.log('Client connected to socket.io');
});

  const provider = new ethers.JsonRpcProvider(INFURA_URL);
  const contract = new ethers.Contract(GEMAI_CONTRACT_ADDRESS,[commonABI], provider);

  const filter = contract.filters.Transfer(null,UNISWAP_V3_ROUTER, null); // Listen for transfers to Uniswap V3 Router
  

  const listener = async (event) => {
    console.log('New transfer event:', event.transactionHash);
    const { from, to, value } = event.args;
    const isBuy = from !== UNISWAP_V3_ROUTER;
    const type = isBuy ? 'buy' : 'sell';

 
    const wethPriceUsd = await getWethPriceUsd();
    const gemaiPriceEth = await getGemaiPriceEth();
    formatValue = ethers.formatUnits(value.toString(), 18).toString()
   
    const valueUsd = formatValue*gemaiPriceEth*wethPriceUsd;
    const valueWeth = formatValue*gemaiPriceEth;
     


    console.log(`New ${type} swap detected!`);
      const newTransaction = new Transaction({
        type,
        txid: event.transactionHash,
        value_usd: valueUsd,
        value_weth: valueWeth,
        value_gemai: formatValue,
        author: from,
      });
    
      await newTransaction.save();
      console.log('Saved new swap transaction:', newTransaction);
    
      // Emit "new_swap" event with the saved transaction's ID
      io.emit('new_swap', newTransaction._id);
  };

  contract.on(filter, listener)
    .then(() => {
      console.log('Listening for transfers from block');
    })
}
main()

app.listen(PORT,()=>{
    console.log('app is running on port '+ PORT)
})