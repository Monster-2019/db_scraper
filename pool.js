import axios from 'axios'
import cheerio from 'cheerio'

const headers = {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
}

let proxyList = []

const getProxy = () => {
    const ip = Math.floor(Math.random() * proxyList.length - 1)
    const [host, port] = ip.split(':')
    return { host, port }
}


// const validIp = async (ip) => {
//     const [host, port] = ip.split(':')
//     // console.log(host, port)
//     try {
//         const res = await axios.get('http://ip-api.com/json', {
//             proxy: {
//                 host,
//                 port
//             },
//             timeout: 5000
//         })
//         const { query } = res.data
//         // console.log(111, query, host, typeof query, typeof host)
//         if (query === host) return query
//         return ''
//     } catch (err) {
//         return ''
//         // console.log(`无效IP：${host}`)
//     }
// }

const getPool = async () => {
    // const res = await axios.get('https://www.proxy-list.download/HTTP', {
    //     headers: headers
    // })
    // const html = res.data
    // const $ = cheerio.load(html)
    // const list = $('tbody#tabli').find('tr')
    // let arr = []
    // list.each(function (index, el) {
    //     let ip = ''
    //     let port = ''
    //     $(this).find('td').slice(0, 2).each(function (i, e) {
    //         if (i === 0) ip = $(e).text().trim()
    //         if (i === 1) port = $(e).text().trim()
    //     })
    //     arr.push(`${ip}:${port}`)
    // })
    // arr.filter(async ip => {
    //     const valid = await validIp(ip)
    //     console.log(1, valid)
    // })

    const res = await axios.get('https://www.proxy-list.download/api/v1/get?type=https&country=CN', {
        headers
    })
    const list = res.data.split('\r\n')
    return list.slice(0, list.length - 1)
}

(async function () {
    const list = await getPool()
    console.log(list)
})()