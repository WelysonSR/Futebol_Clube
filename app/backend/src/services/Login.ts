import UserModel from '../models/User';
import { ILogin } from '../interfaces/ILogin';
import { generateTokenJwt } from '../middlewares/jwt';
import Bcrypt from '../assets/Bcrypt';
import { IUser } from '../interfaces/IUser';
import CustonError from '../erros/CustonErros';

export default class ServiceLogin {
  constructor(private model: UserModel = new UserModel()) {}

  async login(user: ILogin) {
    const loginUser = await this.model.findOne(user.email);

    if (!loginUser || loginUser === null) {
      throw new CustonError(401, 'Incorrect email or password');
    }
    if (!Bcrypt.compare(loginUser.password, user.password)) {
      throw new CustonError(401, 'Incorrect email or password');
    }

    const token = generateTokenJwt(user.email);
    return { code: 200, token };
  }

  async validate(email: string) {
    const { role } = await this.model.findOne(email) as IUser;
    return { code: 200, role };
  }
}
