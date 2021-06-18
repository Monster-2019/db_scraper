const moment = require('moment')
const logger = require('./logger')
// const HttpsProxyAgent = require('https-proxy-agent')
const fs = require('fs')
const cheerio = require('cheerio')
const fetch = require('node-fetch')
const dealData = require('./deal')

const cookie = 'll="108296"; bid=x9Ph-lhwpbY; push_noty_num=0; push_doumail_num=0; douban-fav-remind=1; _ga=GA1.2.632792398.1621586045; gr_user_id=8929f845-1b4b-4147-aca9-1d6bbca5dc1d; ct=y; dbcl2="238471146:VoHrDLUNdz0"; __utmv=30149280.23847; ck=0lcn; __utmc=30149280; __utmz=30149280.1622517596.15.10.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not provided); _pk_ref.100001.8cb4=["","",1622530377,"https://www.google.com/"]; _pk_ses.100001.8cb4=*; __utma=30149280.632792398.1621586045.1622527024.1622530377.18; __utmt=1; _pk_id.100001.8cb4=296170f7976dd179.1621586044.16.1622530910.1622527166.; __utmb=30149280.30.8.1622530883699'
const options = {
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:87.0) Gecko/20100101 Firefox/87.0', // UA标识，装作浏览器
    Referer: 'https://www.douban.com',
    Cookie: cookie,
  },
}

const currentYear = moment().format('YYYY')
const currentDate = moment().format('MM-DD')
const currentUnix = moment(moment().format('YYYY-MM-DD HH:mm')).format('x')

const groupUrls = [
  // "https://www.douban.com/group/709827/discussion"
  // "https://www.douban.com/group/"
  'https://www.douban.com/group/changningzufan/discussion',
  'https://www.douban.com/group/zufan/discussion',
  'https://www.douban.com/group/467799/discussion',
  // 'https://www.douban.com/group/shanghaizufang/discussion',
]

let topicList = []
// let proxyList = []
// let proxyIndex = 0
// let curProxy = {}

const getTopicLink = (html) => {
  let end = false
  const $ = cheerio.load(html)
  const topic = $('td[class=time]', '.olt')
    .filter((i, el) => {
      let today = currentUnix - moment(currentYear + '-' + $(el).text()).format('x') < 3600000
      // let today = $(el).text().match(/^\d{1,2}(分钟|秒)前$/g)
      if (!today) end = true
      return today
    })
    .map((i, el) => {
      return $(el).prevAll('.title').children('a').attr('href')
      // return $(el).prevAll('.td-subject').children('a').attr('href')
    })
    .get()

  topic.forEach(url => {
    if (!topicList.includes(url)) topicList.push(url)
  })

  return end
}

const crawlTopic = async (urlList) => {
  const list = []
  for (let url of urlList) {
    // curProxy = proxyList[proxyIndex++]
    // if (proxyIndex === proxyList.length) proxyIndex = 0
    // let proxy = `${curProxy.protocol}://${curProxy.ip}:${curProxy.port}`
    // const proxyAgent = new HttpsProxyAgent(proxy);
    const response = await fetch(url, {
      ...options,
      // agent: proxyAgent
    })
    if (!response.ok) return list
    const html = await response.text()

    // let fileName = 'topic' + url.match(/\d{9}/)[0] + '.html'
    let s = Math.round(Math.random() * (3 - 1)) + 1 

    list.push(html)

    // fs.writeFile(`topic/${fileName}`, html, function (err) {
    //   if (!err) {
    // console.log(`文件${fileName}获取成功!等待${s}秒后继续`)
    console.log(`文章${url}完!等待${s}秒`)
    //   } else {
    //     console.log(err)
    //   }
    // })

    await new Promise((r) => setTimeout(r, s * 1000))
  }
  return list
}

const crawl = async (url, start) => {
  // let api = url + 'discussion?start='
  let api = url + '?start='
  // curProxy = proxyList[proxyIndex++]
  // if (proxyIndex === proxyList.length) proxyIndex = 0
  // let proxy = `${curProxy.protocol}://${curProxy.ip}:${curProxy.port}`
  // const proxyAgent = new HttpsProxyAgent(proxy);
  const response = await fetch(api + start, {
    ...options,
    // agent: proxyAgent
  })
  if (!response.ok) return 0
  const html = await response.text()
  let s = Math.round(Math.random() * (3 - 1)) + 1 
  console.log(`${api + start}完成，等待${s}秒后继续`)

  let isEnd = getTopicLink(html)
  console.log(isEnd, start)
  // if (!isEnd || start === 0) {
  if (!isEnd) {
    await new Promise((r) => setTimeout(r, s * 1000))
    start += 25
    // start += 50
    await crawl(url, start)
  } else {
    return 0
  }
}

const crawlList = async () => {
  for (let url of groupUrls) {
    await crawl(url, 0)
  }
  logger.info(`数据获取完成`)
  crawlTopic(topicList)
    .then(res => {
      dealData(res)
    })
}

module.exports = crawlList