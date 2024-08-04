import { Router } from 'express';
import TeamController from '../controllers/TeamController';

const teamRouter = Router();

teamRouter.get('/', TeamController.getAllTeams);
teamRouter.get('/:id', TeamController.getTeamById);

export default teamRouter;
