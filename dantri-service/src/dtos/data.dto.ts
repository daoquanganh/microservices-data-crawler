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
    source: 'Dantri'

    @IsNotEmpty()
    content: string
}