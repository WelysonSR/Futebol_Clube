import * as express from 'express';
import ControllerTeam from '../controllers/Team';

const router = express.Router();

const controlesTeam: ControllerTeam = new ControllerTeam();

router.get('/', controlesTeam.findAll);
router.get('/:id', controlesTeam.findOne);

export default router;
