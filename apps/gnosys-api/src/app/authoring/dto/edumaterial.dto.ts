import {
    IsNotEmpty,
    MinLength,
    MaxLength,
    IsString,
    IsArray,
    IsEmail,
} from 'class-validator';
  
export class CreateEduMaterialDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(255)
    readonly scriptid: string;
    @IsNotEmpty()
    @IsString()
    @IsArray()
    @MinLength(5)
    @MaxLength(255)
    readonly scriptname: string;
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(255)
    readonly about: string;
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(1024)
    readonly file: string;
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(255)
    readonly video: string;
}
  