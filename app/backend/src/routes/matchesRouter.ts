import { Router } from 'express';
import MatchesController from '../controllers/MatchesController';
// import tokenHandler from '../middlewares/tokenMiddleware';

const matchesRouter = Router();

matchesRouter.get('/', MatchesController.getAllMatches);

export default matchesRouter;
