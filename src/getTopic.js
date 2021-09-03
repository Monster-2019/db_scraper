const moment = require('moment')
// const HttpsProxyAgent = require('https-proxy-agent')
const cheerio = require('cheerio')
const fetch = require('node-fetch')
const dealData = require('./deal')
const { groupNo, keywords, getUserAgent, returnIp } = require('../config')
const logger = require('./logger')

const cookie = process.env.COOKIE

const options = {
  headers: {
    'User-Agent': getUserAgent(),
    // 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:87.0) Gecko/20100101 Firefox/87.0', // UA标识，装作浏览器
    Referer: 'https://www.douban.com',
    Cookie: cookie,
  },
}

const baseUrl = "https://www.douban.com/group/search?"

let topicList = []
// let proxyList = []
// let proxyIndex = 0
// let curProxy = {}

const spliceUrl = (groupNo, keyword) => {
  return baseUrl + `cat=1013&sort=time&group=${groupNo}&q=${keyword}`
}

const getTopicLink = (html) => {
  let end = false
  const $ = cheerio.load(html)
  const topic = $('td[class=td-time] span', '.olt')
    .filter((i, el) => {
      // let today = currentUnix - moment(currentYear + '-' + $(el).text()).format('x') < 3600000
      let today = $(el).text().match(/^(今天|昨天)|前$/)
      if (today) {
        if (today[0] === '昨天') return true
      } else {
        if (!today) end = true
      }
      return false
    })
    .map((i, el) => {
      return $(el).parent().prevAll('.td-subject').children('a').attr('href')
      // return $(el).prevAll('.td-subject').children('a').attr('href')
    })
    .get()

  topic.forEach(url => {
    if (!topicList.includes(url)) topicList.push(url)
  })

  return end
}

// 获取文章
const crawlTopic = async (urlList) => {
  const len = urlList.length
  logger.info(`共${len}条新数据`)
  const list = []
  for (let url of urlList) {
    // curProxy = proxyList[proxyIndex++]
    // if (proxyIndex === proxyList.length) proxyIndex = 0
    // let proxy = `${curProxy.protocol}://${curProxy.ip}:${curProxy.port}`
    // const proxyAgent = new HttpsProxyAgent(proxy);
    const response = await fetch(url, {
      headers: {
        'User-Agent': getUserAgent(),
        // 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:87.0) Gecko/20100101 Firefox/87.0', // UA标识，装作浏览器
        Referer: 'https://www.douban.com',
        Cookie: cookie,
        "X-Forwarded-For": returnIp()
      },
      // agent: proxyAgent
    })
    if (!response.ok) {
      // console.log('请求频繁')
      urlList.push(url)
      logger.error(`请求失败，错误：${response.statusText}`)
      await new Promise((r) => setTimeout(r, 60 * 1000))
      continue
      // return list
    }
    const html = await response.text()

    // let fileName = 'topic' + url.match(/\d{9}/)[0] + '.html'
    let s = Math.round(Math.random() * (5 - 3)) + 3

    list.push(html)

    // fs.writeFile(`topic/${fileName}`, html, function (err) {
    //   if (!err) {
    // console.log(`文件${fileName}获取成功!等待${s}秒后继续`)
    // console.log(`文章${url}完!等待${s}秒`)
    //   } else {
    //     console.log(err)
    //   }
    // })

    await new Promise((r) => setTimeout(r, s * 1000))
  }
  return list
}

// 获取文章列表
const crawl = async (url, start = 0) => {
  let api = url + `&start=${start}`
  // curProxy = proxyList[proxyIndex++]
  // if (proxyIndex === proxyList.length) proxyIndex = 0
  // let proxy = `${curProxy.protocol}://${curProxy.ip}:${curProxy.port}`
  // const proxyAgent = new HttpsProxyAgent(proxy);
  api = encodeURI(api)
  const response = await fetch(api, {
    headers: {
      'User-Agent': getUserAgent(),
      // 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:87.0) Gecko/20100101 Firefox/87.0', // UA标识，装作浏览器
      Referer: 'https://www.douban.com',
      Cookie: cookie,
      "X-Forwarded-For": returnIp()
    },
    // agent: proxyAgent
  })
  if (!response.ok) {
    // console.log('请求频繁')
    logger.error(`${response.statusText}`)
    return 0
  }
  const html = await response.text()
  let s = Math.round(Math.random() * (5 - 3)) + 3
  // console.log(`${api}完成，等待${s}秒后继续`)

  let isEnd = getTopicLink(html)
  if (!isEnd) {
    await new Promise((r) => setTimeout(r, s * 1000))
    // start += 25
    start += 50
    await crawl(url, start)
  } else {
    return 0
  }
}

console.log(groupNo, keywords)

const crawlList = async () => {
  logger.info(`获取数据为:组号为${groupNo.join('、')}，关键字为${keywords.join('、')}`)
  for (let url of groupNo) {
    for (let key of keywords) {
      await crawl(spliceUrl(url, key))
      let s = Math.round(Math.random() * (5 - 3)) + 3
      await new Promise((r) => setTimeout(r, s * 1000))
    }
  }
  crawlTopic(topicList)
    .then(res => {
      dealData(res)
        .then(res => {
          logger.info(`脚本执行结束!!!`)
        })
    })
}

module.exports = crawlList