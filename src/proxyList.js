const fetch = require('node-fetch')

let baseUrl = 'https://ip.jiangxianli.com/api/proxy_ips?page='

module.exports = async () => {
	let total = 1
	let arr = []
	let page = 1
	while (total !== 0) {
		let res = await fetch(baseUrl + page)
			.then((res) => res.json())
			.then((res) => Promise.resolve(res.data))
		let data = res.data
		total = data.length
		arr.push(...data.filter(item => item.country === '中国' && item.speed < 1000))
		page++
	}
	return arr
}