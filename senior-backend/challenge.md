# Technical Test instructions for Senior Backend at NextGem

The test is simple. You will create two scripts on NodeJS (one named "scraper" and another named "events"). 

## The Scraper Server

This is the $GEMAI ERC20 contract: 0xFBE44caE91d7Df8382208fCdc1fE80E40FBc7e9a - you will be using it for this task

1.  The scraper server will listen to transfer events on the GEMAI contract
2.  Transfer events to the Uniswap V3 Router interacting with the WETH pool of the GEMAI shall be processed in the following manner
- You shall log wether the swap transaction is a "BUY" or "SELL" transaction.
- Every time a new swap transaction is logged, you will save this on a MongoDB database using Mongoose. The schema for the doc you should save the transaction is as follows:
  - Collection Name: transactions
  - Fields:
    -  type [STRING]: (buy/sell)
    -  txid [STRING]: transaction hash of the swap transaction
    -  value_usd [NUMBER]: the USD value of the swap transaction
    -  value_weth [NUMBER]: The ETH value of the swap transaction
    -  value_gemai [NUMBER]: The GEMAI amount swapped in the transaction
    -  author [STRING]: the address of the identity that created said transaction
    -  INCLUDE DEFAULT createdAt and updatedAt fields
  
  - NOTE: for the USD value you can calculate it directly with the WETH pool by knowing the current value in eth of GEMAI and the current usd value of WETH (You can use any api you want to get the current USD ETH value)

3.  Once the transaction is saved, emit a new socket.io event to all sockets that says "new_swap" and provide the ObjectID of the document that just got created inside the socket.io event.

## The Events Server
1.   This script will create a socket.io client directly with the scraper server and connect to the same database the scraper server is using
2.   When a new_swap event is received, grab the ObjectId from the event and look for the document in the transactions collection with that id. console.log the all the fields.
3.   Expose one endpoint: GET /swaps.
   -  The swaps endpoint is paginated (include page and limit params)
   -  They are ordered from newest to oldest (newest at page 1)
   -  Returns array of documents from transactions collection with all corresponding fields Scraper server creates (type, txid, etc) in JSON
   -  has a valueMin and valueMax parameter, and returns all swaps that have a USD value within valueMin and valueMax (use the value_usd field in the transactions collection)
   -  MAKE SURE your endpoint is battle-tested against misuse of the api (I put words in valueMin instead of numbers, etc).
   -  The return value should be { status: xxx, data:  } with status being true or false (false if theres an error or query is malformed). If status is false, include a message field in the return json explaining why the query failed.

Good luck! :D
