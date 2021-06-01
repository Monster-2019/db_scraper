const schedule = require('node-schedule');

// 启动任务
let job = schedule.scheduleJob(rule, () => {
  console.log(new Date());
});