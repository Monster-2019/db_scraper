const cheerio = require('cheerio')
const moment = require('moment')
const fetch = require('node-fetch')
const logger = require('./logger')

let validDataCount = 0
let invalidDataCount = 0
let repeatDataCount = 0

const dealDir = async (res) => {
	const len = res.length
	for (let html of res) {
		await new Promise(async (resolve) => {
			const $ = cheerio.load(html)
			const title = $('h1').text().replace(/\s/, '') // 帖子标题
			const time = moment($('.create-time').text()).format('x') // 帖子创建时间
			const content = $('.topic-doc').text() // 帖子主要内容
			const route = Array.from(new Set(content.match(/(1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|二)号线/g))) //地铁线
			// 浦东国际机场|海天三路|远东大道|凌空路|川沙|华夏东路|创新中路|唐镇|广兰路|金科路|张江高科|龙阳路|世纪公园|上海科技馆|世纪大道|东昌路|陆家嘴|南京东路|人民广场|南京西路|静安寺|江苏路|中山公园|娄山关路|威宁路|北新泾|淞虹路|虹桥2号航站楼|虹桥火车站|徐泾东 2号线
			const subWay = Array.from(
				new Set(content.match(/(浦东国际机场|海天三路|远东大道|凌空路|川沙|华夏东路|创新中路|唐镇|广兰路|金科路|张江高科|龙阳路|世纪公园|上海科技馆|世纪大道|东昌路|陆家嘴|南京东路|人民广场|南京西路|静安寺|江苏路|中山公园|娄山关路|威宁路|北新泾|淞虹路|虹桥2号航站楼|虹桥火车站|徐泾东)(路)?/g))
			) //地铁站
			const direction = Array.from(
				new Set(content.match(/朝(南|北|东|西)/g))
			)
			// const community = Array.from(
			// 	new Set(content.match(/\b[\u4e00-\u9fa5]+小区\b/g))
			// )
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
			const area = Array.from(new Set(content.match(/\d{2, 3}平(米)?/g)))
			const type = Array.from(new Set(content.match(/(合|整)租/)))
			const mode = Array.from(new Set(content.match(/押(1|2|3|一|二|两|三)付(1|2|3|一|二|两|三)/)))
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
				direction,
				// community,
				layout: room + hall + bathroom,
				sex: sex[0] || '',
				area: area[0] || '',
				type: type[0] || '',
				mode: mode[0] || '',
				amount: amount.map(num => Number(num)).filter(num => num !== 2021),
				phone: phone[0] || '',
				url,
			}

			if (params.amount.length >= 5) {
				invalidDataCount++
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
						// console.log(`文章${url}添加成功`)
						validDataCount++
						resolve()
						return 0
					} else {
						// console.log(res.msg)
						repeatDataCount++
						resolve()
						return 0
					}
				})
				.catch(err => {
					logger.error(err)
					invalidDataCount++
					resolve()
					return 0
				})
		})
	}

	logger.info(`共获取到 ${len} 条数，其中 ${validDataCount} 条有效数据， ${invalidDataCount} 条无效数据， ${repeatDataCount} 条重复数据`)

	return 0
}

module.exports = dealDir