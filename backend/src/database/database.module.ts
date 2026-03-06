import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User, Role, Permission, OperationLog, Template, Datasource, ApiConfig } from './entities';

@Global()
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get<string>('database.host'),
                port: configService.get<number>('database.port'),
                username: configService.get<string>('database.username'),
                password: configService.get<string>('database.password'),
                database: configService.get<string>('database.database'),
                entities: [User, Role, Permission, OperationLog, Template, Datasource, ApiConfig],
                synchronize: true, // Should be false in production
                charset: 'utf8mb4_unicode_ci',
            }),
        }),
        TypeOrmModule.forFeature([User, Role, Permission, OperationLog, Template, Datasource, ApiConfig]),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule { }
