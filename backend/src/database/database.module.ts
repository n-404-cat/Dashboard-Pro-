import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User, Role, Permission, OperationLog, Template, Datasource, ApiConfig, SshKey } from './entities';

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
                entities: [User, Role, Permission, OperationLog, Template, Datasource, ApiConfig, SshKey],
                synchronize: configService.get<string>('NODE_ENV') === 'production' ? false : configService.get<boolean>('database.synchronize'),
                migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
                migrationsTableName: 'typeorm_migrations',
                charset: 'utf8mb4_unicode_ci',
            }),
        }),
        TypeOrmModule.forFeature([User, Role, Permission, OperationLog, Template, Datasource, ApiConfig, SshKey]),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule { }
