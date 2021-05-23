import * as fs from 'fs'
import * as cheerio from 'cheerio'
import * as moment from 'moment'

let end = false
let currentDate = moment().format('MM-DD')

const html = fs.readFileSync('index.html', 'utf-8')
const $ = cheerio.load(html)
const topicList = $('td[class=time]', '.olt')
    .filter((i, el) => {
        // console.log($(el).text())
        let today = $(el).text().indexOf(currentDate) === 0
        // console.log(today)
        if (!today) end = true
        return today
    }).map((i, el) => {
        return $(el).prevAll('.title').children('a').attr('href')
    }).get()

console.log(topicList)

// console.log(html)