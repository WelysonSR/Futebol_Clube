import * as express from 'express';
import validationLogin from '../middlewares/validationLogin';
import ControllerLogin from '../controllers/Login';
import { tokenValidation } from '../middlewares/jwt';

const router = express.Router();

const controlesLogin: ControllerLogin = new ControllerLogin();

router.post('/', validationLogin, controlesLogin.login);
router.get('/validate', tokenValidation, controlesLogin.validateToken);

export default router;
