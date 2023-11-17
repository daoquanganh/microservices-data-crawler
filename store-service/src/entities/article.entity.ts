import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsNotEmpty } from "class-validator";

@Entity()
export class Article {
    
    @PrimaryGeneratedColumn()
    id: string

    @IsNotEmpty()
    @Column()
    title: string;

    @IsNotEmpty()
    @Column({unique:true})
    detailUrl: string

    @IsNotEmpty()
    @Column()
    author: string

    @IsNotEmpty()
    @Column({type: 'longtext'})
    content: string

    @IsNotEmpty()
    @Column()
    date: string

    @IsNotEmpty()
    @Column()
    source: string

}
