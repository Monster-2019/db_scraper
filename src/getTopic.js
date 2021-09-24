const cheerio = require('cheerio')
const fetch = require('node-fetch')
const dealData = require('./deal')
const { groupNo, keywords, sleep, getHeader } = require('./config')
const logger = require('./logger')

const baseUrl = "https://www.douban.com/group/search?"

let topicList = []

const spliceUrl = (groupNo, keyword) => {
  return baseUrl + `cat=1013&sort=time&group=${groupNo}&q=${keyword}`
}

const getTopicLink = (html) => {
  let end = false
  const $ = cheerio.load(html)
  const topic = $('td[class=td-time] span', '.olt')
    .filter((i, el) => {
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
    const response = await fetch(url, {
      headers: getHeader(),
    })
    if (!response.ok) {
      let code = response.status
      logger.error(`URL: ${url}, Code: ${code}, Message: ${response.statusText}`)
      if (code !== 404) {
        urlList.push(url)
        await sleep(60, 120)
      }
      continue
    }
    const html = await response.text()
    list.push(html)

    await sleep(4, 6)
  }
  return list
}

// 获取文章列表
const crawl = async (url, start = 0) => {
  let api = url + `&start=${start}`
  api = encodeURI(api)
  const response = await fetch(api, {
    headers: getHeader(),
  })
  if (!response.ok) {
    let code = response.status
    logger.error(`URL: ${api}, Code: ${code}, Message: ${response.statusText}`)
    await sleep(60, 120)
    await crawl(url, start)
  }
  const html = await response.text()
  let isEnd = getTopicLink(html)

  if (!isEnd) {
    start += 50
    await sleep(4, 6)
    await crawl(url, start)
  } else {
    return 0
  }
}

const crawlList = async () => {
  logger.info(`获取数据为:组号为${groupNo.join('、')}，关键字为${keywords.join('、')}`)
  for (let url of groupNo) {
    for (let key of keywords) {
      await crawl(spliceUrl(url, key))
      await sleep(4, 6)
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