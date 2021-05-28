import * as fetch from 'node-fetch'

let baseUrl = 'https://ip.jiangxianli.com/api/proxy_ips?page='
let list = []

let getProxyList = async (page) => {
	let res = await fetch(baseUrl + page)
		.then((res) => res.json())
		.then((res) => Promise.resolve(res.data))
	console.log(res)
	return res
	// .then((res) => res.json())
	// .then(async (res) => {
	// 	res.data.data.forEach((item) => {
	// 		// console.log(item)
	// 		if (item.country === '中国' && item.speed < 1000) {
	// 			list.push(item)
	// 		}
	// 	})
	// 	let total = res.data.total
	// 	// console.log(page, total)
	// 	if (page * 15 < total) {
	// 		await getProxyList(page + 1)
	// 	} else {
	// 		return list
	// 	}
	// })
}

let res = getProxyList(1)
console.log(res)
