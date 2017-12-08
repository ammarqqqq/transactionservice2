var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const Config = require('../config'),
      config = new Config();

//mongoose.Promise = global.Promise;
//const redisClient = require('redis').createClient;
//const redis = redisClient(6379, 'transactionredis');

var changes = [];
/*
var transactionSchema = new Schema({
  blockchainContractAddress: { type: String, required: true },
  blockchainCompiledContractSolFile:{type: String, required:true},
  blockchainAccountAddress: { type: String, required: true}
});

transactionSchema.pre('update', function (next) {
  this.updated_at =  new Date();
  next();
});

transactionSchema.pre('save', function (next) {
    // track history
    changes = [];
    var document = this;
    if (!document.isNew) {
      document.modifiedPaths().forEach(function(path) {
        var oldValue = document._original[path];
        var newValue = document[path];
        changes.push({
            path: path,
            oldValue: oldValue,
            newValue: newValue,
            when: new Date()
          });
      });
    }

    return next();
});

transactionSchema.pre('create', function (next) {
  this.created_at =  new Date();
  next();
});

transactionSchema.post('init', function() {
  this._original = this.toObject();
});

transactionSchema.methods.getChanges = function () {
  return changes;
};

var Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
*/
