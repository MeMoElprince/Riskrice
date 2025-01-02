import { BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { join } from 'path';
import { UPLOAD_PATH } from './constant';
import { writeFileSync } from 'fs';

export async function installPicture(
    photoUrl: string,
    path: string,
    filename: string,
) {
    if (!path || !filename || !photoUrl) {
        throw new BadRequestException(
            'photoUrl and Path and filename are required',
        );
    }
    const photoResponse = await axios.get(photoUrl, {
        responseType: 'arraybuffer',
    });
    const photoBuffer = Buffer.from(photoResponse.data, 'binary');
    const photoFilename = `${Date.now()}-${filename}`;
    const photoPath = join(UPLOAD_PATH, path, photoFilename);
    writeFileSync(photoPath, photoBuffer);
    return { path: photoPath, filename: photoFilename };
}
