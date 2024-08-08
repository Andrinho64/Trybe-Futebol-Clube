import { Request, Response } from 'express';
import MatchesService from '../services/MatchesService';

export default class MatchesController {
  static async getMatches(req: Request, res: Response): Promise<void> {
    const inProgress = req.query.inProgress as string | undefined;
    console.log(inProgress, typeof inProgress);
    const result = await MatchesService.getMatches(inProgress);
    res.status(result.status).json(result.data);
  }

  static async finishMatch(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await MatchesService.finishMatch(Number(id));
    res.status(result.status).json(result.data);
  }

  static async updateMatch(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { homeTeamGoals, awayTeamGoals } = req.body;
    const result = await MatchesService.updateMatch(Number(id), homeTeamGoals, awayTeamGoals);
    res.status(result.status).json(result.data);
  }

  static async newMatch(req: Request, res: Response): Promise<void> {
    const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = req.body;
    const result = await MatchesService.newMatch(
      { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals },
    );
    res.status(result.status).json(result.data);
  }
}
