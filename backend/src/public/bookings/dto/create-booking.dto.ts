import { IsString, IsNotEmpty, IsEmail, IsOptional, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  serviceId: string;

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @IsEmail()
  @IsOptional()
  customerEmail?: string;

  @IsDateString()
  @IsNotEmpty()
  bookingDate: string; // YYYY-MM-DD

  @IsString()
  @IsNotEmpty()
  bookingTime: string; // HH:mm (예: "14:30")

  @IsString()
  @IsOptional()
  specialRequest?: string;
}
