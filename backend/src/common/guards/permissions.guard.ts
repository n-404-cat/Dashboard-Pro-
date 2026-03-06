import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredPermissions) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        // For now, since we don't have a real JWT state in the request, we assume user is attached by an AuthGuard
        // In this prototype, we'll bypass if user is missing or allow if super admin
        if (!user) {
            return true; // Bypassing for prototype until session/JWT is solid
        }

        if (user.isSuperAdmin || user.permissions?.includes('*:*:*')) {
            return true;
        }

        const hasPermission = requiredPermissions.every((permission) =>
            user.permissions?.includes(permission),
        );

        if (!hasPermission) {
            throw new ForbiddenException('Insufficient permissions');
        }

        return hasPermission;
    }
}
