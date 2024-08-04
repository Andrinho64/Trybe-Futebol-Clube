import { Request, Response } from 'express';
import MatchesService from '../services/MatchesService';

export default class MatchesController {
  static async getMatches(req: Request, res: Response): Promise<void> {
    const { inProgress } = req.query;
    const result = await MatchesService.getMatches(inProgress as string | undefined);
    res.status(result.status).json(result.data);
  }
}
