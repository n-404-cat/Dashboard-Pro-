import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { DatasourcesService } from './datasources.service';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('system/data-sources')
@UseGuards(PermissionsGuard)
export class DatasourcesController {
    constructor(private readonly datasourcesService: DatasourcesService) { }

    @Get()
    @Permissions('datasources:view')
    async findAll(
        @Query('page') page: string = '1',
        @Query('pageSize') pageSize: string = '20',
        @Query('status') status?: string,
        @Query('sourceType') sourceType?: string
    ) {
        return await this.datasourcesService.findAll(+page, +pageSize, status ? +status : undefined, sourceType);
    }

    @Get(':id')
    @Permissions('datasources:view')
    async findOne(@Param('id') id: string) {
        return await this.datasourcesService.findOne(+id);
    }

    @Post()
    @Permissions('datasources:create')
    async create(@Body() createData: any, @CurrentUser() user: any) {
        return await this.datasourcesService.create({
            ...createData,
            createUserId: user?.id || 1
        });
    }

    @Put(':id')
    @Permissions('datasources:update')
    async update(@Param('id') id: string, @Body() updateData: any) {
        return await this.datasourcesService.update(+id, updateData);
    }

    @Delete(':id')
    @Permissions('datasources:delete')
    async remove(@Param('id') id: string) {
        return await this.datasourcesService.remove(+id);
    }

    @Post(':id/test')
    @Permissions('datasources:test')
    async testConnection(@Param('id') id: string) {
        return await this.datasourcesService.testConnection(+id);
    }
}
