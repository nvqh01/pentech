import { readFileSync } from 'fs';
import dotenv from 'dotenv';
import yaml from 'js-yaml';

dotenv.config();

export class Config {
  static YAML_CONFIG_FILE: string = 'config/config.yaml';
  static YAML_CONFIG_FILE_TESTING: string = 'config/testing.config.yaml';
  static YAML_CONFIG_FILE_STAGING: string = 'config/staging.config.yaml';
  static YAML_CONFIG_FILE_PRODUCTION: string = 'config/production.config.yaml';

  static loadYamlFile(path: string): Record<string, any> {
    return yaml.load(readFileSync(path, 'utf8'), {
      json: true,
    });
  }

  static load(): Record<string, any> {
    let config = Config.loadYamlFile(Config.YAML_CONFIG_FILE);

    const env = process.env;

    if (env.NODE_ENV === 'testing') {
      config = {
        ...config,
        ...Config.loadYamlFile(Config.YAML_CONFIG_FILE_TESTING),
      };
    } else if (env.NODE_ENV === 'staging') {
      config = {
        ...config,
        ...Config.loadYamlFile(Config.YAML_CONFIG_FILE_STAGING),
      };
    } else if (env.NODE_ENV === 'production') {
      config = {
        ...config,
        ...Config.loadYamlFile(Config.YAML_CONFIG_FILE_PRODUCTION),
      };
    }

    return {
      ...config,
      ...env,
    };
  }
}
