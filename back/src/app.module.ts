import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { Order } from './entitis/Order';
import { Payment } from './entitis/Payment';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([Order, Payment]),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'mysql',
          host:
            configService.get('TEST') === 'true'
              ? configService.get('TEST_HOST')
              : configService.get('HOST'),
          port:
            configService.get('TEST') === 'true'
              ? configService.get('TEST_DB_PORT')
              : configService.get('DB_PORT'),
          username:
            configService.get('TEST') === 'true'
              ? configService.get('TEST_USER_NAME')
              : configService.get('USER_NAME'),
          password:
            configService.get('TEST') === 'true'
              ? configService.get('TEST_PASSWORD')
              : configService.get('PASSWORD'),
          database:
            configService.get('TEST') === 'true'
              ? configService.get('TEST_DATABASE')
              : configService.get('DATABASE'),
          entities: [Order, Payment],
          charset: 'utf8mb4',
          synchronize: false,
          autoLoadEntities: true,
          logging: true,
        };
      },
    }),
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
