import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsDateString, IsInt, Min, MaxLength } from 'class-validator';
import { VisitorType, VisitState } from '@prisma/client';

export class CreateWalkInDto {
  @ApiProperty({ description: 'Flat ID for the visit' })
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

  @ApiProperty({ description: 'Purpose of visit' })
  @IsString()
  @MaxLength(200)
  purpose = '';

  @ApiProperty({ enum: VisitorType, description: 'Type of visitor' })
  @IsEnum(VisitorType)
  visitorType = VisitorType.VISITOR;

  @ApiPropertyOptional({ description: 'Photo URL of visitor' })
  @IsOptional()
  @IsString()
  photoUrl?: string;
}

export class CreatePreApprovedDto {
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

export class ApproveVisitDto {
  @ApiProperty({ enum: ['APPROVE', 'DENY'] })
  @IsEnum(['APPROVE', 'DENY'])
  action: 'APPROVE' | 'DENY' = 'APPROVE';
}

export class CheckInDto {}

export class CheckOutDto {}

export class VisitHistoryQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number | undefined = 1;

  @ApiPropertyOptional({ default: 20, maximum: 100 })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number | undefined = 20;
}

export class PendingVisitsQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number | undefined = 1;

  @ApiPropertyOptional({ default: 20, maximum: 100 })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number | undefined = 20;
}