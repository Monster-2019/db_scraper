import axios from 'axios'
import cheerio from 'cheerio'
import { getUserAgent, groupNo, keywords } from './config.js'
import HttpsProxyAgent from 'https-proxy-agent'

let poolList = []
let topics = []
let currentDate = ''
let successCount = 0
let failCount = 0

const getPoolList = async () => {
    const res = await axios.get('https://www.proxy-list.download/api/v1/get?type=https&country=CN')
    const list = res.data.split('\r\n')
    poolList = list.slice(0, list.length - 1)
}

const getProxy = async () => {
    const [host, port] = poolList[Math.floor(Math.random() * (poolList.length - 1))].split(':')
    return { host, port }
}

const headers = async () => {
    const proxy = await getProxy()
    console.log({
        'User-Agent': getUserAgent(),
        proxy
    })
    return {
        'User-Agent': getUserAgent(),
        proxy
    }
}

const getTopics = async () => {
    for (let group of groupNo) {
        for (let keyword of keywords) {
            let url = `https://www.douban.com/group/search?group=${group}&cat=1013&q=${keyword}`
            const { data, status } = await axios.get(url, { headers: await headers() })
            await sleep()
            if (status !== 200) continue
            const $ = cheerio.load(data)
            $('.pl').each((i, el) => {
                const link = $(el).find('a').attr('href')
                const time = $(el).find('.td-time').text()
                if (time === currentDate) topics.push(link)
            })
        }
    }
}

const sleep = async () => {
    return await new Promise(resolve => {
        setTimeout(resolve(), Math.floor(Math.random() * 500) + 250)
    })
}

const getDetail = async () => {
    // const url = 'https://www.douban.com/group/topic/276484887/'
    for (let url of topics) {
        const { data, status } = await axios.get(url, { headers: await headers() })
        await sleep()
        if (status !== 200) continue
        const $ = cheerio.load(data)
        const json = JSON.parse($('script[type="application/ld+json"]').text().replace(/\s/g, ''))
        const params = {
            title: json['name'],
            content: json['text'],
            url: json['url'],
            date: json['dateCreated'].replace('T', ' ')
        }
        await addTopic(params)
    }
}

const addUrl = 'https://db-api.dongxin.cool/v1/topic'
const addTopic = async (params) => {
    const res = await axios.post(addUrl, params, {
        headers: {
            'content-type': "application/json"
        }
    })
    if (res.data.code) successCount++
    if (!res.data.code) failCount++
    // console.log(res.data)
}

const start = async () => {
    const date = new Date()
    // currentDate = date.getMonth() + 1 + '-' + date.getDate()
    // currentDate = '10-20'
    await getPoolList()
    // await getTopics()
    // console.log(topics)
    // await getDetail()
    // console.log(`成功：${successCount}，失败：${failCount}`)

    let url = `https://www.douban.com/group/search?group=338839&cat=1013&q=娄山关路`
    const header = await headers()
    const { status, data } = await axios.get('http://httpbin.org/ip', { headers: header })
    console.log(data, status)
}

start()