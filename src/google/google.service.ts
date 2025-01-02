import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { ROOT_PATH } from 'src/utils/constant';
import { auth, OAuth2Client } from 'google-auth-library';
import { authenticate } from '@google-cloud/local-auth';
import { SpacesServiceClient } from '@google-apps/meet';
import { readFileSync, writeFileSync } from 'fs';
import { JSONClient } from 'google-auth-library/build/src/auth/googleauth';

@Injectable()
export class GoogleService {
    constructor() {}

    private TOKEN_PATH = join(ROOT_PATH, 'token.json');
    private CREDENTIALS_PATH = join(ROOT_PATH, 'credentials.json');
    private SCOPES = ['https://www.googleapis.com/auth/meetings.space.created'];
    async loadSavedCredentialsIfExist(): Promise<JSONClient> {
        try {
            const content = readFileSync(this.TOKEN_PATH);
            const credentials = JSON.parse(content.toString());
            return auth.fromJSON(credentials);
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    async saveCredentials(client: OAuth2Client): Promise<void> {
        const content = readFileSync(this.CREDENTIALS_PATH);
        const keys = JSON.parse(content.toString());
        const key = keys.installed || keys.web;
        const payload = JSON.stringify({
            type: 'authorized_user',
            client_id: key.client_id,
            client_secret: key.client_secret,
            refresh_token: client.credentials.refresh_token,
        });
        writeFileSync(this.TOKEN_PATH, payload);
    }

    async authorize(): Promise<JSONClient> {
        let client: any = await this.loadSavedCredentialsIfExist();
        if (client) {
            return client;
        }
        client = await authenticate({
            scopes: this.SCOPES,
            keyfilePath: this.CREDENTIALS_PATH,
        });
        if (client.credentials) {
            await this.saveCredentials(client);
        }
        return client;
    }

    async createSpace(authClient: JSONClient): Promise<string> {
        const meetClient = new SpacesServiceClient({
            authClient: authClient,
        });
        // Construct request
        const request = {};
        // Run request
        const response = await meetClient.createSpace(request);
        return response[0].meetingUri;
    }

    async createSpaceWithAuth(): Promise<string> {
        const authClient = await this.authorize();
        return await this.createSpace(authClient);
    }
}
