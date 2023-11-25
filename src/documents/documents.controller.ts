import {
  Controller,
  Get,
  Post,
  Param,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as stream from 'stream';

@Controller('documents')
export class DocumentsController {
  private bucketName = 'your-bucket-name';
  private readonly storage: Storage;

  constructor(private readonly configService: ConfigService) {
    this.storage = new Storage({
      projectId: this.configService.get('GOOGLE_CLOUD_STORAGE_PROJECT_ID'),

      credentials: {
        type: this.configService.get('GOOGLE_CLOUD_STORAGE_TYPE'),
        project_id: this.configService.get('GOOGLE_CLOUD_STORAGE_PROJECT_ID'),
        // private_key_id: this.configService.get(
        //   'GOOGLE_CLOUD_STORAGE_PRIVATE_KEY_ID',
        // ),
        private_key: this.configService
          .get('GOOGLE_CLOUD_STORAGE_PRIVATE_KEY')
          .replace(/\\n/g, '\n'),
        client_email: this.configService.get(
          'GOOGLE_CLOUD_STORAGE_CLIENT_EMAIL',
        ),
        client_id: this.configService.get('GOOGLE_CLOUD_STORAGE_CLIENT_ID'),
        // auth_uri: this.configService.get('GOOGLE_CLOUD_STORAGE_AUTH_URI'),
        // auth_provider_x509_cert_url: this.configService.get(
        //   'GOOGLE_CLOUD_STORAGE_AUTH_PROVIDER_X509_CERT_URL',
        // ),
        // client_x509_cert_url: this.configService.get(
        //   'GOOGLE_CLOUD_STORAGE_CLIENT_X509_CERT_URL',
        // ),
        universe_domain: this.configService.get(
          'GOOGLE_CLOUD_STORAGE_UNIVERSE_DOMAIN',
        ),
      },
    });
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('pdf'))
  async uploadPdf(@UploadedFile() pdf: Express.Multer.File): Promise<string> {
    const filename = path.basename(
      pdf.originalname,
      path.extname(pdf.originalname),
    );
    const file = this.storage.bucket(this.bucketName).file(`${filename}.pdf`);
    console.log(pdf);

    try {
      const bufferStream = new stream.PassThrough();
      bufferStream.end(pdf.buffer);
      bufferStream.pipe(file.createWriteStream());

      return `File ${filename}.pdf uploaded successfully!`;
    } catch (error) {
      console.error(error);
      throw new Error('Error uploading file');
    }
  }
}
