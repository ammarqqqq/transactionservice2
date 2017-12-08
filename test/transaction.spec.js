//------------------------------------
//Unit testing the transaction model
//Author: Ammar
//Created:
//Updated: -
//Updated by: -
//------------------------------------

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');

let chai = require('chai');
let expect = require('chai').expect;
let should = require('chai').should;
let assert = require('chai').assert;
let  sinon = require('sinon');
let server = require('../src/server');
//let Transaction = require('../../src/models/transaction.js');


chai.use(require('chai-http'));

sinon.stub(require('../src/consulLookup.js'), 'serviceLookup').returns(
  new Promise(
   function(resolve , reject) {
     var reply = {
       address: 'localhost',
       port: 27017,
       routePath: 'historytable'
     }
     resolve(reply)
   }
 )
);


/*
* Test the /GET info route
*/
describe('/GET info', () => {
    it('it should send an info message', (done) => {
      chai.request(server)
      .get('/info')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
    });
});
