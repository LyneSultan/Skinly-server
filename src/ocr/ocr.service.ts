import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as FormData from 'form-data';
import { Model } from 'mongoose';
import { OpenAI } from 'openai';
import { AiLogs } from 'schema/aiLogs.schema';

@Injectable()
export class OcrService {
  private openai: OpenAI;

  constructor( private readonly httpService: HttpService,
    @InjectModel(AiLogs.name) private readonly aiLogsModel: Model<AiLogs>) {
    this.openai = new OpenAI({
      apiKey: process.env.OPEN_AI_KEY,
    });
  }

  async performOcr(userId: string, file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    const url = `${process.env.DJANGO_API}/api/easyOcr`;
    const formData = new FormData();
    formData.append('image', file.buffer, file.originalname);

    try {
      const response = await this.httpService
        .post(url, formData, {
          headers: formData.getHeaders(),
        })
        .toPromise();

      if (response.data.ingredients) {
        const analysis = await this.analyzeIngredients(response.data.ingredients);

        await this.saveLog(
          userId,
          response.data.ingredients,
          analysis.analysis
        );
        return { response: response.data, analysis };
        // return { res:userId, resq:response.data.ingredients,res1: analysis.analysis }
      }

      await this.saveLog(userId, response.data, 'No analysis performed');
      return { response: response.data, id: userId };
    } catch (error) {
      throw new HttpException('Error' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async analyzeIngredients(ingredients: string[]) {
    try {
      const prompt = `Please analyze the overall ingredients tell me what skin type in 2 sentences they are best suited for: ${ingredients.join(', ')}`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: prompt,
          },
        ],
        max_tokens: 200,
      });

      const responseContent = completion.choices[0].message.content.trim();

      return { analysis: responseContent };
    } catch (error) {
      throw new HttpException('Error analyzing ingredients: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR );
    }
  }

  async saveLog(userId: string, ocrData: string, analysis: string) {
    try {
      const log = new this.aiLogsModel({
        chats: {
          request: {
            userInput: ocrData,
            userSkinType: 'Unknown',
            user: userId,
          },
          response: analysis,
        },
      });

      await log.save();
    } catch (error) {
      throw new HttpException('Error saving log', HttpStatus.INTERNAL_SERVER_ERROR );
    }
  }
}
