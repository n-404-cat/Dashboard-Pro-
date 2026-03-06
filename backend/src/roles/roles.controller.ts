import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';

@Controller('system/roles')
@UseGuards(PermissionsGuard)
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @Get()
    @Permissions('roles:list')
    findAll() {
        return this.rolesService.findAll();
    }

    @Get(':id')
    @Permissions('roles:list')
    findOne(@Param('id') id: string) {
        return this.rolesService.findOne(+id);
    }

    @Post()
    @Permissions('roles:create')
    create(@Body() data: any) {
        return this.rolesService.create(data);
    }

    @Put(':id')
    @Permissions('roles:update')
    update(@Param('id') id: string, @Body() data: any) {
        return this.rolesService.update(+id, data);
    }

    @Delete(':id')
    @Permissions('roles:delete')
    remove(@Param('id') id: string) {
        return this.rolesService.remove(+id);
    }

    @Put(':id/permissions')
    @Permissions('roles:update')
    assignPermissions(@Param('id') id: string, @Body('permissionIds') permissionIds: number[]) {
        return this.rolesService.assignPermissions(+id, permissionIds);
    }
}
