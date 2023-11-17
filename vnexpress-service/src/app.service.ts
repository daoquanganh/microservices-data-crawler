import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import axios from 'axios';
import * as cheerio from 'cheerio'
import { ArticleDto } from './dtos/data.dto';


@Injectable()
export class AppService {

  constructor(@Inject('CRAWL_SERVICE') private readonly client: ClientProxy) {}
  
  async crawl(): Promise<ArticleDto[]> {
    try {
      const url = 'https://vnexpress.net/'
      const fetched = await axios(url)
      const $ = cheerio.load(fetched.data, {xml:true})
      let data : ArticleDto[] = []
      for (const el of $('.item-news')) {
          const title = $(el).find('.title-news a').text()
          const regex= /[!-\/:-@[-`{-~]/
          if ( !(regex.test(title)) && title!='') {
              const detailUrl = $(el).find('a').attr('href')
              const details = await axios(detailUrl)
              const c = cheerio.load(details.data)
              const date =  c('.date').text()
              let content = ''
              if (c('.Normal').text().length>0) {
                for (const ele of c('.Normal')) {
                  content+= c(ele).text()
                  content+=`\n`
                }
              }
              let author =''
              for (let element of (c('.Normal strong').text() === '' 
                                      ? c('.author_mail strong').text() === '' 
                                          ? c('strong')
                                          : c('.author_mail strong')
                                      : c('.Normal strong'))) {
                  author = c(element).text()
              }
              content = content.slice(0, (content.length))
              if (content!= '' && author != '') data.push({title, detailUrl, date, author, content, source: 'Vnexpress'})
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

