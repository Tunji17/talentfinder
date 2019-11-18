const { expect } = require('chai');
const { save } = require('../helpers');
const { refreshDbState } = require('../helpers/utils');

describe('Unit tests', () => {
  beforeEach(() => {
    refreshDbState();
  });

  it('Should successfully save user to database', (done) => {
    const candidate = {
      id: 'da3c6678-5f6b-4716-92e4-54a4b163e135',
      name: 'tunji',
      skills: ['javaScript', 'python', 'mongodb', 'postgresql']
    };
    save('Candidate', candidate);
    const { Candidate }  = global.db;
    const candidateSaved = Candidate.find(user => user.id === candidate.id);
    expect(!!candidateSaved).to.be.true;
    done();
  });
});
