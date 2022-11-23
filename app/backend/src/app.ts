import * as express from 'express';
import middlewareError from './middlewares/Error';
import validationLogin from './middlewares/validationLogin';
import ControllerLogin from './controllers/Login';

class App {
  public app: express.Express;

  constructor(
    private controlesLogin: ControllerLogin = new ControllerLogin(),
  ) {
    this.app = express();

    this.config();

    // Não remover essa rota
    this.app.get('/', (_req, res) => res.json({ ok: true }));

    // Rota Login
    this.app.post('/login', validationLogin, controlesLogin.login);

    // Middleware of Error
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
