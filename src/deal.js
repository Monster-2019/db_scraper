import * as fs from 'fs'
import * as cheerio from 'cheerio'
import * as moment from 'moment'
import * as path from 'path'

const result = []

const dealDir = () => {
	fs.readdir(path.join(__dirname, '../topic'), async function (err, files) {
		console.time('执行时间')
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
				const content = $('.topic-doc').text()

				const time = $('.create-time').text()
				const route = Array.from(new Set(content.match(/(2|3|4)号线/g)))
				const subWay = Array.from(
					new Set(content.match(/娄山关|中山公园|江苏路/g))
				)
				const community = Array.from(
					new Set(content.match(/[\u4e00-\u9fa5]+小区/g))
				)
				const addres = Array.from(
					new Set(content.match(/[\u4e00-\u9fa5]+路\d+号\d+号楼/g))
				)
				const amount = Array.from(
					new Set(content.match(/\b\d{4}(元)?\b/g))
				).filter((item) => item !== time.slice(0, 4))
				const phone = Array.from(new Set(content.match(/\b1\d{10}\b/g)))
				const url =
					'https://www.douban.com/group/topic/' + fileName.match(/\d{9}/)

				result.push({
					time,
					route,
					subWay,
					community,
					addres,
					amount,
					phone,
					url,
				})
				resolve(1)
			})
		}
		let curDate = moment().format('YYYY-MM-DD')
		fs.writeFile(`${curDate}.json`, JSON.stringify(result), (err) => {
			if (err) return console.log('出现错误')
			console.log('数据处理完成')
			console.timeEnd('执行时间')
		})
	})
}

dealDir()
