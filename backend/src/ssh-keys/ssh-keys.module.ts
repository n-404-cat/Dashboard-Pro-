import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SshKeysController } from './ssh-keys.controller';
import { SshKeysService } from './ssh-keys.service';
import { SshKey } from '../database/entities/ssh-key.entity';

@Module({
    imports: [TypeOrmModule.forFeature([SshKey])],
    controllers: [SshKeysController],
    providers: [SshKeysService],
    exports: [SshKeysService]
})
export class SshKeysModule {}