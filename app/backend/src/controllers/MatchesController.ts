import { Request, Response } from 'express';
import MatchesService from '../services/MatchesService';

export default class MatchesController {
  static async getAllMatches(_req: Request, res: Response): Promise<void> {
    const result = await MatchesService.getAllMatches();
    res.status(result.status).json(result.data);
  }
}
