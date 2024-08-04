import { Router } from 'express';
import LoginController from '../controllers/LoginController';
import tokenHandler from '../middlewares/tokenMiddleware';

const loginRouter = Router();

loginRouter.post('/', LoginController.validate, LoginController.login);
loginRouter.get('/role', tokenHandler, LoginController.getRole);

export default loginRouter;
