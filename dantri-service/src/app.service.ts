import { Injectable } from '@nestjs/common';
import axios from 'axios'
import * as cheerio from 'cheerio'
@Injectable()
export class AppService {
    async crawl(){
        try {
            const url= 'https://dantri.com.vn'
            const fetched = await axios(url);
            const $ = cheerio.load(fetched.data, {xml:true});
            let data =[]
            for (const el of $('.article-item')) {
                const title = $(el).find('.article-title').text()
                const regex= /[!-\/:-@[-`{-~]/
                if ( !(regex.test(title)) && title!='') {
                    const detailUrl = $(el).find('.article-title a').attr('href')
                    const details = await axios(url+detailUrl)
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
            console.log(uniqueData)
            return uniqueData
        } catch(e) {
            console.log(e)
        }
    }
}
