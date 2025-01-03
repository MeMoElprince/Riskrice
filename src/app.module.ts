import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ContactModule } from './contact/contact.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmailModule } from './email/email.module';
import { GoogleModule } from './google/google.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ContactModule,
        PrismaModule,
        EmailModule,
        GoogleModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
