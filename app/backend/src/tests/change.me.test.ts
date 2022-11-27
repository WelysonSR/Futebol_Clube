import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import * as jwt from 'jsonwebtoken';
import App from '../app';
import UserModel from '../models/User';

import { Response } from 'superagent';
import TeamModel from '../models/Team';
import MatchesModel from '../models/Models';
import LeaderBoardModel from '../models/LeaderBoard';

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

const userMock = {
  id: 1,
  username: 'Admin',
  role: 'admin',
  email: 'admin@admin.com',
  password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW',
}

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
            id: 1,
            teamName: 'Vitoria',
          },
          {
            id: 2,
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
      id: 1,
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
  beforeEach(async () => {
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
  beforeEach(async () => {
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

describe('Teste a rota GET /validate', () => {
  beforeEach(async () => {
    sinon
      .stub(jwt, 'verify')
      .callsFake(() => {
        return Promise.resolve({ sucess: 'Token is valid' });
      });
    sinon.stub(UserModel.prototype, 'findOne')
      .resolves(userMock);
  });

  afterEach(() => {
    (UserModel.prototype.findOne as sinon.SinonStub).restore();
    (jwt.verify as sinon.SinonStub).restore();
  });

  it('Teste a validação em caso de sucesso', async () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsImlhdCI6MTY2NDUwNDc4MCwiZXhwIjoxNjY0NTkxMTgwfQ.lYN2ImWYl-ejFGAMEClZzcFS6I3Bx4PX2lfS47v9rus';
    const result = await chai.request(app).get('/login/validate').set('authorization', token);

    expect(result.status).to.equal(200);
    expect(result.body).to.have.property('role');
    expect(result.body.role).to.be.equal('admin');
  });

  it('Teste a a validação em caso de usuário ser o Administrador', async () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsImlhdCI6MTY2NDUwNDc4MCwiZXhwIjoxNjY0NTkxMTgwfQ.lYN2ImWYl-ejFGAMEClZzcFS6I3Bx4PX2lfS47v9rus';
    const result = await chai.request(app).get('/login/validate').set('authorization', token);

    expect(result.status).to.equal(200);
    expect(result.body).to.have.property('role');
    expect(result.body.role).to.be.equal('admin');
  });
});

const mockLeaderboardHome = [
  {
    name: 'Santos',
    totalPoints: 9,
    totalGames: 3,
    totalVictories: 3,
    totalDraws: 0,
    totalLosses: 0,
    goalsFavor: 9,
    goalsOwn: 3,
    goalsBalance: 6,
    efficiency: '100.00'
  },
  {
    name: 'Palmeiras',
    totalPoints: 7,
    totalGames: 3,
    totalVictories: 2,
    totalDraws: 1,
    totalLosses: 0,
    goalsFavor: 10,
    goalsOwn: 5,
    goalsBalance: 5,
    efficiency: '77.78'
  },
  {
    name: 'Corinthians',
    totalPoints: 6,
    totalGames: 2,
    totalVictories: 2,
    totalDraws: 0,
    totalLosses: 0,
    goalsFavor: 6,
    goalsOwn: 1,
    goalsBalance: 5,
    efficiency: '100.00'
  },
]

const mockLeaderboardAway = [
  {
    "name": "Palmeiras",
    "totalPoints": 6,
    "totalGames": 2,
    "totalVictories": 2,
    "totalDraws": 0,
    "totalLosses": 0,
    "goalsFavor": 7,
    "goalsOwn": 0,
    "goalsBalance": 7,
    "efficiency": "100.00"
  },
  {
    "name": "Corinthians",
    "totalPoints": 6,
    "totalGames": 3,
    "totalVictories": 2,
    "totalDraws": 0,
    "totalLosses": 1,
    "goalsFavor": 6,
    "goalsOwn": 2,
    "goalsBalance": 4,
    "efficiency": "66.67"
  },
]

describe('teste leaderboard', () => {
  let chaiHttpResponse: Response;
  afterEach(sinon.restore);

  it('leaderboard get', async () => {
    chaiHttpResponse = await chai.request(app)
      .get('/leaderboard')
    expect(chaiHttpResponse.status).to.be.eq(200)
  })

  it('leaderboard get home', async () => {
    chaiHttpResponse = await chai.request(app)
      .get('/leaderboard/home')
    expect(chaiHttpResponse.status).to.be.eq(200)
  })
  it('leaderboard get away', async () => {
    chaiHttpResponse = await chai.request(app)
      .get('/leaderboard/away')
    expect(chaiHttpResponse.status).to.be.eq(200)
  })
})

describe('Teste a rota GET /leaderboard', () => {
  describe('Teste a rota GET /leaderboard/home', () => {
    beforeEach(async () => {
      return sinon
        .stub(LeaderBoardModel.prototype, 'getAllHome')
        .resolves();
    });

    afterEach(() => {
      (LeaderBoardModel.prototype.getAllHome as sinon.SinonStub)
        .restore();
    });

    it('Teste a rota GET/leaderboard/home em caso de sucesso', async () => {
      const result = await chai.request(app).patch('/leaderboard/home').send(mockLeaderboardHome);
      expect(result.status).to.equal(200);
      expect(result.body).to.be.a('array');
      expect(result.body).to.deep.equal(mockLeaderboardHome);
    });
  });

  describe('Teste a rota GET /leaderboard/away', () => {
    beforeEach(async () => {
      return sinon
        .stub(LeaderBoardModel.prototype, 'getAllAway')
        .resolves();
    });

    afterEach(() => {
      (LeaderBoardModel.prototype.getAllAway as sinon.SinonStub)
        .restore();
    });

    it('Teste a rota GET/leaderboard/away em caso de sucesso', async () => {
      const result = await chai.request(app).patch('/leaderboard/away').send(mockLeaderboardAway);
      expect(result.status).to.equal(200);
      expect(result.body).to.be.a('array');
      expect(result.body).to.deep.equal(mockLeaderboardAway);
    });
  });
});

