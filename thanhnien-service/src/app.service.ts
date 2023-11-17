import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import axios from 'axios';
import * as cheerio from 'cheerio'
import { ArticleDto } from './dtos/data.dto';

@Injectable()
export class AppService {
    constructor() {}

    async crawl(): Promise<ArticleDto[]>{
        try {
            const url= 'https://thanhnien.vn'
            const fetched = await axios(url);
            const $ = cheerio.load(fetched.data, {xml:true});
            let data =[]
            for (const el of $('.box-category-item')) {
                const title = $(el).find('a').attr('title')
                const regex= /[!-\/:-@[-`{-~]/
                if ( !(regex.test(title)) && title!='') {
                    let detailUrl = $(el).find('a').attr('href')
                    detailUrl = url + detailUrl
                    const details = await axios(detailUrl)
                    const c = cheerio.load(details.data)
                    let date =  c('.detail-time div').text()
                    date = date.replaceAll('\n', '').trim()
                    let content = ''
                    for (const ele of c('.detail-cmain p')) {
                        content+= c(ele).text()
                        content+=`\n`
                    }
                    const author = c('.author-info-top a').text()
                    if (author != '' && content != '') data.push({title, detailUrl, date, author, content, source: 'Thanhnien'})
                    content=''
                }
            }
            console.log(data)
            return data
        } catch(e) {
            console.log(e)
        }
    }
    
}
