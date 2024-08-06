import { HTTP_STATUS, MSG } from '../configs/strings';
import MatchesModel from '../database/models/matchesModel';
import TeamsModel from '../database/models/teamModel';
import { ServiceResponse } from '../Interfaces/Service';

interface TeamStats {
  name: string;
  totalPoints: number;
  totalGames: number;
  totalVictories: number;
  totalDraws: number;
  totalLosses: number;
  goalsFavor: number;
  goalsOwn: number;
}

export default class LeaderboardService {
  private static calculatePointsAndResults(matches: any[], teamId: number) {
    let totalPoints = 0;
    let totalVictories = 0;
    let totalDraws = 0;
    let totalLosses = 0;

    matches.forEach((match) => {
      if (match.home_team_id === teamId) {
        if (match.home_team_goals > match.away_team_goals) {
          totalVictories += 1;
          totalPoints += 3;
        } else if (match.home_team_goals === match.away_team_goals) {
          totalDraws += 1;
          totalPoints += 1;
        } else {
          totalLosses += 1;
        }
      }
    });

    return { totalPoints, totalVictories, totalDraws, totalLosses };
  }

  private static calculateGoals(matches: any[], teamId: number) {
    let goalsFavor = 0;
    let goalsOwn = 0;

    matches.forEach((match) => {
      if (match.home_team_id === teamId) {
        goalsFavor += match.home_team_goals;
        goalsOwn += match.away_team_goals;
      }
    });

    return { goalsFavor, goalsOwn };
  }

  private static calculateTeamStats(matches: any[], teamId: number, teamName: string): TeamStats {
    const { totalPoints, totalVictories, totalDraws, totalLosses } = this
      .calculatePointsAndResults(matches, teamId);
    const { goalsFavor, goalsOwn } = this.calculateGoals(matches, teamId);

    return {
      name: teamName,
      totalPoints,
      totalGames: totalVictories + totalDraws + totalLosses,
      totalVictories,
      totalDraws,
      totalLosses,
      goalsFavor,
      goalsOwn,
    };
  }

  public static async getHomeLeaderboard(): Promise<ServiceResponse<any, any>> {
    try {
      const teams = await TeamsModel.findAll();
      const matches = await MatchesModel.findAll({
        where: { inProgress: false },
      });

      const leaderboard = teams.map((team) => {
        const stats = this.calculateTeamStats(matches, team.id, team.teamName);
        return stats;
      });

      return { status: HTTP_STATUS.OK, data: leaderboard };
    } catch (error) {
      return { status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        data: { message: MSG.INTERNAL_SERVER_ERROR } };
    }
  }
}
