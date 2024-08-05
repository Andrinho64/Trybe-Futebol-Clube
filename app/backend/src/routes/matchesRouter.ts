import { Router } from 'express';
import MatchesController from '../controllers/MatchesController';
import tokenHandler from '../middlewares/tokenMiddleware';

const matchesRouter = Router();

matchesRouter.get('/', MatchesController.getMatches);
matchesRouter.patch('/:id/finish', tokenHandler, MatchesController.finishMatch);
matchesRouter.patch('/:id', tokenHandler, MatchesController.updateMatch);

export default matchesRouter;
