import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApisService } from './apis.service';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('system/apis')
@UseGuards(PermissionsGuard)
export class ApisController {
    constructor(private readonly apisService: ApisService) { }

    @Get()
    @Permissions('apis:view')
    async findAll(
        @Query('page') page: string = '1',
        @Query('pageSize') pageSize: string = '20',
        @Query('queryType') queryType?: string,
        @Query('keyword') keyword?: string,
        @Query('templateId') templateId?: string
    ) {
        return await this.apisService.findAll(+page, +pageSize, queryType, keyword, templateId ? +templateId : undefined);
    }

    @Get(':id')
    @Permissions('apis:view')
    async findOne(@Param('id') id: string) {
        return await this.apisService.findOne(+id);
    }

    @Post()
    @Permissions('apis:create')
    async create(@Body() createData: any, @CurrentUser() user: any) {
        return await this.apisService.create({
            ...createData,
            createUserId: user?.id || 1
        });
    }

    @Put(':id')
    @Permissions('apis:update')
    async update(@Param('id') id: string, @Body() updateData: any) {
        return await this.apisService.update(+id, updateData);
    }

    @Delete(':id')
    @Permissions('apis:delete')
    async remove(@Param('id') id: string) {
        return await this.apisService.remove(+id);
    }

    @Post(':id/test')
    @Permissions('apis:test')
    async testApi(@Param('id') id: string, @Body() body: { params?: any }) {
        return await this.apisService.testApi(+id, body.params);
    }
}

@Controller('templates/:templateId/apis')
@UseGuards(PermissionsGuard)
export class TemplateApisController {
    constructor(private readonly apisService: ApisService) { }

    @Get()
    @Permissions('apis:view')
    async findByTemplateId(@Param('templateId') templateId: string) {
        return await this.apisService.findByTemplateId(+templateId);
    }

    @Post()
    @Permissions('apis:create')
    async createForTemplate(
        @Param('templateId') templateId: string,
        @Body() createData: any,
        @CurrentUser() user: any
    ) {
        return await this.apisService.createForTemplate(+templateId, {
            ...createData,
            createUserId: user?.id || 1
        });
    }
}
