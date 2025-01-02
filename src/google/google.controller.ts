import { Controller, Post } from '@nestjs/common';
import { GoogleService } from './google.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Google')
@Controller('google')
export class GoogleController {
    constructor(private readonly googleService: GoogleService) {}

    @Post('apis/meetings')
    createMeeting() {
        return this.googleService.createSpaceWithAuth();
    }
}
