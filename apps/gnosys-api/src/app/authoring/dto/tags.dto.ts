import {
    IsNotEmpty,
    MinLength,
    MaxLength,
    IsString,
    IsEmail,
} from 'class-validator';
  
export class CreateTagsDto {
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(255)
    readonly language: string;
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(255)
    readonly tag: string;
}
  