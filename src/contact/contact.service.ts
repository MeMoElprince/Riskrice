import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from 'src/global/dto/pagination.dto';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class ContactService {
    constructor(
        private prismaService: PrismaService,
        private emailService: EmailService,
    ) {}

    async create(createContactDto: CreateContactDto) {
        const contact = this.prismaService.contact.create({
            data: createContactDto,
        });
        await this.emailService.sendContact(
            createContactDto,
        );
        return contact;
    }

    async findAll(pagination: PaginationDto) {
        const page = pagination.page || 1;
        const limit = Math.min(pagination.limit || 25, 50);
        const skip = (page - 1) * limit;
        const contacts = await this.prismaService.contact.findMany({
            take: limit,
            skip,
        });
        return contacts;
    }

    async findOne(id: number) {
        const contact = await this.prismaService.contact.findUnique({
            where: {
                id,
            },
        });
        if (!contact) {
            throw new NotFoundException('Contact not found');
        }
        return contact;
    }
}
