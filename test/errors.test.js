import { expect } from 'chai';
import { HttpError, HttpParseError } from '../src/errors';



describe('errors', () => {
  describe('HttpError', () => {
    it('stores properties', () => {
      let error = new HttpError(404, 'not found', 'bad');
      expect(error.status).to.equal(404);
      expect(error.message).to.equal('not found');
      expect(error.statusText).to.equal('bad');
    });


    it('has default values', () => {
      let error = new HttpError();
      expect(error.status).to.equal(500);
      expect(error.message).to.equal('Failed while making Http request.');
      expect(error.statusText).to.equal(undefined);
    });
  });


  describe('HttpParseError', () => {
    it('stores properties', () => {
      const parseError = new Error('Boo');
      let error = new HttpParseError('my-response', parseError);
      expect(error.message).to.equal('Failed to parse: \"my-response\"');
      expect(error.responseText).to.equal('my-response');
      expect(error.parseError).to.equal(parseError);
    });
  });
});
