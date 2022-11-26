import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';
import UserModel from '../models/User';

import { Response } from 'superagent';
import TeamModel from '../models/Team';
import MatchesModel from '../models/Models';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

const matchesMock = [
  {
    id: 1,
    homeTeam: 16,
    homeTeamGoals: 1,
    awayTeam: 8,
    awayTeamGoals: 1,
    inProgress: false,
    teamHome: { id: 16, teamName: "São Paulo" },
    teamAway: { id: 8, teamName: "Grêmio" },
  },
  {
    id: 2,
    homeTeam: 9,
    homeTeamGoals: 1,
    awayTeam: 14,
    awayTeamGoals: 1,
    inProgress: false,
    teamHome: { id: 9, teamName: "Internacional" },
    teamAway: { id: 14, teamName: "Santos" },
  },
];

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
  });

  describe('Rota /team/id', () => {
    const tiam = {
      id:1,
      teamName: 'Vitoria',
    }
    before(async () => {
      sinon
        .stub(TeamModel.prototype, "findOne")
        .resolves(tiam);
    });

    after(() => {
      (TeamModel.prototype.findOne as sinon.SinonStub).restore();
    });

    it('Retorna um tiam pelo id', async () => {
      const result = await chai.request(app).get('/teams/1')
      expect(result.status).to.be.equal(200);  
      expect(result.body).to.be.an('object');
    });  
  });
});

describe('Teste a rota GET/macthes ', () => {
  beforeEach( async () => {
    sinon
      .stub(MatchesModel.prototype, 'findAll')
      .resolves(matchesMock);
  });

  afterEach(() => {
    (MatchesModel.prototype.findAll as sinon.SinonStub).restore();
  });

  it('Teste a rota GET/matches em caso de sucesso', async () => {
    const result = await chai.request(app).get('/matches');
    expect(result.status).to.equal(200);
    expect(result.body).to.be.a('array');
    expect(result.body).to.deep.equal(matchesMock);
  });
});

describe('Teste a rota PATCH/macthes ', () => {
  beforeEach( async () => {
    sinon
      .stub(MatchesModel.prototype, 'update')
      .resolves();
  });

  afterEach(() => {
    (MatchesModel.prototype.update as sinon.SinonStub).restore();
  });

  it('Teste a rota PATCH/matches em caso de sucesso', async () => {
    const result = await chai.request(app).patch('/matches/1');
    expect(result.status).to.equal(200);
    expect(result.body).to.have.property('message');
  });
});