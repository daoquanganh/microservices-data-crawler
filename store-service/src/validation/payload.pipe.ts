

import { BadRequestException, HttpException, HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RpcException } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { ArticleDto } from "src/dtos/article.dto";
import { PayloadDto } from "src/dtos/payload.dto";
import { Article } from "src/entities/article.entity";
import { Repository } from "typeorm";


// Pipe checking for unique articles in payload
@Injectable()
export class PayloadValidationPipe implements PipeTransform {
    constructor(@InjectRepository(Article) private readonly articleRepo: Repository<Article>) {}
    async transform(value: PayloadDto) {
        const articles = await this.articleRepo.find({select:['detailUrl']})
        let urls = articles.map(article=> article.detailUrl)
        value.data = value.data.filter((article) => {
            return !urls.includes(article.detailUrl)
        })
        return value
    }
}
