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
  goalsBalance: number;
  efficiency: string;
}

export default class LeaderboardService {
  private static calculatePointsAndResults(matches: MatchesModel[], teamId: number)
    : Pick<TeamStats, 'totalPoints' | 'totalVictories' | 'totalDraws' | 'totalLosses'> {
    return matches
      .filter((match) => match.homeTeamId === teamId)
      .reduce((acc, match) => {
        if (match.homeTeamGoals > match.awayTeamGoals) {
          acc.totalVictories += 1;
          acc.totalPoints += 3;
        } else if (match.homeTeamGoals === match.awayTeamGoals) {
          acc.totalDraws += 1;
          acc.totalPoints += 1;
        } else {
          acc.totalLosses += 1;
        }
        return acc;
      }, { totalPoints: 0, totalVictories: 0, totalDraws: 0, totalLosses: 0 });
  }

  private static calculateGoals(matches: MatchesModel[], teamId: number)
    : Pick<TeamStats, 'goalsFavor' | 'goalsOwn' > {
    return matches
      .filter((match) => match.homeTeamId === teamId)
      .reduce((acc, match) => {
        acc.goalsFavor += match.homeTeamGoals;
        acc.goalsOwn += match.awayTeamGoals;
        return acc;
      }, { goalsFavor: 0, goalsOwn: 0 });
  }

  private static calculateTeamStats(matches: MatchesModel[], teamId: number, name: string)
    : TeamStats {
    const { totalPoints, totalVictories, totalDraws, totalLosses } = this
      .calculatePointsAndResults(matches, teamId);
    const { goalsFavor, goalsOwn } = this.calculateGoals(matches, teamId);
    const totalGames = totalVictories + totalDraws + totalLosses;
    return {
      name,
      totalPoints,
      totalVictories,
      totalDraws,
      totalLosses,
      goalsBalance: goalsFavor - goalsOwn,
      totalGames,
      goalsFavor,
      goalsOwn,
      efficiency: ((totalPoints / (totalGames * 3)) * 100).toFixed(2),
    } as TeamStats;
  }

  public static async getHomeLeaderboard(): Promise<ServiceResponse<number, TeamStats[] | object>> {
    try {
      const teams = await TeamsModel.findAll();
      const matches = await MatchesModel.findAll({ where: { inProgress: false } });

      const leaderboard: TeamStats[] = teams
        .map((team) => this.calculateTeamStats(matches, team.id, team.teamName))
        .sort(this.compareTeams);
      return { status: HTTP_STATUS.OK, data: leaderboard };
    } catch (error) {
      return { status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        data: { message: MSG.INTERNAL_SERVER_ERROR } };
    }
  }

  private static compareTeams(a: TeamStats, b: TeamStats): number {
    if (a.totalPoints !== b.totalPoints) {
      return b.totalPoints - a.totalPoints;
    }
    if (a.totalVictories !== b.totalVictories) {
      return b.totalVictories - a.totalVictories;
    }
    if (a.goalsBalance !== b.goalsBalance) {
      return b.goalsBalance - a.goalsBalance;
    }
    return b.goalsFavor - a.goalsFavor;
  }
}
