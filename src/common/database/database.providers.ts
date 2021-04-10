import { Sequelize } from 'sequelize-typescript';
import { ItemModel } from 'src/modules/item/item.model';
import { configService } from '../config/config.service';
import { SEQUELIZE } from '../constants';


export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      const sequelize = new Sequelize(configService.getDatabaseUrl(), { logging: false, ssl: true });
      sequelize.addModels([ItemModel]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
