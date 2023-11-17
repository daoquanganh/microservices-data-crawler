import { IsNotEmpty, Validate } from "class-validator"
// import { IsUnique } from "src/validation/unique.validation"

export class ArticleDto {
    @IsNotEmpty()
    author: string

    @IsNotEmpty()
    test: string
    
    @IsNotEmpty()
    title: string

    // @IsUnique()
    @IsNotEmpty()
    detailUrl: string
    
    @IsNotEmpty()
    date: string

    @IsNotEmpty()
    website: string

    @IsNotEmpty()
    content: string
}