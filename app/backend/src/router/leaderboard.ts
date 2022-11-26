import * as express from 'express';
import LeaderController from '../controllers/LeaderBoard';

const router = express.Router();

const controlesLeader: LeaderController = new LeaderController();

router.get('/home', controlesLeader.getAllHome);
router.get('/away', controlesLeader.getAllAway);

export default router;
