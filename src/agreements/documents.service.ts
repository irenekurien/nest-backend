import { Injectable } from '@nestjs/common';
import { PDFDocument } from 'pdf-lib';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../config/serviceAccountKey.json';
const fs = require('fs/promises');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: 'pdf-storage-406005.appspot.com',
});
const bucket = admin.storage().bucket();

@Injectable()
export class DocumentsService {
  async addRecipients(recipients) {
    const pdfBytes = await fs.readFile('src/pdfs/t.pdf');
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();

    const user1name = form.getTextField('user1name');
    const user2name = form.getTextField('user2name');
    const user1email = form.getTextField('user1email');
    const user2email = form.getTextField('user2email');

    user1name.setText(recipients.user1.name);
    user2name.setText(recipients.user2.name);
    user1email.setText(recipients.user1.email);
    user2email.setText(recipients.user2.email);

    const modifiedPdfBytes = await pdfDoc.save();

    await fs.writeFile('src/pdfs/new.pdf', modifiedPdfBytes);
  }

  async uploadToFirebaseStorage(
    filePath: string,
    fileName: string,
  ): Promise<void> {
    try {
      await bucket.upload(filePath, {
        destination: fileName,
      });

      console.log(`File uploaded to gs://${bucket.name}/${fileName}`);
    } catch (error) {
      console.error('Error uploading file to Firebase Storage:', error);
    }
  }

  async generateDownloadUrl(fileName: string) {
    try {
      const [url] = await bucket.file(fileName).getSignedUrl({
        action: 'read',
        expires: Date.now() + 24 * 60 * 60 * 1000 * 30,
      });

      return url;
    } catch (error) {
      console.error('Error generating download URL:', error);
      return null;
    }
  }
}
