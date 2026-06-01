import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsInt,
  IsIn,
} from 'class-validator';

export class CreateIssueDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  mobile_number: string;

  @IsDateString()
  @IsNotEmpty()
  date_of_purchase: string;

  @IsOptional()
  @IsInt()
  product_id?: number;

  @IsOptional()
  @IsString()
  device?: string;

  @IsString()
  @IsNotEmpty()
  issue_with_device: string;

  @IsDateString()
  @IsNotEmpty()
  date_of_issue: string;

  @IsDateString()
  @IsNotEmpty()
  date_for_pickup: string;

  @IsString()
  @IsIn(['8-11am', '11-2pm', '2-5pm', '5-8pm'])
  timeslot_for_pickup: string;
}
