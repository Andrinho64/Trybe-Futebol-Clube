import { Request, Response } from 'express';
import MatchesService from '../services/MatchesService';

export default class MatchesController {
  static async getMatches(req: Request, res: Response): Promise<void> {
    const { inProgress } = req.query;
    const result = await MatchesService.getMatches(inProgress as string | undefined);
    res.status(result.status).json(result.data);
  }

  static async finishMatch(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await MatchesService.finishMatch(Number(id));
    res.status(result.status).json(result.data);
  }
}
