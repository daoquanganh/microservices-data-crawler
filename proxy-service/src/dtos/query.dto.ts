import { IsNotEmpty } from "class-validator";

export class QueryDto {

    @IsNotEmpty()
    source: 'dantri' | 'vnexpress' | 'thanhnien'
}