import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { EmailService } from 'src/email/email.service';

@Module({
    imports: [],
    controllers: [ContactController],
    providers: [ContactService, EmailService],
})
export class ContactModule {}
