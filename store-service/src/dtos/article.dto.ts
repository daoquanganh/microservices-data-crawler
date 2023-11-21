import { IsNotEmpty } from "class-validator"
import { IsUnique } from "src/validation/unique.validation"

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
    source: string

    @IsNotEmpty()
    content: string
}