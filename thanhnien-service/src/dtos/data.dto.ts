import { IsNotEmpty } from "class-validator"

export class ArticleDto {
    @IsNotEmpty()
    author: string

    @IsNotEmpty()
    title: string

    @IsNotEmpty()
    detailUrl: string

    @IsNotEmpty()
    test: string
    
    @IsNotEmpty()
    date: string

    @IsNotEmpty()
    source: 'Thanhnien'

    @IsNotEmpty()
    content: string
}