import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import { ArticleDto } from './dtos/data.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(@InjectRepository(Article) private articleRepo: Repository<Article>
  ) {}
  async create(data: ArticleDto[]) {
    data.forEach(async (article: ArticleDto) => {
      await this.articleRepo.save(article).catch((e)=> {
        console.log(e)
      })
    })
    // console.log(data)
    return data
  }
}
