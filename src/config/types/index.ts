import { AppConfigType } from './app-config.type';
import { DatabaseConfigType } from './database-config.type';

export { AppConfigType, DatabaseConfigType };
export type ConfigType = {
  app: AppConfigType;
  database: DatabaseConfigType;
};
