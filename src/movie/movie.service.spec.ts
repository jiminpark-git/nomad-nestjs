import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from './Movie.service';

describe('MovieService', () => {
  let service: MovieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MovieService],
    }).compile();

    service = module.get<MovieService>(MovieService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array', () => {
      const movies = service.getAll();
      expect(movies).toBeInstanceOf(Array);
    });
  });

  describe('getOne', () => {
    it('should return a movie', () => {
      service.create({
        title: 'Test',
        year: 2020,
        genres: ['test'],
      });

      const movie = service.getOne(1);
      expect(movie).toBeDefined();
      expect(movie.id).toEqual(1);
    });

    it('should throw 404 error', () => {
      const testId: number = 999;
      try {
        service.getOne(testId);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual(`Movie with ID ${testId} not found.`);
      }
    });
  });

  describe('deleteOne', () => {
    it('delete a movie', () => {
      service.create({
        title: 'Test',
        year: 2020,
        genres: ['test'],
      });

      const success = service.deleteOne(1);
      expect(success).toEqual(true);
    });

    it('should return a 404 error', () => {
      const testId: number = 999;

      try {
        service.deleteOne(testId);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual(`Movie with ID ${testId} not found.`);
      }
    });
  });

  describe('create', () => {
    it('should create a movie', () => {
      const beforeCreate = service.getAll().length;
      service.create({
        title: 'Test',
        year: 2020,
        genres: ['test'],
      });
      const afterCreate = service.getAll().length;

      expect(afterCreate).toBeGreaterThan(beforeCreate);
    });
  });

  describe('update', () => {
    it('should update a movie', () => {
      service.create({
        title: 'Test',
        year: 2020,
        genres: ['test'],
      });
      service.update(1, {
        year: 2022,
      });
      const movie = service.getOne(1);

      expect(movie.year).toEqual(2022);
    });

    it('should return a 404 error', () => {
      const testId: number = 999;

      try {
        service.update(testId, {});
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual(`Movie with ID ${testId} not found.`);
      }
    });
  });
});
