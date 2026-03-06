import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';

@Controller('system/users')
@UseGuards(PermissionsGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @Permissions('users:list')
    async findAll(@Query() query: any) {
        return this.usersService.findAll(query);
    }

    @Post()
    @Permissions('users:create')
    async create(@Body() body: any) {
        return this.usersService.create(body);
    }

    @Put(':id')
    @Permissions('users:update')
    async update(@Param('id') id: string, @Body() body: any) {
        return this.usersService.update(+id, body);
    }

    @Put(':id/password')
    @Permissions('users:update')
    async changePassword(@Param('id') id: string, @Body() body: any) {
        return this.usersService.changePassword(+id, body);
    }

    @Delete(':id')
    @Permissions('users:delete')
    async remove(@Param('id') id: string) {
        return this.usersService.remove(+id);
    }
}
