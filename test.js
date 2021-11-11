const cliProgress = require('cli-progress');

// create new progress bar
const b1 = new cliProgress.SingleBar({
    format: 'Progress |' + '{bar}' + '| {percentage}% || {value}/{total}',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true
});

// initialize the bar - defining payload token "speed" with the default value "N/A"
b1.start(100, 0);

// update values
let n = 0
let func = async (val) => {
    b1.increment();
    b1.update(val);
    await new Promise((r) => setTimeout(r, 100))
}
let start = async () => {
    while (n <= 100) {
        await func(n++)
    }
}

start()

// stop the bar
// b1.stop();