const { expect } = require('chai');
const sinon = require('sinon');
require('sinon-mongoose');

const User = require('../models/User');
const Ticket = require('../models/Ticket');

describe('User Model', () => {
  it('should create a new user', (done) => {
    const UserMock = sinon.mock(new User({ email: 'test@gmail.com', password: 'root' }));
    const user = UserMock.object;

    UserMock
      .expects('save')
      .yields(null);

    user.save((err) => {
      UserMock.verify();
      UserMock.restore();
      expect(err).to.be.null;
      done();
    });
  });

  it('should return error if user is not created', (done) => {
    const UserMock = sinon.mock(new User({ email: 'test@gmail.com', password: 'root' }));
    const user = UserMock.object;
    const expectedError = {
      name: 'ValidationError'
    };

    UserMock
      .expects('save')
      .yields(expectedError);

    user.save((err, result) => {
      UserMock.verify();
      UserMock.restore();
      expect(err.name).to.equal('ValidationError');
      expect(result).to.be.undefined;
      done();
    });
  });

  it('should not create a user with the unique email', (done) => {
    const UserMock = sinon.mock(User({ email: 'test@gmail.com', password: 'root' }));
    const user = UserMock.object;
    const expectedError = {
      name: 'MongoError',
      code: 11000
    };

    UserMock
      .expects('save')
      .yields(expectedError);

    user.save((err, result) => {
      UserMock.verify();
      UserMock.restore();
      expect(err.name).to.equal('MongoError');
      expect(err.code).to.equal(11000);
      expect(result).to.be.undefined;
      done();
    });
  });

  it('should find user by email', (done) => {
    const userMock = sinon.mock(User);
    const expectedUser = {
      _id: '5700a128bd97c1341d8fb365',
      email: 'test@gmail.com'
    };

    userMock
      .expects('findOne')
      .withArgs({ email: 'test@gmail.com' })
      .yields(null, expectedUser);

    User.findOne({ email: 'test@gmail.com' }, (err, result) => {
      userMock.verify();
      userMock.restore();
      expect(result.email).to.equal('test@gmail.com');
      done();
    });
  });

  it('should remove user by email', (done) => {
    const userMock = sinon.mock(User);
    const expectedResult = {
      nRemoved: 1
    };

    userMock
      .expects('remove')
      .withArgs({ email: 'test@gmail.com' })
      .yields(null, expectedResult);

    User.remove({ email: 'test@gmail.com' }, (err, result) => {
      userMock.verify();
      userMock.restore();
      expect(err).to.be.null;
      expect(result.nRemoved).to.equal(1);
      done();
    });
  });
});

describe('Ticket Model', () => {
  it('should create a new ticket', (done) => {
    const UserMock = sinon.mock(new User({ email: 'test@gmail.com', password: 'root' }));
    const user = UserMock.object;
    const TicketMock = sinon.mock(new Ticket({ 
      email: user.email,
      name: 'Jack Kim',
      nationality: 'South Korea',
      mobile: '000-0000-0000',
      affiliation: '?',
      position: '??',
      advisor: '???',
      isInKorea: true,
      isPoster: true,
      isPaid: false, }));
    const ticket = TicketMock.object;

    UserMock
      .expects('save')
      .yields(null);

    user.save((err) => {
      UserMock.verify();
      UserMock.restore();
      expect(err).to.be.null;
    });

    TicketMock
      .expects('save')
      .yields(null);

    ticket.save((err) => {
      TicketMock.verify();
      TicketMock.restore();
      expect(err).to.be.null;
      done();
    });
  });

  it('should return error if ticket is already created but tried to create new one', (done) => {
    const UserMock = sinon.mock(User({ email: 'test@gmail.com', password: 'root' }));
    const user = UserMock.object;
    const TicketMock2 = sinon.mock(new Ticket({ 
      email: user.email,
      name: 'Jack Lee',
      nationality: 'South Korea',
      mobile: '000-0000-0001',
      isInKorea: true,
      isPoster: false,
      isPaid: true, }));
    const ticket2 = TicketMock2.object;
    const expectedError = {
      name: 'MongoError',
      code: 11000
    }

    TicketMock2
      .expects('save')
      .yields(expectedError);

    ticket2.save((err, result) => {
      TicketMock2.verify();
      TicketMock2.restore();
      expect(err.name).to.equal('MongoError');
      expect(err.code).to.equal(11000);
      expect(result).to.be.undefined;
      done();
    });
  });

  it('should refund ticket by email', (done) => {
    const UserMock = sinon.mock(User({ email: 'test@gmail.com', password: 'root' }));
    const user = UserMock.object;
    const TicketMock = sinon.mock(new Ticket({ 
      email: user.email,
      name: 'Jack Kim',
      nationality: 'South Korea',
      mobile: '000-0000-0000',
      isInKorea: true,
      isPoster: true,
      isPaid: false, }));
    const ticket = TicketMock.object;

    const expectedResult = {
      nRemoved: 1
    };

    TicketMock
      .expects('remove')
      .withArgs({ email: 'test@gmail.com' })
      .yields(null, expectedResult);

    ticket.remove({ email: 'test@gmail.com' }, (err, result) => {
      TicketMock.verify();
      TicketMock.restore();
      expect(err).to.be.null;
      expect(result.nRemoved).to.equal(1);
      done();
    });
  });
});
