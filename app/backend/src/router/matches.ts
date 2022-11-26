import * as express from 'express';
import ControllerMatches from '../controllers/Matches';
import { tokenValidation } from '../middlewares/jwt';

const router = express.Router();

const controlesMatches: ControllerMatches = new ControllerMatches();

router.get('/', controlesMatches.findAll);
router.post('/', tokenValidation, controlesMatches.create);
router.patch('/:id/finish', controlesMatches.update);
router.patch('/:id', controlesMatches.updateResult);

export default router;
