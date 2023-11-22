import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsNotEmpty } from "class-validator";

@Entity()
export class Duplicate {
    
    @PrimaryGeneratedColumn()
    id: string

    @IsNotEmpty()
    @Column()
    title: string;

    @IsNotEmpty()
    @Column()
    detailUrl: string

    @IsNotEmpty()
    @Column()
    author: string

    @IsNotEmpty()
    @Column()
    date: string

    @IsNotEmpty()
    @Column()
    source: string
}