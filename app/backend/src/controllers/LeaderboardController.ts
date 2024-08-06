import { Request, Response } from 'express';
import LeaderboardService from '../services/LeaderboardService';

export default class LeaderboardController {
  static async getHomeLeaderboard(req: Request, res: Response): Promise<void> {
    const result = await LeaderboardService.getHomeLeaderboard();
    res.status(result.status).json(result.data);
  }
}
