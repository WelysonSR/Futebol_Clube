import * as express from 'express';
import middlewareError from './middlewares/Error';
import validationLogin from './middlewares/validationLogin';
import ControllerLogin from './controllers/Login';
import { tokenValidation } from './middlewares/jwt';
import ControllerTeam from './controllers/Team';
import ControllerMatches from './controllers/Matches';
import LeaderController from './controllers/LeaderBoard';

class App {
  public app: express.Express;

  constructor(
    private controlesLogin: ControllerLogin = new ControllerLogin(),
    private controlesTeam: ControllerTeam = new ControllerTeam(),
    private controlesMatches: ControllerMatches = new ControllerMatches(),
    private controlesLeader: LeaderController = new LeaderController(),
  ) {
    this.app = express();

    this.config();

    // Não remover essa rota
    this.app.get('/', (_req, res) => res.json({ ok: true }));

    this.app.post('/login', validationLogin, controlesLogin.login);
    this.app.get('/login/validate', tokenValidation, controlesLogin.validateToken);

    this.app.get('/teams', controlesTeam.findAll);
    this.app.get('/teams/:id', controlesTeam.findOne);

    this.app.get('/matches', controlesMatches.findAll);
    this.app.post('/matches', tokenValidation, controlesMatches.create);
    this.app.patch('/matches/:id/finish', controlesMatches.update);
    this.app.patch('/matches/:id', controlesMatches.updateResult);

    this.app.get('/leaderboard/home', controlesLeader.getAllHome);

    this.app.use(middlewareError);
  }

  private config():void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(express.json());
    this.app.use(accessControl);
  }

  public start(PORT: string | number):void {
    this.app.listen(PORT, () => console.log(`Running on port ${PORT}`));
  }
}

export default App;
