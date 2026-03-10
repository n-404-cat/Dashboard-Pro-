import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Datasource } from '../database/entities/datasource.entity';
import { DatasourcesController } from './datasources.controller';
import { DatasourcesService } from './datasources.service';

@Module({
    imports: [TypeOrmModule.forFeature([Datasource])],
    controllers: [DatasourcesController],
    providers: [DatasourcesService],
    exports: [DatasourcesService]
})
export class DatasourcesModule { }
