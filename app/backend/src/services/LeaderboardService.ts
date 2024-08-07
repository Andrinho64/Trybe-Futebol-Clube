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
    const pointAndResult: Pick<TeamStats, 'totalPoints' | 'totalVictories' | 'totalDraws'
    | 'totalLosses'> = { totalPoints: 0, totalVictories: 0, totalDraws: 0, totalLosses: 0 };

    matches.forEach((match) => {
      if (match.homeTeamId === teamId) {
        if (match.homeTeamGoals > match.awayTeamGoals) {
          pointAndResult.totalVictories += 1;
          pointAndResult.totalPoints += 3;
        } else if (match.homeTeamGoals === match.awayTeamGoals) {
          pointAndResult.totalDraws += 1;
          pointAndResult.totalPoints += 1;
        } else {
          pointAndResult.totalLosses += 1;
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
    return {
      name,
      totalPoints,
      totalVictories,
      totalDraws,
      totalLosses,
      goalsBalance: this.calculateGoalsBalance({ goalsFavor, goalsOwn }),
      efficiency: this.calculateEfficiency({ totalPoints,
        totalGames: totalVictories + totalDraws + totalLosses }),
      totalGames: totalVictories + totalDraws + totalLosses,
      goalsFavor,
      goalsOwn,
    } as TeamStats;
  }

  private static calculateGoalsBalance(stats: Pick<TeamStats, 'goalsFavor' | 'goalsOwn' >): number {
    return stats.goalsFavor - stats.goalsOwn;
  }

  private static calculateEfficiency(stats: Pick<TeamStats, 'totalPoints' | 'totalGames' >)
    : string {
    const efficiency = (stats.totalPoints / (stats.totalGames * 3)) * 100;
    return efficiency.toFixed(2);
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
      leaderboard.sort(this.compareTeams);

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
