const fs = require('fs')
const cheerio = require('cheerio')
const moment = require('moment')
const path = require('path')

const result = []

const dealDir = (res) => {
	console.log(3, res)
	fs.readdir(path.join(__dirname, '../topic'), async function (err, files) {
		console.time('数据处理时间')
		if (err) {
			return console.log('目录不存在')
		}
		for (let fileName of files) {
			await new Promise((resolve) => {
				const html = fs.readFileSync(
					path.join(__dirname, `../topic/${fileName}`),
					'utf-8'
				)
				const $ = cheerio.load(html)
				const content = $('.topic-doc').text() // 帖子主要内容
				const time = $('.create-time').text() // 帖子创建时间
				const route = Array.from(new Set(content.match(/(1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20)号线/g))) //地铁线
				const subWay = Array.from(
					new Set(content.match(/娄山关|中山公园|江苏路/g))
				) //地铁站
				const community = Array.from(
					new Set(content.match(/\b[\u4e00-\u9fa5]+小区\b/g))
				)
				const room = Array.from(
					new Set(content.match(/\b(1|2|3|一|二|三)室\b/g))
				)
				const hall = Array.from(
					new Set(content.match(/\b(1|2|3|一|二|三)厅\b/g))
				)
				const bathroom = Array.from(
					new Set(content.match(/\b(1|2|3|一|二|三)卫\b/g))
				)
				const amount = Array.from(
					new Set(content.match(/\b\d{4}(元|\/月)?\b/g))
				).filter((item) => item !== time.slice(0, 4))
				const phone = Array.from(new Set(content.match(/\b1\d{10}\b/g)))
				const url =
					'https://www.douban.com/group/topic/' + fileName.match(/\d{9}/)

				result.push({
					time,
					route,
					subWay,
					community,
					layout: room + hall + bathroom,
					amount,
					phone,
					url,
				})
				resolve(1)
			})
		}
		let curDate = moment().format('YYYY-MM-DD')
		fs.unlink(`${curDate}.json`, (err) => {
			if (err) {
				console.log(err)
			}
		})
		fs.writeFile(`${curDate}.json`, JSON.stringify(result), (err) => {
			if (err) return console.log('出现错误')
			console.log('数据处理完成')
			console.timeEnd('数据处理时间')
		})
	})
}


module.exports = dealDir
// dealDir()