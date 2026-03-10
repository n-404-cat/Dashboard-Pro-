import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';

@Controller('system/templates')
@UseGuards(PermissionsGuard)
export class TemplatesController {
    constructor(private readonly templatesService: TemplatesService) { }

    @Get()
    @Permissions('templates:view')
    async findAll(
        @Query('page') page: string = '1',
        @Query('pageSize') pageSize: string = '12',
        @Query('industry') industry?: string,
        @Query('status') status?: string
    ) {
        return await this.templatesService.findAll(+page, +pageSize, industry, status);
    }

    @Get(':id')
    @Permissions('templates:view')
    async findOne(@Param('id') id: string) {
        return await this.templatesService.findOne(+id);
    }

    @Post()
    @Permissions('templates:create')
    async create(@Body() createData: any) {
        return await this.templatesService.create(createData);
    }

    @Put(':id')
    @Permissions('templates:update')
    async update(@Param('id') id: string, @Body() updateData: any) {
        return await this.templatesService.update(+id, updateData);
    }

    @Delete(':id')
    @Permissions('templates:delete')
    async remove(@Param('id') id: string) {
        return await this.templatesService.remove(+id);
    }
}
