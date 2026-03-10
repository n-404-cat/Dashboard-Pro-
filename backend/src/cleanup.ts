import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TemplatesService } from './templates/templates.service';
import { DataSource } from 'typeorm';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const dataSource = app.get(DataSource);

    console.log('Cleaning up duplicate templates...');

    // Get all templates grouped by name
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
        await queryRunner.query(`
          DELETE FROM sys_template
          WHERE id NOT IN (
              SELECT * FROM (
                  SELECT MAX(id) FROM sys_template GROUP BY name
              ) AS t
          );
      `);
        console.log('Successfully removed duplicate templates');
    } catch (err) {
        console.error('Error removing duplicates:', err);
    } finally {
        await queryRunner.release();
    }

    await app.close();
}

bootstrap();
