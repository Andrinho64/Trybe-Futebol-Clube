import { FindOptions } from 'sequelize';
import sequelize = require('sequelize');
import { HTTP_STATUS, MSG } from '../configs/strings';
import MatchesModel from '../database/models/matchesModel';
import { ServiceMessage, ServiceResponse } from '../Interfaces/Service';
import Teams from '../database/models/teamModel';

interface MatchData {
  homeTeamId: number;
  homeTeamGoals: number;
  awayTeamId: number;
  awayTeamGoals: number;
}
export default class MatchesService {
  private static readonly queryParameters: FindOptions<any> = {
    attributes: [
      'id',
      'home_team_id',
      'home_team_goals',
      'away_team_id',
      'away_team_goals',
      'in_progress',
      [sequelize.col('homeTeam.team_name'), 'home_team_name'],
      [sequelize.col('awayTeam.team_name'), 'away_team_name'],
    ],
    include: [
      { model: Teams, as: 'homeTeam', attributes: [] },
      { model: Teams, as: 'awayTeam', attributes: [] },
    ],
  };

  private static formatMatch(match: any): any {
    return {
      id: match.dataValues.id,
      homeTeamId: match.dataValues.home_team_id,
      homeTeamGoals: match.dataValues.home_team_goals,
      awayTeamId: match.dataValues.away_team_id,
      awayTeamGoals: match.dataValues.away_team_goals,
      inProgress: !!match.dataValues.in_progress,
      homeTeam: { teamName: match.dataValues.home_team_name },
      awayTeam: { teamName: match.dataValues.away_team_name },
    };
  }

  public static async getMatches(inProgress: string | undefined):
  Promise<ServiceResponse<any, ServiceMessage>> {
    if (inProgress !== undefined) {
      this.queryParameters.where = { inProgress: (inProgress === 'true') };
    }
    try {
      const matches = await MatchesModel.findAll(this.queryParameters);
      return { status: HTTP_STATUS.OK, data: matches.map(this.formatMatch) };
    } catch (error) {
      return { status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        data: { message: MSG.ERROR_FETCHING_MATCHES } };
    }
  }

  public static async finishMatch(id: number): Promise<ServiceResponse<any, ServiceMessage>> {
    try {
      const [affectedRows] = await MatchesModel.update({ inProgress: false }, { where: { id } });
      if (affectedRows === 0) {
        return { status: HTTP_STATUS.UNPROCESSABLE_ENTITY, data: { message: MSG.INVALID_MATCH } };
      }
      return { status: HTTP_STATUS.OK, data: { message: MSG.FINISHED } };
    } catch (error) {
      return { status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        data: { message: MSG.INTERNAL_SERVER_ERROR } };
    }
  }

  public static async updateMatch(id: number, homeTeamGoals: number, awayTeamGoals: number)
    : Promise<ServiceResponse<any, ServiceMessage>> {
    try {
      const match = await MatchesModel.findByPk(id);
      if (!match) {
        return { status: HTTP_STATUS.NOT_FOUND, data: { message: MSG.INVALID_MATCH } };
      }
      match.homeTeamGoals = homeTeamGoals;
      match.awayTeamGoals = awayTeamGoals;
      await match.save();
      return { status: HTTP_STATUS.OK, data: { message: MSG.FINISHED } };
    } catch (error) {
      return { status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        data: { message: MSG.INTERNAL_SERVER_ERROR } };
    }
  }

  public static async newMatch(matchData: MatchData):
  Promise<ServiceResponse<any, ServiceMessage>> {
    try {
      if (matchData.homeTeamId === matchData.awayTeamId) {
        return { status: HTTP_STATUS.UNPROCESSABLE_ENTITY, data: { message: MSG.INVALID_MATCH } };
      }

      const homeTeam = await Teams.findByPk(matchData.homeTeamId);
      const awayTeam = await Teams.findByPk(matchData.awayTeamId);

      if (!homeTeam || !awayTeam) {
        return { status: HTTP_STATUS.NOT_FOUND, data: { message: MSG.TEAM_NO_SUCH_ID } };
      }

      const newMatch = await MatchesModel.create({ ...matchData, inProgress: true });
      return { status: HTTP_STATUS.CREATED, data: this.newFormatMatch(newMatch) };
    } catch (error) {
      return { status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        data: { message: MSG.ERROR_FETCHING_MATCHES } };
    }
  }

  private static newFormatMatch(match: any): any {
    return {
      id: match.dataValues.id,
      homeTeamId: match.dataValues.home_team_id,
      homeTeamGoals: match.dataValues.home_team_goals,
      awayTeamId: match.dataValues.away_team_id,
      awayTeamGoals: match.dataValues.away_team_goals,
      inProgress: !!match.dataValues.in_progress,
    };
  }
}
