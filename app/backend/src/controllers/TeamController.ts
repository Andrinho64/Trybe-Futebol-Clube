import { Request, Response } from 'express';
import TeamService from '../services/TeamService';

export default class TeamController {
  static async getAllTeams(_req: Request, res: Response): Promise<void> {
    const result = await TeamService.getAllTeams();
    res.status(result.status).json(result.data);
  }

  static async getTeamById(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id, 10);
    const result = await TeamService.getTeamById(id);
    res.status(result.status).json(result.data);
  }
}
