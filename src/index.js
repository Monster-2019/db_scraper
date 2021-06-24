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
	// await getProxyList()
	// .then(res => {
	// proxyList = res
	// await clearDir()
	await getTopic()
	// })
}

// start()

schedule.scheduleJob('0 1 0 * * *', () => {
	start()
})