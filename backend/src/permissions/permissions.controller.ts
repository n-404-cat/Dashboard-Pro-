import { Controller, Get, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';

@Controller('system/permissions')
@UseGuards(PermissionsGuard)
export class PermissionsController {
    constructor(private readonly permissionsService: PermissionsService) { }

    @Get()
    @Permissions('roles:list') // Reusing roles:list as it's the closest permission for now
    findAll() {
        return this.permissionsService.findAll();
    }

    @Get('tree')
    getTree() {
        return this.permissionsService.getTree();
    }
}
