import * as fetch from 'node-fetch'
import * as cheerio from 'cheerio'
import * as fs from 'fs'
import * as moment from 'moment'
import * as winston from 'winston'

const cookie =
	'bid=r6AMO-KhxSo; ll="108296"; _vwo_uuid_v2=D3572A8AB59251553189B8277AD441639|0e2829af1c231bedd23d9bdb31dea0f7; douban-fav-remind=1; viewed="25786138"; gr_user_id=033c8361-47a4-4570-8375-7b77e2ea286e; push_noty_num=0; push_doumail_num=0; dbcl2="205676588:3RTsWFhd5aw"; __utmv=30149280.20567; ck=OjhJ; __utmc=30149280; __utmc=223695111; ct=y; _pk_ref.100001.4cf6=["","",1621584160,"https://www.google.com.hk/"]; _pk_id.100001.4cf6=4ba64db73377db49.1619692183.5.1621584160.1621576992.; _pk_ses.100001.4cf6=*; __utma=30149280.1388461121.1619692184.1621576980.1621584160.18; __utmb=30149280.0.10.1621584160; __utmz=30149280.1621584160.18.13.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not provided); __utma=223695111.348488458.1619692184.1621576980.1621584160.5; __utmb=223695111.0.10.1621584160; __utmz=223695111.1621584160.5.5.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not provided)'

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
	'https://www.douban.com/group/zufan/',
	'https://www.douban.com/group/changningzufan/',
	// 'https://www.douban.com/group/467799/',
	// 'https://www.douban.com/group/shanghaizufang/',
]
const currentDate = moment().format('MM-DD')
let topicList = []
console.time('执行时间')

const getTopicLink = (html) => {
	let end = false
	const $ = cheerio.load(html)
	const topic = $('td[class=time]', '.olt')
		.filter((i, el) => {
			// console.log($(el).text())
			let today = $(el).text().indexOf(currentDate) === 0
			// console.log(today)
			if (!today) end = true
			return today
		})
		.map((i, el) => {
			return $(el).prevAll('.title').children('a').attr('href')
		})
		.get()

	topicList.push(...topic)

	return end
}

const crawlTopic = async (urlList) => {
	for (let url of urlList) {
		const response = await fetch(url, options)
		const html = await response.text()

		let fileName = 'topic' + url.match(/\d{9}/)[0] + '.html'

		fs.writeFile(`topic/${fileName}`, html, function (err) {
			if (!err) {
				console.log(`文件${fileName}保存成功!`)
			} else {
				console.log(err)
			}
		})

		let s = Math.round(Math.random() * (4 - 2)) + 2
		console.log(`等待${s}秒后继续`)
		await new Promise((r) => setTimeout(r, s * 100))
	}
	console.timeEnd('执行时间')
}

const crawl = async (url, start) => {
	let api = url + 'discussion?start='
	const response = await fetch(api + start, options)
	const html = await response.text()
	logger.info(`${api + start}完成`)

	let isEnd = getTopicLink(html)
	if (!isEnd) {
		let s = Math.round(Math.random() * (4 - 2)) + 2
		console.log(`等待${s}秒后继续`)
		await new Promise((r) => setTimeout(r, s * 100))
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
		console.log(1)
	}
	console.log(`已获取当天所有数据`)
	crawlTopic(topicList)
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

clearDir()
crawlList()
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
