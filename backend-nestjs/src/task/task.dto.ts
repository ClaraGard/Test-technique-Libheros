import { IsNotEmpty, IsString, IsBoolean, IsOptional, IsDateString } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  shortDescription: string;

  @IsNotEmpty()
  @IsString()
  longDescription: string;

  @IsNotEmpty()
  dueDate: Date;

  @IsNotEmpty()
  taskListId: number;
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsOptional()
  @IsString()
  longDescription?: string;

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @IsOptional()
  @IsDateString()
  dueDate?: Date;
}
