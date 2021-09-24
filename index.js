const schedule = require('node-schedule')
const getTopic = require('./src/getTopic')
const logger = require('./src/logger')
const moment = require('moment')

const start = () => {
	getTopic()
}

let rule = new schedule.RecurrenceRule();
rule.hour = 6;
rule.minute = 0;
rule.second = 0;

schedule.scheduleJob(rule, () => {
	logger.info(`${moment().format('YYYY-MM-DD HH:mm:ss')}执行脚本`)
	start()
})
logger.info(`${moment().format('YYYY-MM-DD HH:mm:ss')}执行脚本`)
start()