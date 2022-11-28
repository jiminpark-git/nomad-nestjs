import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MovieService } from './Movie.service';
import { Movie } from './entities/Movie.entity';
import { CreateMovieDTO } from './dto/create-movie.dto';
import { UpdateMovieDTO } from './dto/update-movie.dto';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  getAll(): Movie[] {
    return this.movieService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') movieId: number): Movie {
    return this.movieService.getOne(movieId);
  }

  @Post()
  create(@Body() movieData: CreateMovieDTO): boolean {
    return this.movieService.create(movieData);
  }

  @Delete(':id')
  deleteOne(@Param('id') movieId: number): boolean {
    return this.movieService.deleteOne(movieId);
  }

  @Patch(':id')
  patch(
    @Param('id') movieId: number,
    @Body() updateData: UpdateMovieDTO,
  ): boolean {
    return this.movieService.update(movieId, updateData);
  }
}
