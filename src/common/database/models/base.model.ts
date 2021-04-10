import { Model } from 'sequelize-typescript';

export abstract class BaseModel extends Model<BaseModel> {
  id: number
}
