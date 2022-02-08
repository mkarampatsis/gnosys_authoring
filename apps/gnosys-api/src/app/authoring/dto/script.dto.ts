import {
    IsNotEmpty,
    MinLength,
    MaxLength,
    IsString,
    IsArray,
    IsEmail,
} from 'class-validator';
  
export class CreateScriptDto {
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(255)
    readonly name: string;
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    readonly Description: string;
    @IsNotEmpty()
    @IsArray()
    @MinLength(5)
    @MaxLength(1024)
    readonly code: string;
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(255)
    readonly language: string;
}
  