import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import { ArticleDto } from './dtos/article.dto';

@Injectable()
export class AppService {
  constructor(@InjectRepository(Article) private articleRepo: Repository<Article>
  ) {}
  async create(data: ArticleDto[]) {
    if (data) {
      data.forEach(async (article: ArticleDto) => {
        await this.articleRepo.save(article)
      })
      return data
    } else throw new NotFoundException()

  }
}
