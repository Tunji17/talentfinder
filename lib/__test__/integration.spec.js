const chai = require('chai');
const chaiHttp = require('chai-http');
const { app } = require('../..');
const { refreshDbState } = require('../helpers/utils');

chai.use(chaiHttp);

const { expect } = chai;
const url = '/api/v1';

describe('Integration tests', () => {
  beforeEach(() => {
    refreshDbState();
  });

  it('Should successfully create a candidate', (done) => {
    const candidate = {
      name: 'tunji',
      skills: ['javaScript', 'python', 'mongodb', 'postgresql']
    };
    chai
      .request(app)
      .post(`${url}/candidate`)
      .send(candidate)
      .end((err, res) => {
        expect(res.status).eql(200);
        expect(res.body).to.have.property('data');
        expect(res.body.message).eql('Candidate created successfully');
        done();
      });
  });
  it('Should successfully throw an error is a field is missing', (done) => {
    const candidate = {
      skills: ['javaScript', 'python', 'mongodb', 'postgresql']
    };
    chai
      .request(app)
      .post(`${url}/candidate`)
      .send(candidate)
      .end((err, res) => {
        expect(res.status).eql(400);
        expect(res.body.message).eql('"name" is required');
        done();
      });
  });
  it('Should return 404 if there are no candidates in the database', (done) => {
    chai
      .request(app)
      .get(`${url}/candidates/search?skills=javascript,express,mongodb`)
      .end((err, res) => {
        expect(res.status).eql(404);
        expect(res.body.data).eql(null);
        expect(res.body.message).eql('We do not have a candidate that meets your query');
        done();
      });
  });
});
