import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsInt, Min, MaxLength } from 'class-validator';
import { VisitorType } from '@prisma/client';

export class CreatePassDto {
  @ApiProperty({ description: 'Flat ID for the pass' })
  @IsString()
  flatId = '';

  @ApiProperty({ description: 'Visitor name' })
  @IsString()
  @MaxLength(100)
  visitorName = '';

  @ApiPropertyOptional({ description: 'Visitor phone number' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  visitorPhone?: string;

  @ApiProperty({ description: 'Pass validity start (ISO 8601)' })
  @IsDateString()
  validFrom = '';

  @ApiProperty({ description: 'Pass validity end (ISO 8601)' })
  @IsDateString()
  validTo = '';

  @ApiProperty({ description: 'Number of uses allowed', default: 1 })
  @IsInt()
  @Min(1)
  usesLeft = 1;

  @ApiPropertyOptional({ description: 'Purpose of visit' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  purpose?: string;
}

export class VerifyPassDto {
  @ApiProperty({ description: 'Pass code to verify' })
  @IsString()
  @MaxLength(20)
  code = '';
}

export class PassResponseDto {
  @ApiProperty()
  id = '';

  @ApiProperty()
  code = '';

  @ApiProperty()
  visitorName = '';

  @ApiProperty()
  visitorPhone?: string;

  @ApiProperty()
  validFrom = new Date();

  @ApiProperty()
  validTo = new Date();

  @ApiProperty()
  usesLeft = 0;

  @ApiProperty()
  isActive = false;

  @ApiProperty()
  qrCode = '';
}