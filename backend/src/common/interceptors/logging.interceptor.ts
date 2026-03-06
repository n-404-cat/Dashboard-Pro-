import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { LogsService } from '../../logs/logs.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);

    constructor(private readonly logsService: LogsService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, path, ip, user } = request;

        // Only record mutations (POST, PUT, DELETE) and avoid potential circular logging
        if (['GET'].includes(method) || path.includes('/system/logs')) {
            return next.handle();
        }

        const startTime = Date.now();

        return next.handle().pipe(
            tap({
                next: (data) => {
                    this.saveLog(request, 200, startTime);
                },
                error: (error) => {
                    this.saveLog(request, error.status || 500, startTime);
                },
            }),
        );
    }

    private async saveLog(request: any, status: number, startTime: number) {
        try {
            const { method, path, ip, user, body, query } = request;
            const duration = Date.now() - startTime;

            // Determine module and operation from path
            const pathParts = path.split('/').filter(p => p && p !== 'v1');
            const module = pathParts[0] || 'system';
            const operation = this.getAction(method, pathParts);

            await this.logsService.create({
                userId: user?.id,
                username: user?.username || 'admin',
                module,
                operation,
                method,
                requestUrl: path,
                requestParams: JSON.stringify({ body, query }),
                ipAddress: ip,
                executeTime: duration,
                statusCode: status,
            });
        } catch (err) {
            this.logger.error('Failed to save operation log', err.stack);
        }
    }

    private getAction(method: string, pathParts: string[]): string {
        if (pathParts.includes('login')) return 'login';
        if (pathParts.includes('logout')) return 'logout';

        switch (method) {
            case 'POST': return 'create';
            case 'PUT':
            case 'PATCH': return 'update';
            case 'DELETE': return 'delete';
            default: return 'operation';
        }
    }
}
