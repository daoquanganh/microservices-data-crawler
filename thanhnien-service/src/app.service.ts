import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import axios from 'axios';
import * as cheerio from 'cheerio'

@Injectable()
export class AppService {
    constructor() {}

    async crawl(){
        try {
            const url= 'https://thanhnien.vn'
            const fetched = await axios(url);
            const $ = cheerio.load(fetched.data, {xml:true});
            let data =[]
            for (const el of $('.box-category-item')) {
                const title = $(el).find('a').attr('title')
                const regex= /[!-\/:-@[-`{-~]/
                if ( !(regex.test(title)) && title!='') {
                    const detailUrl = $(el).find('a').attr('href')
                    const details = await axios(url+detailUrl)
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
