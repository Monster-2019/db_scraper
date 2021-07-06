const schedule = require('node-schedule')
const getTopic = require('./getTopic')
const logger = require('./logger')

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
	logger.info(`${moment().format('YYYY-MM-DD HH:mm:ss')}执行脚本`)
	start()
})