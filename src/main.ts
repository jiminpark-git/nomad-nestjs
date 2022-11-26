import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 아무 데코레이터도 없는 프로퍼티를 허용하지 않음
      forbidNonWhitelisted: true, // 허용하지 않은 프로퍼티를 사용한 리퀘스트를 차단
      transform: true, // 유저가 보낸 값의 타입을 자동 변환
    }),
  );
  await app.listen(3000);
}
bootstrap();
