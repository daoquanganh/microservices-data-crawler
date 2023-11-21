import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MySQLConfigService } from './config/mysql.config';
import { Article } from './entities/article.entity';
import { IsUniqueConstraint } from './validation/unique.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    TypeOrmModule.forRootAsync({
      useClass: MySQLConfigService,
      inject: [MySQLConfigService]
    }),
    TypeOrmModule.forFeature([Article])
  ],
  controllers: [AppController],
  providers: [AppService,IsUniqueConstraint],
})
export class AppModule {}
