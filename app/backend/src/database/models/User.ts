import { Model, INTEGER, STRING } from 'sequelize';
import db from './index';

class Users extends Model {
  id!: number;
  username!: string;
  role!: string;
  email!: string;
  password!: string;
}

Users.init({
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: STRING(50),
    allowNull: false,
  },
  role: {
    type: STRING(50),
    allowNull: false,
  },
  email: {
    type: STRING(50),
    allowNull: false,
  },
  password: {
    type: STRING(100),
    allowNull: false,
  },
}, {
  sequelize: db,
  modelName: 'users',
  timestamps: false,
});

export default Users;
