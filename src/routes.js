const express = require('express');
const router = express.Router();
const Transaction = require('./models/transaction');
const transactionhandler = require('./transactionhandler.js');
const Config = require('./config'),
      config = new Config();
const logger = require('./logger.js');
const transfer=require('./models/bank.js');
const request = require('request');
const async = require('async');
const fs = require('fs');
const solc = require('solc');
const web3_extended = require('web3_extended');
const Web3 = require('web3');
const bigInt = require("big-integer");
//var serviceLookupHandler = require("./consulLookup.js");
var web3 = new Web3();
var server = process.env.DNSDOMAIN;
var consul_address = process.env.CONSUL_ADDRESS;

function getValidatedTx(hash, callback) {
 console.log("mining: " + web3.eth.mining);
 console.log("hashrate: " + web3.eth.hashrate)
 console.log("blockNumber: " + web3.eth.blockNumber)
  var txR = web3.eth.getTransactionReceipt(hash);
  var tx = web3.eth.getTransaction(hash);
  if ( txR == null || txR.blockNumber == undefined) {
       console.log(tx);
       getValidatedTx(hash, callback);
     } else {
       console.log("Validated: " + JSON.stringify(txR));
       callback();
     }
  }
// receiver is an  object like [ {to: ...., value ....}
function getTx(sender, receiver) {
   var nonce = eth.getTransactionCount(sender);
   for( var i = 0; i < receiver.length; i++ ) {
        eth.sendTransaction({from:sender, to:receiver[i].to, value:receiver[i].value, nonce:nonce+i});
   }
}
router.get('/info', function (req, res) {
  console.log(process.env.DNSDOMAIN)
  res.send("Welcome to the transaction service");
  console.log(server);
});

router.get('/getallaccountsforuser', function (req, res) {
  logger.info("getAllAccountsForUser", req.body.owner_id);
  try {
        transactionhandler.getAllAccountsForUser(req.body.owner_id).then(transaction => {
        if (!transaction) throw "No accounts found";
        return res.json(transaction);
      });
  }
  catch(error) {
     logger.error(error);
  }
});

router.get('/createethereumaccount', function (req, res) {
  logger.info("createEthereumAccount");
  console.log("createEthereumAccount")
  //serviceLookupHandler.serviceLookup("ethereum-8545", '').then(serverAddress => {
  //web3.setProvider(new Web3.providers.HttpProvider('http://' + serverAddress.address + ':' + serverAddress.port));
   //http://35.197.235.172:8545/
  web3.setProvider(new Web3.providers.HttpProvider('http://35.197.235.172:8545/blockchain_ethereum'));
  web3.personal.newAccount("password",function(err,result){
  if(!err){
          console.log(web3.eth.accounts)
          var password="password";
          var receiver;
          var sender = web3.eth.coinbase;
          web3.personal.unlockAccount(web3.eth.coinbase,password);
          receiver=result;
          web3.personal.unlockAccount(receiver,"password");
          console.log("Receiver address " + receiver);
          console.log("Receiver Balance " + web3.fromWei(web3.eth.getBalance(receiver)));

          var gasPrice = web3.eth.gasPrice;
          console.log("Gas price " + gasPrice);
          var gasLimit = 21000;
          var balance = web3.fromWei(web3.eth.getBalance(web3.eth.coinbase));

          var maxAmount= web3.toWei(200, "ether");
          var nonce = web3.eth.getTransactionCount(sender);
          //  var tx2= web3.eth.sendTransaction({from: sender,to: receiver,value:maxAmount,nonce:nonce +1});
          var tx2= web3.eth.sendTransaction({from: sender,to: receiver,value:maxAmount,nonce:nonce});

          console.log("Nonce " + nonce);
          getValidatedTx(tx2, function() {
             console.log("Receiver address " + receiver);
             console.log("Receiver Balance " + web3.eth.getBalance(receiver));
             console.log ("Transaction sent " + tx2);
             res.json(result);
         })
   } else {
        console.log(err);
      }
    });
  //});
});

/**
  This  route  returns  the list of all accounts
**/
router.get('/getlistofaccounts', function (req, res) {
  logger.info("getlistofAccounts");
  //serviceLookupHandler.serviceLookup("ethereum-8545", '').then(serverAddress => {
      //web3.setProvider(new Web3.providers.HttpProvider('http://' + serverAddress.address + ':' + serverAddress.port));
      //web3.setProvider(new Web3.providers.HttpProvider('https://' + server + '/ethereum'));
    web3.setProvider(new Web3.providers.HttpProvider('http://35.197.235.172:8545/blockchain_ethereum'));
      //console.log('http://' + serverAddress.address + ':' + serverAddress.port);
      //if(web3.isConnected()) {
        console.log("Ethereum - connected to RPC server");
        res.send(JSON.stringify(web3.eth.accounts));
    // }
    /* else{
         console.log("Ethereum - not connected to RPC server");
     }*/
  // });
});
/**
   This route returns  the gas balance of the coinbase account
**/
router.get('/getcoinbaseaccount', function (req, res) {
  logger.info("getCoinbaseAccount");
  //serviceLookupHandler.serviceLookup("ethereum-8545", '').then(serverAddress => {
      //web3.setProvider(new Web3.providers.HttpProvider('http://' + serverAddress.address + ':' + serverAddress.port));
      //web3.setProvider(new Web3.providers.HttpProvider('https://' + server + '/ethereum'));
    web3.setProvider(new Web3.providers.HttpProvider('http://35.197.235.172:8545/blockchain_ethereum'));
    res.send(JSON.stringify(web3.eth.coinbase));
   //});
});

router.post('/getaccountgasbalance', function (req, res) {
  logger.info("getAccountsGasBalance");
  //serviceLookupHandler.serviceLookup("ethereum-8545", '').then(serverAddress => {
  //web3.setProvider(new Web3.providers.HttpProvider('http://' + serverAddress.address + ':' + serverAddress.port));
  web3.setProvider(new Web3.providers.HttpProvider('http://35.197.235.172:8545/blockchain_ethereum'));
  var sender = web3.eth.coinbase;
  var contractAddress=req.body.blockchainContractAddress;
   var accountAddress=req.body.blockchainAccountAddress;
   if(web3.isConnected()) {
       console.log("Ethereum - connected to RPC server");
       var password="password";
       console.log("Unlocking accounts");
       web3.personal.unlockAccount(accountAddress,password);
       web3.fromWei(web3.eth.getBalance(accountAddress,function(err,result){
       if(!err){
          console.log(result);
          res.json(result);
       } else {
       console.log(err);
       }
      }));
  }
  else{
      console.log("Ethereum - not connected to RPC server");
  }
 //});
});

router.post('/getuseramount', function (req, res) {
  logger.info("getUserAmount");
  console.log("Amount (updated  actual currency ammount)");
  //serviceLookupHandler.serviceLookup("ethereum-8545", '').then(serverAddress => {
  //web3.setProvider(new Web3.providers.HttpProvider('http://' + serverAddress.address + ':' + serverAddress.port));
  web3.setProvider(new Web3.providers.HttpProvider('http://35.197.235.172:8545/blockchain_ethereum'));
  var sender = web3.eth.coinbase;

   var contractAddress=req.body.blockchainContractAddress;
   var accountAddress=req.body.blockchainAccountAddress;
  if(web3.isConnected()) {
     console.log("Ethereum - connected to RPC server");
     var password="password";
     try
     {
       console.log("Unlocking accounts");
       web3.personal.unlockAccount(sender,password);
       web3.personal.unlockAccount(accountAddress,password);
       var input = fs.readFileSync(__dirname + '/contracts/accountsetup.sol', 'utf8');
       //var compiled = web3.eth.compile.solidity(input.toString());
       //var bytecode=  web3.toHex(compiled['<stdin>:AccountSetup'].code);
       //var abi = compiled['<stdin>:AccountSetup'].info.abiDefinition;

       var compiled = solc.compile(input.toString(), 1);
       var bytecode = compiled.contracts[':AccountSetup'].bytecode;
       var  abi = JSON.parse(compiled.contracts[':AccountSetup'].interface);

       var contractInstance = web3.eth.contract(abi).at(contractAddress);
       var balance=web3.eth.getBalance(accountAddress);
       var nonce = web3.eth.getTransactionCount(sender);
       var maxAmount= web3.toWei(200, "ether");
       var tx= web3.eth.sendTransaction({from:sender, to:accountAddress, value: maxAmount,nonce:nonce});
        console.log("Tx "  + tx);
       getValidatedTx(tx, function() {
         var amount=contractInstance.todecimalamounts.call(accountAddress);
         var fraction=contractInstance.todecimalfractions.call(accountAddress);
         var result= amount + '.' + fraction;
         res.send(result);
       })
    }
     catch(e) {
        console.log(e);
        return;
      }
    }
   else{
     console.log("Ethereum - not connected to RPC server");
   }
// });
});

router.post('/transfergasbalance', function (req, res) {
  //serviceLookupHandler.serviceLookup("ethereum-8545", '').then(serverAddress => {
    //web3.setProvider(new Web3.providers.HttpProvider('http://' + serverAddress.address + ':' + serverAddress.port));
   web3.setProvider(new Web3.providers.HttpProvider('http://35.197.235.172:8545/blockchain_ethereum'));
    var accountAddress=req.body.accountAddress;
      if(web3.isConnected()) {
        console.log("Ethereum - connected to RPC server");
        var password="password";
          web3.personal.unlockAccount(accountAddress,password);
          web3.personal.unlockAccount(web3.eth.coinbase,password);

          var input = fs.readFileSync(__dirname + '/contracts/transferbalance.sol', 'utf8');
          //var compiled = web3.eth.compile.solidity(input.toString());
          //var bytecode =  web3.toHex(compiled['<stdin>:TransferBalance'].code);
          //var abi = compiled['<stdin>:TransferBalance'].info.abiDefinition;
          var compiled = solc.compile(input.toString(), 1);
          var bytecode = compiled.contracts[':TransferBalance'].bytecode;
          var  abi = JSON.parse(compiled.contracts[':TransferBalance'].interface);

          var gasEstimate = web3.eth.estimateGas({data:'0x' + bytecode});
          var transfergascontract = web3.eth.contract(abi);
          var balance=web3.eth.getBalance(web3.eth.coinbase);
          console.log("coinbase balance  " + balance);
          var gasPrice = web3.eth.gasPrice;
          console.log("Gas price " + gasPrice);
          var nonce = web3.eth.getTransactionCount(web3.eth.coinbase);
          console.log("nonce " + nonce);
          var gasLimit = 21000;
          var transfergascontractReturned = transfergascontract.new({
            data: '0x' + bytecode,
            from: web3.eth.coinbase,
            nonce: nonce,
            gas:  '0x'+ gasEstimate
            //gas: "0x280DE80"   //42000000
           }, function(e, contract){
          if(!e) {
             if(contract.address == undefined) {
                console.log("Transfer  Gas Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");
                console.log("Transaction sent " +  tx);
              }else {
              var tx = web3.eth.getTransaction(contract.transactionHash);
              var contractInstance = web3.eth.contract(abi).at(contract.address);
              var maxAmount= web3.toWei(200, "ether");
              contractInstance.transfer(web3.eth.coinbase,accountAddress, maxAmount, {from: web3.eth.coinbase }, (err, res) => {
              var balanceCoinbase = contractInstance.balances.call(web3.eth.coinbase);
              var updatedReceiverBalance = contractInstance.balances.call(accountAddress);
              var receipt = web3.eth.getTransactionReceipt(contract.transactionHash);
              res.send(receipt);
              })
             }
           }
          });
      }
      else{
          console.log("Ethereum - not connected to RPC server");
      }
//  });
});

//router.get('/netstats', function (req, res) {
  //logger.info("netstats");
//  serviceLookupHandler.serviceLookup("netstats", '').then(serverAddress => {
    //web3.setProvider(new Web3.providers.HttpProvider('http://' + serverAddress.address + ':' + serverAddress.port));
    //web3.setProvider(new Web3.providers.HttpProvider('http://' + server + '/ethereum'));
    //var result='http://' + serverAddress.address + ':' + serverAddress.port;
    //console.log("result + "+ result);
    //res.send(web3.eth.net);
    //var listening = web3.net.listening;
    //console.log(listening); // true of false
// });
//});

router.post('/savetransactionalaccountinfo', function (req, res) {
  logger.info("saveTransactionalAccountInformation", req.body);
  //serviceLookupHandler.serviceLookup("ethereum-8545", '').then(serverAddress => {
//  web3.setProvider(new Web3.providers.HttpProvider('http://' + serverAddress.address + ':' + serverAddress.port));
  web3.setProvider(new Web3.providers.HttpProvider('http://35.197.235.172:8545/blockchain_ethereum'));
  var contractAddressFrom=req.body.blockchainContractAddressFrom;
  var contractAddressTo=req.body.blockchainContractAddressTo;
  var fromAccount=req.body.accountAddressFrom;
  var toAccount= req.body.accountAddressTo;
  var amount=parseFloat(req.body.amount);
  console.log("amount " + amount);
  var  currency=req.body.currency;
  var sendersdata;
  var sendersAmount;
  var sendersFraction;
  var receiversAmount;
  var receiversFraction;
  if(web3.isConnected()) {
        console.log("Ethereum - connected to RPC server");
        var password="password";
        try
        {
          console.log("Unlocking accounts");
          web3.personal.unlockAccount(fromAccount,"password");
          web3.personal.unlockAccount(toAccount,"password");
          var input = fs.readFileSync(__dirname + '/contracts/accountsetup.sol', 'utf8');
          //var compiled = web3.eth.compile.solidity(input.toString());
          //var bytecode=  web3.toHex(compiled['<stdin>:AccountSetup'].code);
          //var abi = compiled['<stdin>:AccountSetup'].info.abiDefinition;

          var compiled = solc.compile(input.toString(), 1);
          var bytecode = compiled.contracts[':AccountSetup'].bytecode;
          var  abi = JSON.parse(compiled.contracts[':AccountSetup'].interface);

          console.log("Ethereum - connected to RPC server");
          var contractInstanceFrom = web3.eth.contract(abi).at(contractAddressFrom);
          var contractInstanceTo = web3.eth.contract(abi).at(contractAddressTo);
          var gasEstimate = web3.eth.estimateGas({
            data: '0x' +  bytecode
          });
          console.log("GasEstimateTo " + gasEstimate);

        /**********************************************************************/
        contractInstanceFrom.setCurrency(currency,{ from:fromAccount, gas: gasEstimate},  (err, res) => {
        });
       contractInstanceFrom.getFromDecimalAmount({ from:fromAccount, gas: gasEstimate},(err, result) => {
       sendersAmount= contractInstanceFrom.fromdecimalamounts.call(fromAccount);
       sendersFraction= contractInstanceFrom.fromdecimalfractions.call(fromAccount);
       receiversFraction= contractInstanceTo.todecimalfractions.call(toAccount);
       receiversAmount= contractInstanceTo.todecimalamounts.call(toAccount);

        if(sendersAmount==0){
            sendersAmount=50000- Number(amount);
          }
          else {
              sendersAmount= sendersAmount  + '.' + sendersFraction;
              sendersAmount=Number(sendersAmount)- Number(amount);
          }

          if(receiversAmount==0){
            receiversAmount=50000 + Number(amount);
          }
          else {
            receiversAmount= receiversAmount  + '.' + receiversFraction;
            receiversAmount=Number(receiversAmount) + Number(amount);
          }
          console.log("Amount " + amount);
          console.log("senders Amount " + sendersAmount);
          console.log("receivers Amount " + receiversAmount);
          var senderUpdated = sendersAmount.toString().split('.');
          sendersAmount=Number(senderUpdated[0]);
          sendersFraction=Number(senderUpdated[1]);

          var receiversUpdated = receiversAmount.toString().split('.');
          receiversAmount=Number(receiversUpdated[0]);
          receiversFraction=Number(receiversUpdated[1]);


          contractInstanceFrom.setFromDecimalAmount(sendersAmount,{ from:fromAccount, gas: gasEstimate},  (err, res) => {

          });
          contractInstanceFrom.setFromDecimalFraction(sendersFraction,{ from:fromAccount, gas: gasEstimate},  (err, res) => {

          });
          contractInstanceTo.setToDecimalAmount(receiversAmount,{ from:toAccount, gas: gasEstimate},  (err, res) => {
          });
          contractInstanceTo.setToDecimalFraction(receiversFraction,{ from:toAccount, gas: gasEstimate},  (err, res) => {
          });
            contractInstanceFrom.transferAmountWithDecimals(fromAccount,toAccount,sendersAmount,sendersFraction,receiversAmount,receiversFraction,{from:fromAccount, gas: gasEstimate},  (err, result) => {
            console.log('tx: ' + result);
            getValidatedTx(result, function() {
            sendersAmount= contractInstanceFrom.fromdecimalamounts.call(fromAccount);
            sendersFraction= contractInstanceFrom.fromdecimalfractions.call(fromAccount);

            //to make the updated  values consistent with  both  the sender and  receiver accounts
             contractInstanceFrom.setToDecimalAmount(sendersAmount,{ from:fromAccount, gas: gasEstimate},  (err, res) => {
             });
            contractInstanceFrom.setToDecimalFraction(sendersFraction,{ from:fromAccount, gas: gasEstimate},  (err, res) => {
             });
            /*********************************************************************************/
            receiversAmount= contractInstanceTo.todecimalamounts.call(toAccount);
            receiversFraction= contractInstanceTo.todecimalfractions.call(toAccount);
            var sendersAmount= sendersAmount + '.' + sendersFraction;
            var  receiversAmount=receiversAmount + '.' + receiversFraction;
                var data={
                   contractAddressFrom: contractAddressFrom,
                   fromAccount : fromAccount,
                   contractAddressTo: contractAddressTo,
                   toAccount : toAccount,
                   sendersAmount : Number(sendersAmount).toFixed(4),
                   currency :currency,
                   receiversAmount :Number(receiversAmount).toFixed(4)
               }
               res.send(data);
             })
           });
        });
    }
      catch(e) {
         console.log(e);
         return;
       }
      }
      else
      {
        console.log("Ethereum - not connected to RPC server");
      }
  // });
 });
 router.post('/getaccountcontract', function (req, res) {
  logger.info("getAccountContract");

  var accountAddress=req.body.blockchainAccountAddress;
  console.log("Account address "  + accountAddress);
  //serviceLookupHandler.serviceLookup("ethereum-8545", '').then(serverAddress => {
  //web3.setProvider(new Web3.providers.HttpProvider('http://' + serverAddress.address + ':' + serverAddress.port));
  web3.setProvider(new Web3.providers.HttpProvider('http://35.197.235.172:8545/blockchain_ethereum'));
   if(web3.isConnected()) {
      console.log("Ethereum - connected to RPC server");
      var password="password";
      try
      {
        web3.personal.unlockAccount(accountAddress,"password");
      }
      catch(e) {
          console.log(e);
          return;
      }
      var input = fs.readFileSync(__dirname + '/contracts/accountsetup.sol', 'utf8');
      //var compiled = web3.eth.compile.solidity(input.toString());
      //var bytecode=  web3.toHex(compiled['<stdin>:AccountSetup'].code);
      //var abi = compiled['<stdin>:AccountSetup'].info.abiDefinition;

      var compiled = solc.compile(input.toString(), 1);
      var bytecode = compiled.contracts[':AccountSetup'].bytecode;
      var  abi = JSON.parse(compiled.contracts[':AccountSetup'].interface);

      var nonce = web3.eth.getTransactionCount(accountAddress);
      console.log("nonce " + nonce);
      var accountscontract = web3.eth.contract(abi);
      console.log("Accounts contract " + accountscontract);
      //var gasEstimate = web3.eth.estimateGas({data: bytecode});
      var gasEstimate = web3.eth.estimateGas({
        from:  accountAddress,
        data: '0x' +  bytecode
      });

       console.log("Gas Estimate " + gasEstimate);

      var accountscontractReturned = accountscontract.new({
         data:  '0x' + bytecode,
         from: accountAddress,
         nonce: nonce,
         gas: '0x'+ gasEstimate
         //gas: "0x280DE80"   //42000000
      }, function(e, contract){
      if(!e) {
        if(contract.address == undefined) {
           console.log("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");
           var tx = web3.eth.getTransaction(contract.transactionHash);
           console.log("Tx " + tx);
          }
          else {
           var tx = web3.eth.getTransaction(contract.transactionHash);
           console.log("Contract mined! Address: " + contract.address);
           var tx = web3.eth.getTransaction(contract.transactionHash);
           var receipt = web3.eth.getTransactionReceipt(contract.transactionHash);
           res.send(receipt);
          console.log(JSON.stringify(receipt, null, 2));
        }
      }
     });
  }
    else{
     res.send("Ethereum - not connected to RPC server");
    }
//});

});

router.post('/getbankcapitalcontract', function (req, res) {
  logger.info("getbankcapitalcontract");
  console.log("domain is " + server);
  var accountAddress=req.body.blockchainAccountAddress;
  console.log("Account address "  + accountAddress);
 web3.setProvider(new Web3.providers.HttpProvider('http://35.197.235.172:8545/blockchain_ethereum'));
  //serviceLookupHandler.serviceLookup("ethereum-8545", '').then(serverAddress => {
  //web3.setProvider(new Web3.providers.HttpProvider('http://' + serverAddress.address + ':' + serverAddress.port));

  if(web3.isConnected()) {
     console.log("Ethereum - connected to RPC server");
     const input = fs.readFileSync(__dirname + '/contracts/bankcapital.sol', 'utf8');
     //var compiled = web3.eth.compile.solidity(input.toString());
     //var bytecode=  web3.toHex(compiled['<stdin>:BankCapital'].code);
     //var abi = compiled['<stdin>:BankCapital'].info.abiDefinition;

     var compiled = solc.compile(input.toString(), 1);
     var bytecode = compiled.contracts[':BankCapital'].bytecode;
     var  abi = JSON.parse(compiled.contracts[':BankCapital'].interface);

    console.log("Unlocking coinbase account");
    var password="password";
    try
    {
      web3.personal.unlockAccount(accountAddress,"password");
    }
    catch(e) {
        console.log(e);
        return;
    }

    var bankcapitalcontract = web3.eth.contract(abi);
    var nonce = web3.eth.getTransactionCount(accountAddress);
    console.log("nonce " + nonce);
    var gasEstimate = web3.eth.estimateGas({
      data: '0x' +  bytecode
    });
     var bankcapitalcontractReturned = bankcapitalcontract.new({
     data:  '0x' + bytecode,
     from: accountAddress,
     nonce: nonce,
     gas: '0x' + gasEstimate  //42000000
     }, function(e, contract){
         if(!e) {
             //console.log("Contract:" + JSON.stringify(contract));
            if(contract.address == undefined) {
               console.log("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");
               //JSON.stringify("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");
            }else {
             var tx = web3.eth.getTransaction(contract.transactionHash);
             console.log("Tx:" + tx);
             console.log("Contract mined! Address: " + contract.address);
             var receipt = web3.eth.getTransactionReceipt(contract.transactionHash);
             console.log("receipt:" + receipt);
             res.send(receipt);
          }
         }
      });
   }
  else
  {
        console.log("Ethereum - no conection to RPC server");
  }
 //});
});
module.exports = router;
