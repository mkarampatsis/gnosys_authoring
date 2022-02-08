import {
    IsNotEmpty,
    MinLength,
    MaxLength,
    IsString,
    IsArray,
    IsEmail,
} from 'class-validator';
  
export class CreateMetadataDto {
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
    readonly linesofcode: string;
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(1024)
    readonly timetosolve: string;
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(255)
    readonly numofif: string;
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(255)
    readonly numoffor: string;
    @IsNotEmpty()
    @IsString()
    @IsArray()    
    @MinLength(5)
    @MaxLength(255)
    readonly tags: Array<{ id: string, name: string }>;
}
  