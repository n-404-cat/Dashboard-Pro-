import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiConfig } from '../database/entities/api-config.entity';
import { ApisController, TemplateApisController } from './apis.controller';
import { ApisService } from './apis.service';
import { DatasourcesModule } from '../datasources/datasources.module';

@Module({
    imports: [TypeOrmModule.forFeature([ApiConfig]), DatasourcesModule],
    controllers: [ApisController, TemplateApisController],
    providers: [ApisService],
    exports: [ApisService]
})
export class ApisModule { }
