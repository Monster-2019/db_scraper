const cheerio = require('cheerio')
const moment = require('moment')
const fetch = require('node-fetch')
const logger = require('./logger')

let successDataCount = 0
let repeatDataCount = 0
let rubbishDataCount = 0

const dealDir = async (res) => {
	const len = res.length
	for (let html of res) {
		await new Promise(async (resolve) => {
			const $ = cheerio.load(html)
			const title = $('h1').text().replace(/\s/, '') // 帖子标题
			const time = moment($('.create-time').text()).format('x') // 帖子创建时间
			const content = $('.topic-doc').text() // 帖子主要内容
			const route = Array.from(new Set(content.match(/(2|3|4|11|二)号线/g))) //地铁线
			const subWay = Array.from(
				new Set(content.match(/(江苏路|中山公园|娄山关路|威宁路|北新泾|淞虹路)(路)?/g))
			) //地铁站
			const sex = Array.from(new Set(content.match(/限(男|女)/g)))
			const amount = Array.from(
				new Set(content.match(/\b\d{4}(元|元\/月)?\b/g))
			).filter((item) => item !== time.slice(0, 4))
			const phone = Array.from(new Set(content.match(/\b1\d{10}\b/g)))
			const url = Array.from(new Set($.html().match(/https:\/\/www.douban.com\/group\/topic\/\d{9}/g)))[0]

			let params = {
				title,
				time,
				route,
				subWay,
				sex: sex[0] || '',
				amount: amount.map(num => Number(num)).filter(num => num !== 2021),
				phone: phone[0] || '',
				url,
			}

			if (params.amount.length >= 5) {
				rubbishDataCount++
				resolve()
				return 0
			}

			await fetch('https://dongxin.cool/api/topic', {
				method: 'post',
				body: JSON.stringify(params),
				headers: { 'Content-Type': 'application/json' }
			})
				.then(res => res.json())
				.then(res => {
					if (res.code === 1) {
						successDataCount++
						resolve()
						return 0
					} else {
						repeatDataCount++
						resolve()
						return 0
					}
				})
		})
	}
	
	logger.info(`共获取到 ${len} 条数，其中 ${successDataCount} 条成功数据，${repeatDataCount} 条重复数据， ${rubbishDataCount} 条垃圾数据。`)
	return 0
}

module.exports = dealDir