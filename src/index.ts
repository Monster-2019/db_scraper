import * as fetch from 'node-fetch'
import * as cheerio from 'cheerio'
import * as fs from 'fs'
import * as moment from 'moment'

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

const baseUrl = 'https://www.douban.com/group/changningzufan/discussion?start='
const currentDate = moment().format('MM-DD')
let start = 0
let topicList = []

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
		}).map((i, el) => {
			return $(el).prevAll('.title').children('a').attr('href')
		}).get()

	topicList.push(...topic)

	return end
}

const crawl = async (url) => {
	const response = await fetch(url, options)
	const html = await response.text()

	let isEnd = getTopicLink(html)
	if (!isEnd) {
		let s = (Math.round(Math.random() * (10 - 5)) + 5)
		console.log(`等待${s}秒后继续`)
		await new Promise(r => setTimeout(r, s * 1000))
		start += 25
		crawl(`${baseUrl}${start}`)
	} else {
		console.log(topicList)
		console.log(`已获取当天所有数据`)
		return 0
	}
}

crawl(`${baseUrl}${start}`)

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