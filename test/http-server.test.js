import { expect } from 'chai';
import http from '../server';
import nodeHttp from 'http';
import { HttpError, HttpParseError } from '../src/errors';
import nock from 'nock';

let requestBody;
beforeEach(() => { requestBody = undefined; });


const stubGET = (path, status, response) => {
  nock('http://domain.com').get(path).reply(status, response);
};

const stubPOST = (path, status, response) => {
  nock('http://domain.com').post(path).reply(status, response);
};

const stubPUT = (path, status, response) => {
  nock('http://domain.com').put(path).reply(status, response);
};

const stubDELETE = (path, status, response) => {
  nock('http://domain.com').delete(path).reply(status, response);
};


// ----------------------------------------------------------------------------


describe('Http (Server)', () => {
  it('exposes error classes', () => {
    expect(http.HttpError).to.equal(HttpError);
    expect(http.HttpParseError).to.equal(HttpParseError);
  });


  describe('get()', () => {
    it('resolves a promise with a [String] response', (done) => {
      stubGET('/user', 200, 'hello');
      http.get('http://domain.com/user')
      .then((result) => {
        expect(result).to.equal('hello');
        done();
      });
    });


    it('resolves a promise with a [Number] response', (done) => {
      stubGET('/user', 200, 123);
      http.get('http://domain.com/user')
      .then((result) => {
        expect(result).to.equal(123);
        done();
      });
    });

    it('resolves a promise with a [Boolean] response', (done) => {
      stubGET('/user', 200, true);
      http.get('http://domain.com/user')
      .then((result) => {
        expect(result).to.equal(true);
        done();
      });
    });


    it('resolves a promise with an [Object] response (JSON)', (done) => {
      stubGET('/user', 200, { name:'phil' });
      http.get('http://domain.com/user')
      .then((result) => {
        expect(result).to.eql({ name:'phil' });
        done();
      });
    });

    it('resolves a promise with an [Array] response (JSON)', (done) => {
      stubGET('/user', 200, [1, 2, 3]);
      http.get('http://domain.com/user')
      .then((result) => {
        expect(result).to.eql([1, 2, 3]);
        done();
      });
    });


    it('throws an [HttpError] when status code is not 200', (done) => {
      stubGET('/user', 404);
      http.get('http://domain.com/user')
      .catch(HttpError, (err) => {
          expect(err.message).to.equal('Failed while making Http request.');
          expect(err.status).to.equal(404);
          done()
      });
    });

    it('throws if the response cannot be parsed as JSON', (done) => {
      stubGET('/user', 200, '{not-json}');
      http.get('http://domain.com/user')
      .catch(HttpParseError, (err) => {
          expect(err.message).to.equal(`Failed to parse: '{not-json}'`);
          expect(err.responseText).to.equal('{not-json}');
          expect(err.parseError.message).to.equal('Unexpected token n');
          done();
      });
    });
  });


  describe('post | put | delete', () => {
    it('sends POSTs', (done) => {
      stubPOST('/user', 200, { result:true })
      http.post('http://domain.com/user', 999)
      .then((result) => {
        expect(result).to.eql({ result:true });
        done();
      });
    });

    it('sends PUTs', (done) => {
      stubPUT('/user', 200, { result:true })
      http.put('http://domain.com/user', 999)
      .then((result) => {
        expect(result).to.eql({ result:true });
        done();
      });
    });

    it('sends DELETEs', (done) => {
      stubDELETE('/user', 200, { result:true })
      http.delete('http://domain.com/user', 999)
      .then((result) => {
        expect(result).to.eql({ result:true });
        done();
      });
    });
  });
});
