import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import { DataDto } from './dtos/data.dto';

@Injectable()
export class AppService {
  constructor(@InjectRepository(Article) private articleRepo: Repository<Article>
  ) {}
  async create(data: DataDto[]) {
    data.forEach(async (article) => {
      const duplicated = await this.articleRepo.findOneBy({title: article.title})
      if (duplicated == null) {
        await this.articleRepo.save(article)
      }
    })
    return data
  }
}
