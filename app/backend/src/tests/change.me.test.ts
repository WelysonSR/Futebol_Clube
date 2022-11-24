import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';
import UserModel from '../models/User';

import { Response } from 'superagent';
import TeamModel from '../models/Team';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('Teste a rota Login', () => {
  let chaiHttpResponse: Response;

  before(async () => {
    sinon
      .stub(UserModel.prototype, "findOne")
      .resolves({
        id: 1,
        username: 'Admin',
        role: 'admin',
        email: 'admin@admin.com',
        password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW'
      });
  });

  after(() => {
    (UserModel.prototype.findOne as sinon.SinonStub).restore();
  });

  it('caso de sucesso', async () => {
    const result = await chai.request(app).post('/login').send({
      email: 'admin@admin.com',
      password: 'secret_admin'
    });
    expect(result.status).to.be.equal(200);  
    expect(result.body).to.have.property('token');
  });

  it('caso de falha', async () => {
    const result = await chai.request(app).post('/login').send({
      email: 'teste@teste.com',
      password: '123123',
    });

    expect(result.status).to.equal(401);
    expect(result.body).to.have.key('message');
    expect(result.body.message).to.equal('Incorrect email or password');
  });
});


describe('Teste a rota Login Team', () => {
  describe('Rota Get /team', () => {
    before(async () => {
      sinon
        .stub(TeamModel.prototype, "findAll")
        .resolves([
          {
            id:1,
            teamName: 'Vitoria',
          },
          {
            id:2,
            teamName: 'Bahia',
          }],
        );
    });

    after(() => {
      (TeamModel.prototype.findAll as sinon.SinonStub).restore();
    });

    it('Retorna os times com sucesso', async () => {
      const result = await chai.request(app).get('/teams')
      expect(result.status).to.be.equal(200);  
      expect(result.body).to.be.an('array');
    });  
  })
  describe('Rota Get /team error', () => {
    before(async () => {
      sinon
        .stub(TeamModel.prototype, "findAll")
        .resolves(null);
    });

    after(() => {
      (TeamModel.prototype.findAll as sinon.SinonStub).restore();
    });

    it('Times com erro', async () => {
      const result = await chai.request(app).get('/teams')
      console.log(result.status, result.body)
      expect(result.status).to.be.equal(404);
      expect(result.body.message).to.be.equal('No teams found')
    });  
  });
});