import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();  // Enable CORS for cross-origin requests
  const configService = app.get(ConfigService);
  const port = configService.get<number>("BACKEND_PORT");
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  const server = app.getHttpServer();
  const router = server._events.request._router;
  console.log(router.stack);
}
bootstrap();
