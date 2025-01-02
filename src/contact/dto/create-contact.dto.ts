import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsPhoneNumber,
    IsString,
} from 'class-validator';

export class CreateContactDto {
    @ApiProperty({
        description: 'The name of the user',
        type: String,
        required: true,
        example: 'ahmed',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'The email of the user',
        type: String,
        required: true,
        example: 'example@gmail.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'The phone number of the user',
        type: String,
        required: true,
        example: '+201234567890',
    })
    @IsPhoneNumber()
    @IsNotEmpty()
    phoneNumber: string;

    @ApiProperty({
        description: 'The message of the user',
        type: String,
        required: false,
        example: 'Hello',
    })
    @IsString()
    @IsOptional()
    message: string;

    @ApiProperty({
        description: 'The type of the consultation',
        type: String,
        required: false,
        example: 'legal',
    })
    @IsString()
    @IsOptional()
    consultType: string;
}
