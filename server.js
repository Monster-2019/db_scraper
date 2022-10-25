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

// <tr class="pl">
//     <td class="td-subject"><a class="" href="https://www.douban.com/group/topic/277056980/" onclick="moreurl(this,{i: '0', query: '%E4%B8%AD%E5%B1%B1%E5%85%AC%E5%9B%AD', from: 'group_topic_by_time', sid: 277056980})" title="2号线中山公园朝南两室招女室友，3300，11/5可入住">2号线中山公园朝南两室招女室友，3300，11/5可入住</a></td>
//     <td class="td-time" title="2022-10-20 13:02:21" nowrap="nowrap"><span class="">10-20</span></td>
//     <td class="td-reply" nowrap="nowrap"><span class="">0回应</span></td>
// </tr>

const url = 'https://www.douban.com/group/search?group=338839&cat=1013&q=中山公园'

const getTopic = async () => {
    const h = await headers()
    const res = await axios.get(url, { headers: h })
    const $ = cheerio.load(res.data)
    $('.pl').each((i, el) => {
        console.log($(el).find('a').attr('href'))
        console.log($(el).find('a').attr('title'))
        console.log($(el).find('.td-time').text())
    })
    // console.log(res.data)
}

const start = async () => {
    await getPoolList()
    await getTopic()
}

start()