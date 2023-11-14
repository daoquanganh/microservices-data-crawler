import { IsNotEmpty } from "class-validator"

export class DataDto {
    @IsNotEmpty()
    author: string

    @IsNotEmpty()
    title: string

    @IsNotEmpty()
    detailUrl: string
    
    @IsNotEmpty()
    date: string

    @IsNotEmpty()
    website: string

    @IsNotEmpty()
    content: string
}