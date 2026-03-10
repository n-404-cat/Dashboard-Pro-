import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { SshKeysService } from './ssh-keys.service';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('system/ssh-keys')
@UseGuards(PermissionsGuard)
export class SshKeysController {
    constructor(private readonly sshKeysService: SshKeysService) { }

    @Get()
    @Permissions('ssh-keys:view')
    async findAll(
        @Query('page') page: string = '1',
        @Query('pageSize') pageSize: string = '20',
        @Query('status') status?: string
    ) {
        try {
            console.log('SSH Keys API called with:', { page, pageSize, status });
            return await this.sshKeysService.findAll(+page, +pageSize, status ? +status : undefined);
        } catch (error) {
            console.error('SSH Keys API error:', error);
            throw error;
        }
    }

    @Get(':id')
    @Permissions('ssh-keys:view')
    async findOne(@Param('id') id: string) {
        return await this.sshKeysService.findOne(+id);
    }

    @Post()
    @Permissions('ssh-keys:create')
    async create(@Body() createData: any, @CurrentUser() user: any) {
        return await this.sshKeysService.create(createData, user?.id || 1);
    }

    @Put(':id')
    @Permissions('ssh-keys:update')
    async update(@Param('id') id: string, @Body() updateData: any) {
        return await this.sshKeysService.update(+id, updateData);
    }

    @Delete(':id')
    @Permissions('ssh-keys:delete')
    async remove(@Param('id') id: string) {
        return await this.sshKeysService.remove(+id);
    }
}