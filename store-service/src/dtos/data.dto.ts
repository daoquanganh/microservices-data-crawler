import { IsNotEmpty } from "class-validator"

export class ArticleDto {
    @IsNotEmpty()
    author: string

    @IsNotEmpty()
    test: string
    
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