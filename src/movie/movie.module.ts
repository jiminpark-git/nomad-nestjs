import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './Movie.service';

@Module({
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
