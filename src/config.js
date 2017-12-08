module.exports = function(){
    switch(process.env.NODE_ENV){
        case 'test':
            return {
              'secret': '04050405',
              'database': 'mongodb://localhost:27017/transaction_integration_test',
              'logsDirectory': 'logs',
              'serviceName': 'transactionservice'
            };
        default:
            return {
              'secret': '04050405',
              'database': 'mongodb://transactionmongo:27017/transaction',
              'logsDirectory': 'logs',
              'serviceName': 'transactionservice'
            };
    }
};
