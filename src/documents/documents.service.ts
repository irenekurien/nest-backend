import { Injectable } from '@nestjs/common';
import { PDFDocument } from 'pdf-lib'
import { RecipentsDto } from './dtos/recipients.dto';
const fs = require('fs/promises');


@Injectable()
export class DocumentsService {
    async addRecipients(recipients: RecipentsDto) {
        const pdfBytes = await fs.readFile('/Users/irene/Documents/Code/nest/backend/t.pdf');
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const form = pdfDoc.getForm()

        const user1name = form.getTextField('user1name');
        const user2name = form.getTextField('user2name');
        const user1email = form.getTextField('user1email');
        const user2email = form.getTextField('user2email');

        user1name.setText(recipients.user1.name);
        user2name.setText(recipients.user2.name);
        user1email.setText(recipients.user1.email);
        user2email.setText(recipients.user2.email);

        const modifiedPdfBytes = await pdfDoc.save();

        await fs.writeFile('/Users/irene/Documents/Code/nest/backend/test.pdf', modifiedPdfBytes);   
    }
}

