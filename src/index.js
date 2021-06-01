const fetch = require('node-fetch')
const cheerio = require('cheerio')
const fs = require('fs')
const moment = require('moment')
const winston = require('winston')
const HttpsProxyAgent = require('https-proxy-agent')
const getProxyList = require('./proxyList')
const dealData = require('./deal')
const schedule = require('node-schedule')

const cookie = 'll="108296"; bid=x9Ph-lhwpbY; push_noty_num=0; push_doumail_num=0; douban-fav-remind=1; _ga=GA1.2.632792398.1621586045; gr_user_id=8929f845-1b4b-4147-aca9-1d6bbca5dc1d; ct=y; dbcl2="238471146:VoHrDLUNdz0"; __utmv=30149280.23847; ck=0lcn; __utmc=30149280; __utmz=30149280.1622517596.15.10.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not provided); _pk_ref.100001.8cb4=["","",1622530377,"https://www.google.com/"]; _pk_ses.100001.8cb4=*; __utma=30149280.632792398.1621586045.1622527024.1622530377.18; __utmt=1; _pk_id.100001.8cb4=296170f7976dd179.1621586044.16.1622530910.1622527166.; __utmb=30149280.30.8.1622530883699'

const options = {
	headers: {
		'User-Agent':
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:87.0) Gecko/20100101 Firefox/87.0', // UA标识，装作浏览器
		Referer: 'https://www.douban.com',
		Cookie: cookie,
	},
}

const logger = winston.createLogger({
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: 'info.log' }),
	],
})

// const baseUrl = 'https://www.douban.com/group/changningzufan/discussion?start='
const groupUrls = [
	'https://www.douban.com/group/changningzufan/',
	'https://www.douban.com/group/zufan/',
	// 'https://www.douban.com/group/467799/',
	// 'https://www.douban.com/group/shanghaizufang/',
]
const currentYear = moment().format('YYYY')
const currentDate = moment().format('MM-DD')
const currentUnix = moment(moment().format('YYYY-MM-DD HH:mm')).format('x')
let topicList = []
let proxyList = []
let proxyIndex = 0
let curProxy = {}

const getTopicLink = (html) => {
	let end = false
	const $ = cheerio.load(html)
	const topic = $('td[class=time]', '.olt')
		.filter((i, el) => {
			console.log(currentUnix, moment(currentYear + '-' + $(el).text()).format('x'))
			let today = currentUnix - moment(currentYear + '-' + $(el).text()).format('x') < 3600000
			if (!today) end = true
			return today
		})
		.map((i, el) => {
			return $(el).prevAll('.title').children('a').attr('href')
		})
		.get()

	topic.forEach(url => {
		if (!topicList.includes(url)) topicList.push(url)
	})

	return end
}

const crawlTopic = async (urlList) => {
	for (let url of urlList) {
		// curProxy = proxyList[proxyIndex++]
		// if (proxyIndex === proxyList.length) proxyIndex = 0
		// let proxy = `${curProxy.protocol}://${curProxy.ip}:${curProxy.port}`
		// const proxyAgent = new HttpsProxyAgent(proxy);
		const response = await fetch(url, {
			...options,
			// agent: proxyAgent
		})
		if (!response.ok) return 0
		const html = await response.text()

		let fileName = 'topic' + url.match(/\d{9}/)[0] + '.html'

		fs.writeFile(`topic/${fileName}`, html, function (err) {
			if (!err) {
				console.log(`文件${fileName}保存成功!`)
			} else {
				console.log(err)
			}
		})

		let s = Math.round(Math.random() * (6 - 3)) + 3
		console.log(`等待${s}秒后继续`)
		await new Promise((r) => setTimeout(r, s * 1000))
	}
}

const crawl = async (url, start) => {
	let api = url + 'discussion?start='
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
	logger.info(`${api + start}完成`)

	let isEnd = getTopicLink(html)
	if (!isEnd) {
		let s = Math.round(Math.random() * (6 - 3)) + 3
		console.log(`等待${s}秒后继续`)
		await new Promise((r) => setTimeout(r, s * 1000))
		start += 25
		await crawl(url, start)
	} else {
		// console.log(topicList)
		return 0
	}
}

const crawlList = async () => {
	for (let url of groupUrls) {
		await crawl(url, 0)
	}
	console.log(`已获取当天所有数据`)
	crawlTopic(topicList)
		.then(() => {
			dealData()
		})
}

const clearDir = async () => {
	fs.readdirSync('topic').map((file) => {
		fs.unlink(`topic/${file}`, (err) => {
			if (err) {
				console.log(err)
			}
		})
	})
	console.log('delete ok')
}

const start = async () => {
	console.time('执行时间')
	await getProxyList()
		.then(res => {
			proxyList = res
			// console.log(proxyList)
			clearDir()
			crawlList()
		})
	console.timeEnd('执行时间')
}

// schedule.scheduleJob('* * 1 * * *', () => {
// 	start()
// })

start()

// crawlTopic(['https://www.douban.com/group/topic/227034203/'])

// fs.writeFile('index.html', html, function(err) {
// 	if (err) {
// 		console.log('1')
// 	} else {
// 		console.log('2')
// 	}
// })

// images.forEach(imgUrl => {
// 	fetch(imgUrl, options).then(res => {
// 		const filename = path.basename(imgUrl)
// 		const dest = fs.createWriteStream(`images/${filename}`)
// 		res.body.pipe(dest)
// 	})
// })
