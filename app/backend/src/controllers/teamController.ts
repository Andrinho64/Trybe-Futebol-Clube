import { Request, Response } from 'express';
import Teams from '../database/models/teamModel';

export default class TeamController {
  static async getAllTeams(_req: Request, res: Response): Promise<void> {
    try {
      const teams = await Teams.findAll();
      res.status(200).json(teams);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching teams' });
    }
  }

  static async getTeamById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const team = await Teams.findByPk(id);
      if (team) {
        res.status(200).json(team);
      } else {
        res.status(404).json({ message: 'Team not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching team' });
    }
  }
}
