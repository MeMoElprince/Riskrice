import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/global/dto/pagination.dto';
import { CreateContactDto } from './dto/create-contact.dto';

@ApiTags('Contact')
@Controller('contacts')
export class ContactController {
    constructor(private readonly contactService: ContactService) {}
    @ApiOperation({
        summary: 'User send contact',
        description: 'user send contact',
    })
    @Post()
    async sendContact(@Body() createContactDto: CreateContactDto) {
        return this.contactService.create(createContactDto);
    }

    @ApiOperation({
        summary: 'admin get contacts',
        description: 'admin recieves contacts',
    })
    @Get()
    async getAll(@Query() paginationDto: PaginationDto) {
        return this.contactService.findAll(paginationDto);
    }
}
