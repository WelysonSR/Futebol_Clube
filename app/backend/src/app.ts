import * as express from 'express';
import middlewareError from './middlewares/Error';
import user from './router/login';
import teams from './router/teams';
import matches from './router/matches';
import leaderboard from './router/leaderboard';

class App {
  public app: express.Express;

  constructor() {
    this.app = express();

    this.config();

    // Não remover essa rota
    this.app.get('/', (_req, res) => res.json({ ok: true }));

    this.app.use('/login', user);

    this.app.use('/teams', teams);

    this.app.use('/matches', matches);

    this.app.use('/leaderboard', leaderboard);

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
