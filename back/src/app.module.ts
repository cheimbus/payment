import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { Payment } from './entitis/Payment';
import { Membership } from './entitis/Membership';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([Payment, Membership]),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: 'localhost',
          port:
            5433,
          username:
            'postgres',
          password:
            '123123123',
          database:
            'exam',
          entities: [Payment, Membership],
          charset: 'utf8mb4',
          synchronize: false,
          autoLoadEntities: true,
          logging: true,
          keepConnectionAlive: true,
        };
      },
    }),
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
