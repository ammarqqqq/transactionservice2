module.exports = function(){
    switch(process.env.NODE_ENV){
        case 'test':
            return {
              'secret': '04050405',
              'database': 'mongodb://localhost:27013/transaction_integration_test',
              'logsDirectory': 'logs',
              'serviceName': 'microservices_transactionservice'
            };
        default:
            return {
              'secret': '04050405',
              'database': 'mongodb://transactionmongo:27013/transaction',
              'logsDirectory': 'logs',
              'serviceName': 'microservices_transactionservice'
            };
    }
};
