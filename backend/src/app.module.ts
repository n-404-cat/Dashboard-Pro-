import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';
import { LogsModule } from './logs/logs.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { TemplatesModule } from './templates/templates.module';
import { DatasourcesModule } from './datasources/datasources.module';
import { ApisModule } from './apis/apis.module';
import { SshKeysModule } from './ssh-keys/ssh-keys.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SeedService } from './seed.service';
import { User, Role, Permission, Template } from './database/entities';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    LogsModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    TemplatesModule,
    DatasourcesModule,
    ApisModule,
    SshKeysModule,
    TypeOrmModule.forFeature([User, Role, Permission, Template]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'docs', 'prototypes', 'admin'),
      serveRoot: '/admin',
      exclude: ['/api*'],
    }, {
      rootPath: join(__dirname, '..', '..', 'docs', 'prototypes', 'screen'),
      serveRoot: '/screen',
      exclude: ['/api*'],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    SeedService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule { }
