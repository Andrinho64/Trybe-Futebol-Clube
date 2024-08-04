import { HTTP_STATUS, MSG } from '../configs/strings';
import TeamModel from '../database/models/teamModel';
import { ServiceMessage, ServiceResponse } from '../Interfaces/Service';

export default class TeamService {
  public static async getAllTeams(): Promise<ServiceResponse<any, ServiceMessage>> {
    try {
      const teams = await TeamModel.findAll();
      return { status: HTTP_STATUS.OK, data: teams };
    } catch (error) {
      return {
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        data: { message: MSG.ERROR_FETCHING_TEAMS },
      };
    }
  }

  public static async getTeamById(id: number): Promise<ServiceResponse<any, ServiceMessage>> {
    try {
      const team = await TeamModel.findByPk(id);
      if (team) {
        return { status: HTTP_STATUS.OK, data: team };
      }
      return { status: HTTP_STATUS.NOT_FOUND, data: { message: MSG.TEAM_NOT_FOUND } };
    } catch (error) {
      return {
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        data: { message: MSG.ERROR_FETCHING_TEAM },
      };
    }
  }
}
