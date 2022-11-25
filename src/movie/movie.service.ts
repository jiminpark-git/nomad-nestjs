import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDTO } from './dto/create-movie.dto';
import { UpdateMovieDTO } from './dto/update-movie.dto';
import { Movie } from './entities/Movie.entity';

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

  deleteOne(id: number): boolean {
    this.getOne(id);
    this.Movie = this.Movie.filter((movie) => movie.id !== id);
    return true;
  }

  create(movieData: CreateMovieDTO): boolean {
    this.Movie.push({
      id: this.Movie.length + 1,
      ...movieData,
    });
    return true;
  }

  update(id: number, updateData: UpdateMovieDTO) {
    const movie = this.getOne(id);
    this.deleteOne(id);
    this.Movie.push({ ...movie, ...updateData });
    return true;
  }
}
