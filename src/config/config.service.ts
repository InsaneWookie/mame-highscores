import * as dotenv from 'dotenv';
import * as fs from 'fs';

export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor(filePath: string) {
   dotenv.config({ path: filePath });
   // console.log(process.env);
  }

  get(key: string): string {
    return process.env[key];
  }
}