import axios from 'axios'
import cheerio from 'cheerio'
import { getUserAgent } from './config.js'

let poolList = []

const getPoolList = async () => {
    const res = await axios.get('https://www.proxy-list.download/api/v1/get?type=https&country=CN', {
        headers
    })
    const list = res.data.split('\r\n')
    poolList = list.slice(0, list.length - 1)
}

const getProxy = async () => {
    const [host, port] = poolList[Math.floor(Math.random() * (poolList.length - 1))].split(':')
    return { host, port }
}

const headers = async () => {
    const proxy = await getProxy()
    return {
        'User-Agent': getUserAgent(),
        proxy
    }
}

const url = 'https://www.douban.com/group/search?group=338839&cat=1013&q=中山公园'

const getTopic = async () => {
    const res = await axios.get(url, { headers: await headers() })
    const $ = cheerio.load(res.data)
    $('.pl').each((i, el) => {
        console.log($(el).find('a').attr('href'))
        console.log($(el).find('a').attr('title'))
        console.log($(el).find('.td-time').text())
    })
    // console.log(res.data)
}

const getDetail = async () => {
    const url = 'https://www.douban.com/group/topic/276484887/'
    const res = await axios.get(url, { headers: await headers() })
    const $ = cheerio.load(res.data)
    const json = JSON.parse($('script[type="application/ld+json"]').text().replace(/\s/g, ''))
    console.log(json, json['text'])
}

const start = async () => {
    await getPoolList()
    await getTopic()
    await getDetail()
}

start()