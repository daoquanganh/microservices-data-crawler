import { Injectable } from '@nestjs/common';
import axios from 'axios'
import * as cheerio from 'cheerio'
import { ArticleDto } from './dtos/data.dto';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Duplicate } from './entities/duplicate.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
    constructor(@InjectRepository(Duplicate) private readonly duplicateRepo: Repository<Duplicate>) {}
    async crawl(){
        try {
            const url= 'https://dantri.com.vn'
            const fetched = await axios(url);
            const $ = cheerio.load(fetched.data, {xml:true});
            let data =[]
            for (const el of $('.article-item')) {
                if (data.length > 15) break
                const title = $(el).find('.article-title').text()
                const regex= /[!-\/:-@[-`{-~]/
                if ( !(regex.test(title)) && title!='') {
                    let detailUrl = $(el).find('.article-title a').attr('href')
                    detailUrl = url + detailUrl
                    const details = await axios(detailUrl)
                    const c = cheerio.load(details.data)
                    let date =  c('.author-time').text() !== '' ? c('.author-time').text() : c('time').text()
                    date = date.replaceAll('\n', '').trim()
                    let content = ''
                    for (const ele of (c('.singular-content p').text() !== ''
                                        ? c('.singular-content p')
                                        : c('.e-magazine__body p'))) {
                        content+= c(ele).text()
                        content+=`\n`
                    }
                    const author = c('.author-name b').text() !== '' ? c('.author-name b').text() : c('strong .e-magazine__meta').text()
                    if (author != '' && content != '') data.push({title, detailUrl, date, author, content, source: 'Dantri'})
                    content=''
                }
            }
            let uniqueStringData = [...new Set(data.map((obj) => {return JSON.stringify(obj)}))]
            let uniqueData = uniqueStringData.map((obj)=> {return JSON.parse(obj)})
            uniqueData = await this.duplicateCheck(uniqueData)
            console.log(uniqueData)
            return uniqueData
        } catch(e) {
            console.log(e)
            throw new RpcException(e)
        }
    }

    async duplicateCheck(articles: ArticleDto[] ): Promise<ArticleDto[]> {
        try {
            const duplicates = await this.duplicateRepo.find({select:['detailUrl']})
            if (duplicates) {
                let urls = duplicates.map(article=> article.detailUrl)
                articles = articles.filter((article) => {
                    return !urls.includes(article.detailUrl)
                })
            }
            const results = await this.duplicateRepo.save(articles)
            return results.map(({id,...rest}) => rest)            
        } catch (e) {
            console.log(e)
            throw new RpcException(e)
        }
    }
}
