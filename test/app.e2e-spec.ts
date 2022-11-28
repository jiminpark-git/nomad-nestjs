import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Decorator가 존재하지 않는 프로퍼티를 허용하지 않음
        forbidNonWhitelisted: true, // 허용하지 않은 프로퍼티를 사용한 리퀘스트를 차단
        transform: true, // 유저가 보낸 값의 타입을 자동 변환
      }),
    ); // spec 파일에서도 Validatoin 설정
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello, World!');
  });

  describe('/movie', () => {
    it('GET 200', () => {
      return request(app.getHttpServer()).get('/movie').expect(200).expect([]);
    });
    it('POST 201', () => {
      return request(app.getHttpServer())
        .post('/movie')
        .send({
          title: 'Test',
          year: 2000,
          genres: ['test'],
        })
        .expect(201);
    });
    it('POST 400', () => {
      return request(app.getHttpServer())
        .post('/movie')
        .send({
          title: 'Test',
          year: 2000,
          genres: ['test'],
          something: 'test',
        })
        .expect(400);
    });
  });

  describe('/movie/:id', () => {
    it('GET 200', () => {
      return request(app.getHttpServer()).get('/movie/1').expect(200);
    });
    it('GET 404', () => {
      return request(app.getHttpServer()).get('/movie/999').expect(404);
    });
    it('PATCH 200', () => {
      return request(app.getHttpServer())
        .patch('/movie/1')
        .send({ year: 2022 })
        .expect(200);
    });
    it('PATCH 400', () => {
      return request(app.getHttpServer())
        .patch('/movie/1')
        .send({ year: 2022, something: 'test' })
        .expect(400);
    });
    it('DELETE 200', () => {
      return request(app.getHttpServer()).patch('/movie/1').expect(200);
    });
  });
});
