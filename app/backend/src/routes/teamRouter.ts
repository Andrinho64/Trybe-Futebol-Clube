// src/routes/teamRouter.ts

import { Router } from 'express';
import TeamController from '../controllers/teamController';

const teamRouter = Router();

teamRouter.get('/teams', TeamController.getAllTeams);
teamRouter.get('/teams/:id', TeamController.getTeamById);

export default teamRouter;
