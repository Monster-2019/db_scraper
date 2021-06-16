const fs = require('fs')
const mongoose = require('mongoose')
const getProxyList = require('./proxyList')
const schedule = require('node-schedule')
const getTopic = require('./getTopic')

const url = 'mongodb://dbAdmin:dd123456@121.199.51.37:27017/douban'

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.once('open', _ => {
	console.log('Database connected:', url)
})
mongoose.connection.once('error', err => {
	console.error('connection error:', err)
})

const start = async () => {
	console.time('执行时间')
	// await getProxyList()
	// .then(res => {
	// proxyList = res
	// await clearDir()
	await getTopic()
	// })
	console.timeEnd('执行时间')
}

start()

// schedule.scheduleJob('0 10 * * * *', () => {
// 	start()
// })

// const clearDir = async () => {
// 	fs.readdirSync('topic').map((file) => {
// 		fs.unlink(`topic/${file}`, (err) => {
// 			if (err) {
// 				console.log(err)
// 			}
// 		})
// 	})
// 	console.log('delete ok')
// }

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