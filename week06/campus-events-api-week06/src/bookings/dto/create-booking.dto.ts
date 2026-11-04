import { IsString, Length, IsEmail, IsInt, Min, Max } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @Length(2, 100)
  name: string;

  @IsEmail()
  email: string;

  @IsInt()
  @Min(1)
  @Max(4)
  seats: number;
}