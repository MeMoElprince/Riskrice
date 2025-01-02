import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
    catch(
        exception: Prisma.PrismaClientKnownRequestError,
        host: ArgumentsHost,
    ) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        console.error(exception.message);
        switch (exception.code) {
            case 'P2025': {
                response.status(404).json({
                    statusCode: 404,
                    message: exception.message,
                });
                break;
            }

            case 'P2002': {
                response.status(400).json({
                    statusCode: 400,
                    message:
                        'Credentials already taken on ' + exception.meta.target,
                });
                break;
            }

            case 'P2003': {
                response.status(400).json({
                    statusCode: 400,
                    message: 'Foreign key constraint failed',
                });
                break;
            }

            default: {
                console.log(exception.code);
                console.log(
                    '--------------- PrismaExceptionFilter -----------------',
                );
                console.log({ meta: exception.meta });
                response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Internal server error',
                    devMessage: exception.message,
                });
                break;
            }
        }
    }
}
