# NestJS로 API 만들기

![NestJS로 API 만들기](https://nomadcoders.co/_next/image?url=https%3A%2F%2Fd1telmomo28umc.cloudfront.net%2Fmedia%2Fpublic%2Fthumbnails%2Fnest.jpg&w=3840&q=75)

> [NestJS로 API 만들기 by 노마드 코더](https://nomadcoders.co/nestjs-fundamentals)

## NestJS 소개

> NestJS는 Node.js에 기반을 둔 웹 API 프레임워크로써 Express 또는 Fastify 프레임워크를 래핑하여 동작합니다. 기본으로 설치하면 Express를 사용합니다. Node.js는 손쉽게 사용할 수 있고 뛰어난 확장성을 가지고 있지만, 과도한 유연함으로 인해 SW의 품질이 일정하지 않고 알맞은 라이브러리를 찾기 위해 사용자가 많은 시간을 할애해야 합니다. 이에 반해 NestJS는 데이터베이스, ORM, 설정(Configuration), 유효성 검사 등 수많은 기능을 기본 제공하고 있습니다. 그러면서도 필요한 라이브러리를 쉽게 설치하여 기능을 확장할 수 있는 Node.js 장점은 그대로 가지고 있습니다. NestJS는 Angular로부터 영향을 많이 받았습니다. 모듈/컴포넌트 기반으로 프로그램을 작성함으로써 재사용성을 높여줍니다. IoC(Inversion of Control, 제어역전), DI(Dependency Injection, 의존성 주입), AOP(Aspect Oriented Programming, 관점 지향 프로그래밍)와 같은 객체지향 개념을 도입하였습니다. 프로그래밍 언어는 타입스크립트를 기본으로 채택하고 있어 타입스크립트가 가진 타입시스템의 장점을 누릴 수 있습니다.

---

## 목차

1. [ARCHITECTURE OF NESTJS](#1-architecture-of-nestjs)
2. [REST API](#2-rest-api)
3. [UNIT TESTING]
4. [E2E TESTING]

---

## 1. ARCHITECTURE OF NESTJS

### 1.1. main.ts

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
```

> await NestFactory.create(AppModule)을 호출하고 어플리케이션은 3000번의 포트를 리스닝한다.

### 1.2. app.module.ts

```ts
@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

> 앱 모듈은 모든 것의 루트 모듈이다.

AppModule은 컨트롤러로 AppController를 주입 받고 프로바이더로 AppService를 주입받는다.

### 1.3. app.controller.ts

```ts
@Controller()
export class AppController {
  @Get()
  home(): string {
    return this.appService.getHello();
  }
}
```

> 컨트롤러는 express.js의 controller/router 같은 것이다.

### 1.4. app.service.ts

```ts
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
```

> NestJS는 컨트롤러를 비지니스 로직과 구분 짓고 싶어 한다.

---

## 2. REST API

### 2.1. Controller

NestJS의 Controller를 생성하는 nest cli 명령어 (MovieController 생성)

```zsh
nest g co movie
```

**movie.controller.ts**<br />
@Get, @Post Decorator를 통해 작성된 Movie Rest API의 컨트롤러<br />
@Body Decorator를 통해 리퀘스트의 body를 가져옴<br />

```ts
@Controller('movie')
export class MovieController {
  constructor(private readonly movieServicec: MovieService) {}

  @Get()
  getAll(): Movie[] {
    /* service */
  }

  @Get(':id')
  getOne(@Param('id') movieId: string): Movie {
    /* service */
  }

  @Post()
  create(@Body() movieData): boolean {
    /* service */
  }
}
```

### 2.2. Service

**Single-responsibility principle(SRP)**

> 하나의 module, class 혹은 function이 하나의 기능은 꼭 책임져야 한다

NestJS의 Service를 생성하는 nest cli 명령어 (MovieService 생성)

```zsh
nest g s movie
```

**movie.service.ts**

```ts
@Injectable()
export class MovieService {
  private Movie: Movie[] = [];

  getAll(): Movie[] {
    return this.Movie;
  }

  getOne(id: number): Movie {
    const movie = this.Movie.find((movie) => movie.id === id);
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found.`);
    }
    return movie;
  }

  create(movieData: CreateMovieDTO): boolean {
    this.Movie.push({
      id: this.Movie.length + 1,
      ...movieData,
    });
    return true;
  }
}
```

```ts
throw new NotFoundException(`Movie with ID ${id} not found.`);
```

NestJS가 제공하는 예외로 404 에러를 throw 한다.

### 2.3. DTO and Validation

**create-movie.dto.ts**

```ts
export class CreateMovieDTO {
  @IsString()
  readonly title: string;

  @IsNumber()
  readonly year: number;

  @IsOptional()
  @IsString({ each: true })
  readonly genres: string[];
}
```

**update-movie.dto.ts**

```ts
export class UpdateMovieDTO extends PartialType(CreateMovieDTO) {}
```

**main.ts**

유효성 검사용 파이프 설정

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Decorator가 존재하지 않는 프로퍼티를 허용하지 않음
      forbidNonWhitelisted: true, // 허용하지 않은 프로퍼티를 사용한 리퀘스트를 차단
      transform: true, // 유저가 보낸 값의 타입을 자동 변환
    }),
  );
  await app.listen(3000);
}
```

**movie.controller.ts**

ValidationPipe의 transform 설정 후 Controller 변경

```ts
@Get(':id')
getOne(@Param('id') movieId: number): Movie {
  /* service */
}

@Post()
create(@Body() movieData: CreateMovieDTO): boolean {
  /* service */
}
```

### 2.4. Module

NestJS의 Module 생성하는 nest cli 명령어 (MovieModule 생성)

```zsh
nest g mo movie
```

**movie.module.ts**

```ts
@Module({
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
```

**movie.controller.ts**

MovieController에서 MovieService 의존성 주입(DI) 받기

```ts
@Controller('movie')
export class MovieController {
  constructor(private readonly movieServicec: MovieService) {}
}
```

**app.module.ts**

```ts
@Module({
  imports: [MovieModule],
  controllers: [AppController],
})
export class AppModule {}
```
