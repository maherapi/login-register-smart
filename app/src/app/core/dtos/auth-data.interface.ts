import { IUser } from '../models/user.model';

export interface IAuthData {
  token: string;
  user: IUser;
}
