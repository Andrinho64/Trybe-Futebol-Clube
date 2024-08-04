/* import * as sinon from 'sinon';
import * as chai from 'chai';
import request from 'supertest';
// @ts-ignore
import chaiHttp = require('chai-http');
import { HTTP_STATUS, ROUTE, MSG } from '../configs/strings';
import teamModel from '../database/models/teamModel';

import { app } from '../app';
import Example from '../database/models/ExampleModel';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

const teamsMock = [
  { id: 1, name: 'Team 1' },
  { id: 2, name: 'Team 2' },
];

const teamMock = { id: 1, name: 'Team 1' };

describe('TeamService', () => {
  beforeEach(() => { sinon.restore(); });

  describe('GET /teams', () => {
    it('Deve retornar todos os times com status 200 OK', async () => {
      sinon.stub(teamModel, 'findAll').resolves(teamsMock as any);
      const response = await request(app).get(ROUTE.TEAMS);

      expect(response.status).to.equal(HTTP_STATUS.OK);
      expect(response.body).to.deep.equal(teamsMock);
    });

    it('Deve retornar erro 500 em caso de falha na requisição', async () => {
      sinon.stub(teamModel, 'findAll').throws(new Error());
      const response = await request(app).get(ROUTE.TEAMS);

      expect(response.status).to.equal(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(response.body).to.deep.equal({ message: MSG.ERROR_FETCHING_TEAMS });
    });
  });

  describe('GET /teams/:id', () => {
    it('Deve retornar um time pelo id com status 200 OK', async () => {
      sinon.stub(teamModel, 'findByPk').resolves(teamMock as any);
      const response = await request(app).get(`${ROUTE.TEAMS}/1`);

      expect(response.status).to.equal(HTTP_STATUS.OK);
      expect(response.body).to.deep.equal(teamMock);
    });

    it('Deve retornar erro 404 se o time não for encontrado', async () => {
      sinon.stub(teamModel, 'findByPk').resolves(null);
      const response = await request(app).get(`${ROUTE.TEAMS}/999`);

      expect(response.status).to.equal(HTTP_STATUS.NOT_FOUND);
      expect(response.body).to.deep.equal({ message: MSG.TEAM_NOT_FOUND });
    });

    it('Deve retornar erro 500 em caso de falha na requisição', async () => {
      sinon.stub(teamModel, 'findByPk').throws(new Error());
      const response = await request(app).get(`${ROUTE.TEAMS}/1`);

      expect(response.status).to.equal(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(response.body).to.deep.equal({ message: MSG.ERROR_FETCHING_TEAM });
    });
  });
});
 */