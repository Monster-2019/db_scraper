const mongoose = require('mongoose')
const getProxyList = require('./proxyList')
const schedule = require('node-schedule')
const getTopic = require('./getTopic')
const moment = require('moment')
const logger = require('./logger')

const url = 'mongodb://dbAdmin:dd123456@121.199.51.37:27017/douban'

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.once('open', _ => {
	console.log('Database connected:', url)
})
mongoose.connection.once('error', err => {
	console.error('connection error:', err)
})

const start = async () => {
	// await getProxyList()
	// .then(res => {
	// proxyList = res
	// await clearDir()
	await getTopic()
	// })
}

start()

// schedule.scheduleJob('0 1 0 * * *', () => {
// 	logger.info(`${moment().format('YYYY-MM-DD HH:mm:ss')}执行脚本`)
// 	start()
// })