import { IsNotEmpty } from "class-validator"

export class ArticleDto {
    @IsNotEmpty()
    author: string

    @IsNotEmpty()
    title: string

    @IsNotEmpty()
    detailUrl: string
    
    @IsNotEmpty()
    date: string

    @IsNotEmpty()
    source: 'Vnexpress'

    @IsNotEmpty()
    content: string
}