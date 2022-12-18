import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { successInterceptor } from './common/success.interceptor';
import { TimeoutInterceptor } from './common/timeout.interceptor';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new successInterceptor());
  app.useGlobalInterceptors(new TimeoutInterceptor());
  app.enableCors();
  const port = 8080;
  console.log(`listen on port ${port}`);
  await app.listen(port);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
