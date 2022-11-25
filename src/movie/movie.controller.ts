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
  constructor(private readonly movieServicec: MovieService) {}

  @Get()
  getAll(): Movie[] {
    return this.movieServicec.getAll();
  }

  @Get(':id')
  getOne(@Param('id') movieId: number): Movie {
    return this.movieServicec.getOne(movieId);
  }

  @Post()
  create(@Body() movieData: CreateMovieDTO): boolean {
    return this.movieServicec.create(movieData);
  }

  @Delete(':id')
  deleteOne(@Param('id') movieId: number): boolean {
    return this.movieServicec.deleteOne(movieId);
  }

  @Patch(':id')
  patch(
    @Param('id') movieId: number,
    @Body() updateData: UpdateMovieDTO,
  ): boolean {
    return this.movieServicec.update(movieId, updateData);
  }
}
