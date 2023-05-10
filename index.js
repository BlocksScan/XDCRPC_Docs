const Web3 = require("web3");

async function main() {
  // Configuring the connection to an Ethereum node
  const network = process.env.APOTHEM_NETWORK;
  const web3 = new Web3(
    new Web3.providers.HttpProvider(
        `https://apothem.xdcrpc.com/`
    )
  );
  // Creating a signing account from a private key
  const signer = web3.eth.accounts.privateKeyToAccount(
    process.env.SIGNER_PRIVATE_KEY
  );
  web3.eth.accounts.wallet.add(signer);

  // Estimatic the gas limit
  var limit = web3.eth.estimateGas({
    from: signer.address, 
    to: "0x35ef9e7eCB979297907370C2Ab64ef4a8a3F2FbE",
    value: web3.utils.toWei("1")
    }).then(console.log);
    
  // Creating the transaction object
  const tx = {
    from: signer.address,
    to: "0x35ef9e7eCB979297907370C2Ab64ef4a8a3F2FbE",
    value: web3.utils.numberToHex(web3.utils.toWei('1', 'ether')),
    gas: web3.utils.toHex(limit),
    nonce: web3.eth.getTransactionCount(signer.address),
    chainId: 51,                  
  };

  signedTx = await web3.eth.accounts.signTransaction(tx, signer.privateKey)
  console.log("Raw transaction data: " + signedTx.rawTransaction)

  // Sending the transaction to the network
  const receipt = await web3.eth
    .sendSignedTransaction(signedTx.rawTransaction)
    .once("transactionHash", (txhash) => {
      console.log(`Mining transaction ...`);
      console.log(`https://${network}.blocksscan.io/tx/${txhash}`);
    });
  // The transaction is now on chain!
  console.log(`Mined in block ${receipt.blockNumber}`);

}

require("dotenv").config();
main();