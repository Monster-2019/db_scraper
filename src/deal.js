const fs = require('fs')
const cheerio = require('cheerio')
const moment = require('moment')
const path = require('path')

const result = []

const dealDir = async (res) => {
	// console.log(res[0])
	console.time('数据处理时间')
	for (let html of res) {
		await new Promise((resolve) => {
			const $ = cheerio.load(html)
			const content = $('.topic-doc').text() // 帖子主要内容
			const time = $('.create-time').text() // 帖子创建时间
			const route = Array.from(new Set(content.match(/(1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20)号线/g))) //地铁线
			const subWay = Array.from(
				new Set(content.match(/娄山关(路)?|中山公园|江苏路/g))
			) //地铁站
			const community = Array.from(
				new Set(content.match(/\b[\u4e00-\u9fa5]+小区\b/g))
			)
			const room = Array.from(
				new Set(content.match(/(一|二|两|三)(室|房)/g))
			)
			const hall = Array.from(
				new Set(content.match(/(一|二|两|三)厅/g))
			)
			const bathroom = Array.from(
				new Set(content.match(/(一|二|两|三)卫/g))
			)
			const sex = Array.from(new Set(content.match(/限(男|女)/g)))
			const amount = Array.from(
				new Set(content.match(/\b\d{4}(元|\/月)?\b/g))
			).filter((item) => item !== time.slice(0, 4))
			const phone = Array.from(new Set(content.match(/\b1\d{10}\b/g)))
			const url = Array.from(new Set($.html().match(/https:\/\/www.douban.com\/group\/topic\/\d{9}/g)))[0]
			const type = Array.from(new Set(content.match(/(合|整)租/g)))
			const mode = Array.from(new Set(content.match(/押(1|2|3|一|二|两|三)付(1|2|3|一|二|两|三)/g)))

			result.push({
				time,
				route,
				subWay,
				community,
				layout: room + hall + bathroom,
				sex,
				type,
				mode,
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
		// process.exit()
	})

	return 0
}


module.exports = dealDir
// dealDir()