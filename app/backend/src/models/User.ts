import { IUser } from '../interfaces/IUser';
import User from '../database/models/User';

export default class UserModel {
  protected _model = User;

  async findOne(email: string): Promise<IUser | null> {
    const result = await this._model.findOne({ where: { email } });
    return result;
  }
}
