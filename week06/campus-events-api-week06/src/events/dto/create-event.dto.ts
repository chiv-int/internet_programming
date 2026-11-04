import {
  IsString,
  Length,
  IsIn,
  IsISO8601,
  IsInt,
  Min,
  Max,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { CATEGORIES, type Category } from '../event.entity.js';

export class CreateEventDto {
  @IsString()
  @Length(3, 100)
  title: string;

  @IsIn(CATEGORIES)
  category: Category;

  @IsISO8601({ strict: true })
  startsAt: string;

  @IsString()
  @Length(1, 100)
  location: string;

  @IsInt()
  @Min(1)
  @Max(1000)
  capacity: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}