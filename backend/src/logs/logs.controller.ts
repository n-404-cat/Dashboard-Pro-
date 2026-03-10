import { Controller, Get, Query, UseGuards, Delete, Param } from '@nestjs/common';
import { LogsService } from './logs.service';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';

@Controller('system/logs')
@UseGuards(PermissionsGuard)
export class LogsController {
    constructor(private readonly logsService: LogsService) { }

    @Get()
    @Permissions('logs:list')
    async findAll(@Query() query: any) {
        return await this.logsService.findAll(query);
    }

    @Get(':id')
    @Permissions('logs:list')
    async findOne(@Param('id') id: string) {
        return await this.logsService.findOne(id);
    }

    @Delete()
    @Permissions('logs:delete')
    async removeAll() {
        return await this.logsService.removeAll();
    }
}
