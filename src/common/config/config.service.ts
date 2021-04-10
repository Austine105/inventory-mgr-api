import { SequelizeModuleOptions } from "@nestjs/sequelize";
import * as dotenv from 'dotenv';

dotenv.config();

class ConfigService {

  constructor(private env: { [k: string]: string | undefined }) { }

  private mode = this.getValue('NODE_ENV', true);
  public isDev: boolean = this.mode === 'development';
  public isProduction: boolean = this.mode === 'production';


  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }
    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach(k => this.getValue(k, true));
    return this;
  }

  public getAppName(): string {
    return this.getValue('APP_NAME', true);
  }

  public getAppVersionNo() : string {
    return this.getValue('VERSION_NO', true);
  }

  public getAppVersionString() : string {
    return this.getValue('VERSION_STRING', true);
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public getApiPrefix() {
    return this.getValue('API_PREFIX', true);
  }

  public getDatabaseUrl() {
    return this.getValue('DATABASE_URL', true);
  }

  public getRedisUrl() {
    return this.getValue('REDIS_URL', true)
  }

  public getSequelizeConfig(): SequelizeModuleOptions {
    return {
      dialect: 'postgres',
      logging: false,
      autoLoadModels: true,
      synchronize: true,
      ssl: true
    };
  }
}

const configService = new ConfigService(process.env)
  .ensureValues([
    'DATABASE_URL',
    'REDIS_URL',
  ]);

export { configService };
