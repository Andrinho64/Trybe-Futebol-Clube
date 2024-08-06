import { Router } from 'express';
import LeaderboardController from '../controllers/LeaderboardController';

// import tokenHandler from '../middlewares/tokenMiddleware';

const leaderboardRouter = Router();

leaderboardRouter.get('/home', LeaderboardController.getHomeLeaderboard);
// leaderboardRouter.get('/away', LeaderboardController.getAwayLeaderboard);
// leaderboardRouter.get('/', LeaderboardController.getAllLeaderboard);

export default leaderboardRouter;
