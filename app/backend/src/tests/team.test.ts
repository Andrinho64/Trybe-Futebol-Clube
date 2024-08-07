import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { HTTP_STATUS, ROUTE, MSG } from '../configs/strings';
import teamModel from '../database/models/teamModel';
import TeamController from '../controllers/TeamController';
import TeamService from '../services/TeamService';

import { app } from '../app';
import Example from '../database/models/ExampleModel';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

const teamMock = [
  { id: 1, teamName: 'Avaí/Kindermann' },
  { id: 2, teamName: 'Bahia' },
  { id: 3, teamName: 'Botafogo' },
];

describe('TeamController e TeamService', () => {
  beforeEach(() => { sinon.restore(); });

  describe('GET /teams', () => {
    it('Deve retornar todos os times com status 200 OK', async () => {
      sinon.stub(teamModel, 'findAll').resolves(teamMock as any);
      const response = await chai.request(app).get(ROUTE.TEAMS);

      expect(response.status).to.equal(HTTP_STATUS.OK);
      expect(response.body).to.deep.equal(teamMock);
    });

    it('2- Deve retornar todos os times com status 200 OK', async () => {
      return chai.request(app).get(ROUTE.TEAMS).send(teamMock);
    });

    it('Deve retornar erro 500 em caso de falha na requisição', async () => {
      sinon.stub(teamModel, 'findAll').throws(new Error());
      const response = await chai.request(app).get(ROUTE.TEAMS);

      expect(response.status).to.equal(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(response.body).to.deep.equal({ message: MSG.ERROR_FETCHING_TEAMS });
    });
  });

  describe('GET /teams/:id', () => {
    it('Deve retornar um time pelo id com status 200 OK', async () => {
      sinon.stub(teamModel, 'findByPk').resolves(teamMock as any);
      const response = await chai.request(app).get(`${ROUTE.TEAMS}/1`);

      expect(response.status).to.equal(HTTP_STATUS.OK);
      expect(response.body).to.deep.equal(teamMock);
    });

    it('Deve retornar erro 404 se o time não for encontrado', async () => {
      sinon.stub(teamModel, 'findByPk').resolves(null);
      const response = await chai.request(app).get(`${ROUTE.TEAMS}/999`);

      expect(response.status).to.equal(HTTP_STATUS.NOT_FOUND);
      expect(response.body).to.deep.equal({ message: MSG.TEAM_NOT_FOUND });
    });

    it('Deve retornar erro 500 em caso de falha na requisição', async () => {
      sinon.stub(teamModel, 'findByPk').throws(new Error());
      const response = await chai.request(app).get(`${ROUTE.TEAMS}/1`);

      expect(response.status).to.equal(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(response.body).to.deep.equal({ message: MSG.ERROR_FETCHING_TEAM });
    });
  });
});
