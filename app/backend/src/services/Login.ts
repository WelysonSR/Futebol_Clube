// import * as bcrypt from 'bcryptjs';
import UserModel from '../models/User';
import { ILogin } from '../interfaces/ILogin';
import { generateTokenJwt } from '../middlewares/jwt';

export default class ServiceLogin {
  constructor(private model: UserModel = new UserModel()) {}

  public async login(user: ILogin) {
    const loginUser = await this.model.findOne(user.email);
    // const sal = bcrypt.genSaltSync(6);
    // const hash = bcrypt.hashSync(user.password, sal);

    if (!loginUser || loginUser === null) {
      return { code: 401, message: 'Incorrect email or password' };
    }

    const token = generateTokenJwt(user.email);
    return { code: 200, token };
  }
}
