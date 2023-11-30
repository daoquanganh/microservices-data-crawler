import { Type } from "class-transformer"
import { ValidateNested } from "class-validator"
import { ArticleDto } from "./article.dto"

export class PayloadDto {
    @ValidateNested({ each:true})
    @Type(() => ArticleDto)
    data: ArticleDto[]
}