import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/users/dtos/user.dto';
const fs = require('fs');
const FormData = require('form-data');

@Injectable()
export class ZohoSignService {
  private readonly zohoApiUrl = 'https://sign.zoho.in/api/v1/requests';
  private readonly zohoWebhookUrl = 'https://sign.zoho.in/api/v1/accounts/webhooks';
  private readonly oauthToken =
    '1000.3afa1f8f7abb1f3f2b063cbcceced190.2042475720ca99ac169994d8585da437';

  async createZohoSignRequest(
    filePath: string,
    user1: UserDto,
    user2: UserDto,
  ): Promise<any> {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));

    const requestData = {
      requests: {
        request_name: 'Bhumio Agreement',
        actions: this.createActionsArray([user1, user2]),
        expiration_days: 1,
        is_sequential: true,
        email_reminders: true,
        reminder_period: 8,
      },
    };

    formData.append('data', JSON.stringify(requestData));
    const headers = {
      Authorization: `Zoho-oauthtoken ${this.oauthToken}`,
      ...formData.getHeaders(),
    };

    try {
      const response = await axios.post(this.zohoApiUrl, formData, { headers });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async sendZohoSignRequest(requestId: number): Promise<any> {
    const formData = new FormData();

    const requestData = {
      requests: {
        actions: [],
      },
    };

    formData.append('data', JSON.stringify(requestData));
    const headers = {
      Authorization: `Zoho-oauthtoken ${this.oauthToken}`,
      ...formData.getHeaders(),
    };

    try {
      const response = await axios.post(
        `${this.zohoApiUrl}/${requestId}/submit`,
        formData,
        { headers },
      );

      const res1 = await this.getEmbedLink(
        requestId,
        response.data.requests.actions[0].action_id,
      );
      const res2 = await this.getEmbedLink(
        requestId,
        response.data.requests.actions[1].action_id,
      );

      return { link1: res1.sign_url, link2: res2.sign_url };
    } catch (error) {
      console.error(error);
    }
  }

  async getEmbedLink(requestId: number, actionId: string): Promise<any> {
    const url = `${this.zohoApiUrl}/${requestId}/actions/${actionId}/embedtoken?host=https://0fa9-2001-df5-d380-448b-64f2-3587-6bb6-c721.ngrok.io`;

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Zoho-oauthtoken ${this.oauthToken}`,
    };

    try {
      const response = await axios.post(url, {}, { headers });
      console.log('Zoho Sign Embed Link Response:', response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async getCompletionCertificate(requestId: string): Promise<any> {
    const url = `${this.zohoApiUrl}/${requestId}/completioncertificate`;

    const headers = {
      Authorization: `Zoho-oauthtoken ${this.oauthToken}`,
    };

    try {
      const response = await axios.get(url, { headers });
      console.log('Zoho Sign Completion Certificate Response:', response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  private createActionsArray(users: UserDto[]): any[] {
    return users.map((user) => ({
      recipient_name: user.name,
      recipient_email: user.email,
      action_type: 'SIGN',
      private_notes: 'Please get back to us for further queries',
      signing_order: 0,
      is_embedded: true,
    }));
  }
}
