import { BadRequestException, Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

@Injectable()
export class ScraperService {
  private execPromise = util.promisify(exec);

  async scrape(file: Express.Multer.File) {
    const scriptPath = await this.saveScriptToFile(file);

    try {
      const { stdout, stderr } = await this.execPromise(`node "${scriptPath}"`);

      if (stderr) {
        console.error('Error executing script:', stderr);
        throw new BadRequestException('Error executing scraper script');
      }

      const products = stdout;

      return products;

    } catch (error) {
      throw new BadRequestException('Failed to execute scraper script');
    } finally {
      fs.unlinkSync(scriptPath);
    }
  }

  private async saveScriptToFile(file: Express.Multer.File): Promise<string> {

    const scriptPath = path.join(__dirname, 'temp', file.originalname);

    await fs.promises.mkdir(path.dirname(scriptPath), { recursive: true });

    await fs.promises.writeFile(scriptPath, file.buffer);

    return scriptPath;
  }
}
