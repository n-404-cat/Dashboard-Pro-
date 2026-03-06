import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperationLog } from '../database/entities/operation-log.entity';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';

@Module({
    imports: [TypeOrmModule.forFeature([OperationLog])],
    controllers: [LogsController],
    providers: [LogsService],
    exports: [LogsService],
})
export class LogsModule { }
