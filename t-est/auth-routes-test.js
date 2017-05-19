'use strict';


const superagent = require('superagent');
const devMocks = require('./lib/mock-dev');
const serverControl = require('./lib/server-control');
const expect = require('chai').expect;
// const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const User = require('../model/user');
const Dev =require('../model/dev');
const server = require('../server');
const chai = require('chai');
const http = require('chai-http');

require('../server.js');
mongoose.Promise = Promise;

// const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  username: 'chris',
  password: '1234',
  email: 'c@c.com',
};

chai.use(http);

let token = [];

describe('=================================================\n  server - test\n  =================================================\n',
function() {
  before(serverControl.startServer);
  after(serverControl.killServer);

  let userObj = [];

  describe('/wrong endpoint', function() {
    it('should respond with a 404 on bad request', done => {
      chai.request(server)
      .post('/')
      .send({})
      .end((err, res) => {
        console.log(res.status);
        expect(res.status).to.equal(404);
        done();
      });
    });
  });

  describe('POST || signup method', function() {

    describe('/signup endpoint', function() {
      it('should respond with a 200 on proper request', done => {
        chai.request(server)
        .post('/api/signup')
        .send(exampleUser)
        // {username:'chris', email:'c@c.com', password:'1234'}
        .end((err, res) => {
          console.log(res.status, res.body);
          token.push(res.body);
          userObj.push(res.request._data);
          expect(res.status).to.equal(200);
          done();
        });
      });
    });
  });
});

describe('Auth Routes', function() {
  describe('POST: /api/signup', function() {
    describe('with a valid body', function() {
      // after( done => {
      //   User.remove({})
      //   .then(() => done())
      //   .catch(done);
      // });

      // it('should return a token', done => {
      //   console.log('exampleUser ', exampleUser);
      //   request.post(`${url}/api/signup `)
      //   .send(exampleUser)
      //   .end((err, res) => {
      //     if (err) return done(err);
      //     console.log('\ntoken:', res.text, '\n');
      //     expect(res.status).to.equal(200);
      //     expect(res.text).to.be.a('string');
      //     done();
      //   });
      // });
    });
  });

  describe('GET: /api/signin', function() {
    describe('with a valid body', function() {

      it('should return a token', done => {
        // request.get(`${url}/api/signin`)
        // .auth('chris', '1234')
        // .end((err, res) => {
        //   if (err) return done(err);
        //   // console.log('\nuser:', this.tempUser);
        //   console.log('\ntoken:', res.text);
        //   token.push(res.text);
        //   console.log(res.status);
        //   expect(res.status).to.equal(200);
        // });
        done();
      });
    });
  });

  describe('DELETE user', function() {
    describe('/api/user/:id', function() {
      it('should return a 200 if successful', done => {
        // request.delete(`${url}/api/signin`)
        done();
      });
    });
  });

  describe('POST Dev', function() {
    it('should return a 200 status on a proper post', done => {
      console.log(token[0]);
      // request.post(`${url}/api/dev`)
      // .send({'username': 'exampleuser', 'website': 'macrohard.com', 'state': 'Washington', 'phone': '555-4059', 'email': 'exampleuser@test.com'})
      // .set({
      //   'Authorization': `Bearer ${token[0]}`,
      //   'Content-Type': 'application/json',
      // })
      // // .auth('exampleuser', '1234')
      // .end((err, res) => {
      //   if(err) return done(err);
      //   console.log(res.status);
      //
      //   // expect(res.status).to.equal(200);
      //
      // });
      done();
    });
  });
});

const baseURL = `http://localhost:${process.env.PORT}`;

describe('=================================================\n  testing dev-router\n  =================================================\n',
function(){

  before(serverControl.startServer);
  after(serverControl.killServer);

  after(done => {
    User.remove({})
    .then(() => done)
    .catch(done);
    done();
  });

  after(done => {
    Dev.remove({})
    .then(() => done)
    .catch(done);
    done();
  });

  let devProf = [];

  describe('testing POST /api/dev', function(){
    let results = [];

    it('should respond with a 200 on good request', function(done){
      console.log('token', token[0]);
      superagent.post(`${baseURL}/api/dev`)
      .send({username:'chris', email:'c@c.com', phone:'123-4567'})
      .set({
        'Authorization': `Bearer ${token[0]}`,
        'Content-Type': 'application/json',
      })
      .then(res => {
        devProf.push(res.body);
        console.log('dev obj', devProf);

        expect(res).to.have.status(200);
      })
      .catch(err => {
        console.log('the error im lookin at', err);
      });

      done();
    });

    describe('GET: /api/signin', function() {
      describe('with a valid body', function() {

        it('should return a token', done => {
          superagent.get(`${baseURL}/api/signin`)
          .auth('chris', '1234')
          .end((err, res) => {
            if (err) return done(err);
            console.log('\ntoken:', res.text);
            console.log(res.status);

            expect(res.status).to.equal(200);
            done();
          });
        });
      });
    });

    it('should respond with a 401 if a field is missing', done => {
      superagent.post(`${baseURL}/api/dev`)
      .send({devMocks})
      .then(done)
      .catch(err => {
        console.log('err.error', err.message);
        results.push(err.message);

        expect(err.status).to.equal(401);
        done();
      })
      .catch(done);
    });

    it('should respond with Unauthorized if a field is missing', done => {

      expect(results[0]).to.equal('Unauthorized');
      results.pop();
      done();
    });

    it('should respond with a 404 given a bad endpoint', done => {
      superagent.post(`${baseURL}/api/badEndpoint`)
      .send({})
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(404);
        done();
      })
      .catch(done);
    });

    it('should return a 401 error for improper signup', function(done){
      superagent.post(`${baseURL}/api/dev`)
      .send({})
      .then(done)
      .catch(err => {
        console.log('err.status', err.status);
        results.push(err.message);
        expect(err.status).to.equal(401);
        done();
      });
    });

    it('should return Unauthorized error for improper signup', function(done){

      expect(results[0]).to.equal('Unauthorized');
      results.pop();
      done();
    });
  });

  describe('testing GET /api/devlist', function(){
    beforeEach(devMocks.bind(this));
    let results = [];

    it('should respond with a 200 status code on good request', (done) => {
      superagent.get(`${baseURL}/api/devlist`)
      .then(res => {

        expect(res.status).to.equal(200);
        done();
      })
      .catch(done);
    });

    it('should respond with a 404 status code on bad request', (done) => {
      superagent.get(`${baseURL}/api/badlogin`)
      .then(done)
      .catch(err => {
        console.log('err.message', err.message);
        results.push(err.message);

        expect(err.status).to.equal(404);
        done();
      })
      .catch(done);
    });

    it('should respond with Not Found status code on bad request', (done) => {
      expect(results[0]).to.equal('Not Found');
      results.pop();
      done();
    });
  });

  describe('DELETE dev', function() {

    describe('/api/dev/:id', function() {
      it('should return a 200 if successful', done => {
        superagent.delete(`${baseURL}/api/dev/${devProf[0]._id}`)
        .set({
          'Authorization': `Bearer ${token[0]}`,
          'Content-Type': 'application/json',
        })
        .then(res => {
          console.log(res.status);
        });
        done();
      });

      it('should remove the record from the db', done => {

        done();
      });
    });
  });
});
