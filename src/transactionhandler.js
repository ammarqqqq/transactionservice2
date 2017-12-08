const Transaction = require('./models/transaction');
const serviceLookupHandler = require("./consulLookup.js");
/**
 * @module transactionhandler
 * @author Ammar Iqbal <ammar.iqbal@fintechinnovation.no>
 * */
var transactionhandler = (function() {
  var deps = {};

deps.isAddress = function (address) {
    // function isAddress(address) {
        if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        // check if it has the basic requirements of an address
        return false;
    } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
        // If it's all small caps or all all caps, return "true
        return true;
    } else {
        // Otherwise check each case
        return isChecksumAddress(address);
    }
}

deps.isChecksumAddress = function (address) {
    // Check each case
    address = address.replace('0x','');
    var addressHash = web3.sha3(address.toLowerCase());
    for (var i = 0; i < 40; i++ ) {
        // the nth letter should be uppercase if the nth digit of casemap is 1
        if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
            return false;
        }
    }
    return true;
}

/**
* Should be called to check if the contract gets properly deployed on the blockchain.
*
* @method checkForContractAddress
* @param {Object} contract
* @param {Function} callback
* @returns {Undefined}
*/
deps.checkForContractAddress = function(contract, callback){
   var count = 0,
   callbackFired = false;

   // wait for receipt
   var filter = contract._eth.filter('latest', function(e){
       if (!e && !callbackFired) {
           count++;
           // stop watching after 50 blocks (timeout)
           if (count > 50) {

               filter.stopWatching(function() {});
               callbackFired = true;

               if (callback)
                   callback(new Error('Contract transaction couldn\'t be found after 50 blocks'));
               else
                   throw new Error('Contract transaction couldn\'t be found after 50 blocks');

           } else {
               contract._eth.getTransactionReceipt(contract.transactionHash, function(e, receipt){
               if(receipt && !callbackFired) {
                  contract._eth.getCode(receipt.contractAddress, function(e, code){
                           /*jshint maxcomplexity: 6 */
                          if(callbackFired || !code)
                               return;
                 filter.stopWatching(function() {});
                 callbackFired = true;
                 if(code.length > 3) {
                    // console.log('Contract code deployed!');
                       contract.address = receipt.contractAddress;

                               // attach events and methods again after we have
                               //addFunctionsToContract(contract);
                               //addEventsToContract(contract);

                               // call callback for the second time
                               if(callback)
                                   callback(null, contract);

                           } else {
                               if(callback)
                                   callback(new Error('The contract code couldn\'t be stored, please check your gas amount.'));
                               else
                                   throw new Error('The contract code couldn\'t be stored, please check your gas amount.');
                           }
                       });
                   }
               });
           }
       }
   });
}

})();

module.exports = transactionhandler;
