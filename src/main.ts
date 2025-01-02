import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';
import { ConfigService } from '@nestjs/config';
import { PrismaExceptionFilter } from './exception-filters/prisma.exception';
import { ResponseFormatInterceptor } from './interceptors/response-format.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({});
    app.use(morgan('dev'));
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    app.setGlobalPrefix('api');

    app.useGlobalFilters(new PrismaExceptionFilter());
    app.useGlobalInterceptors(new ResponseFormatInterceptor());

    const configService = new ConfigService();

    const port = configService.get('PORT') || 3000;

    const config = new DocumentBuilder()
        .addBearerAuth(undefined, 'default')
        .setTitle('Riskrice')
        .setDescription('The Riskrice API description')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
        swaggerOptions: {
            authAction: {
                default: {
                    name: 'default',
                    schema: {
                        description: 'Default',
                        type: 'http',
                        in: 'header',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                    },
                    value: configService.get('TOKEN'),
                },
            },
        },
    });

    await app.listen(port);
}
bootstrap();
