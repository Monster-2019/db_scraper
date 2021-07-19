const schedule = require('node-schedule')
const getTopic = require('./getTopic')
const logger = require('./logger')
const moment = require('moment')

const start = async () => {
	// await getProxyList()
	// .then(res => {
	// proxyList = res
	// await clearDir()
	await getTopic()
	// })
}

console.log(`${moment().format('YYYY-MM-DD HH:mm:ss')}执行脚本`)
logger.info(`${moment().format('YYYY-MM-DD HH:mm:ss')}执行脚本`)
start()

let rule = new schedule.RecurrenceRule();
rule.hour = 6;
rule.minute = 0;
rule.second = 0;

schedule.scheduleJob(rule, () => {
	console.log(`${moment().format('YYYY-MM-DD HH:mm:ss')}执行脚本`)
	logger.info(`${moment().format('YYYY-MM-DD HH:mm:ss')}执行脚本`)
	start()
})