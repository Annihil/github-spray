#!/usr/bin/env node

const execSync = require('child_process').execSync;
const crypto = require('crypto');
const fs = require('fs');
const program = require('commander');
const moment = require('moment');
const term = require('terminal-kit').terminal;

const p = require('./package.json');
const alphabet = require('./alphabet');
const secInDay = 86400, weekInYear = 53, dayInWeek = 7;

program
    .version(p.version)
    .option('-s, --startdate [date]', 'Set the start date (rounded to week)')
    .option('-o, --origin [url]', 'Add origin url')
    .option('-p, --push', 'Push to origin')
    .option('-f, --file [absolute path]', 'Specify a pattern file')
    .option('-t, --text [text]', 'Text to draw')
    .option('-i, --invert', 'Invert the colors')
    .option('-m, --multiplier [n]', 'Multiply each digits by n', s => parseInt(s), 1)
    .parse(process.argv);

if (process.argv.length < 3) {
    program.help();
}

if (program.push && !program.origin) {
    console.warn('Option --origin required');
}

let startDate, graph;

if (program.startdate) {
    startDate = moment(program.startdate);
    startDate.day(0);
} else {
    startDate = moment.utc();
    startDate.subtract(weekInYear, 'week');
    startDate.day(7);
}
startDate.set({hour: 0, minute: 0, second: 0, millisecond: 0});

if (program.file) {
    try {
        graph = require(program.file);
    } catch (e) {
        return console.error(e.message);
    }
} else if (program.text) {
    graph = new Array(dayInWeek).fill(' ');
    for (const l of program.text.toLowerCase()) {
        if (!(l in alphabet)) {
            console.warn(`'${l}' character not supported`);
            return console.log('Charset: ' + Object.keys(alphabet).join(' '));
        }
        const letter = alphabet[l];
        for (let i = 0; i < letter.length; i++) {
            graph[i] += letter[i] + ' ';
        }
    }
} else {
    return console.warn('Option --text or --file required');
}

graph = graph.map(l => l.replace(/ /g, 0));

let seconds = startDate.unix();
const folder = 'spray-' + crypto.randomBytes(6).toString('hex'), file = 'readme.md';
fs.mkdirSync(folder);
try {
    execSync(`git init ${folder}`);
    execSync(`touch ${folder}/${file}`);
    execSync(`git -C ${folder} add ${file}`);
} catch (e) {
    return console.error(e.message);
}
term.windowTitle(p.name);
term.reset();

const readme = i => `Made with [${p.name}](${p.repository.url.slice(4, -4)}#${i})`;

const I = Math.max(...graph.map(l => l.length));
const finish = I * dayInWeek;

if (program.invert) {
    const max = Math.max(...graph.join('').split('').map(l => parseInt(l)));
    const tmp = [];
    for (const line of graph) {
        const reversedLine = [];
        for (let c of line) reversedLine.push(max - parseInt(c));
        tmp.push(reversedLine.join(''));
    }
    graph = tmp;
}

const chars = ['░', '▒', '▓', '█'];

let commit = 0;
for (let i = 0; i < I; i++) {
    for (let j = 0; j < dayInWeek; j++) {
        const ij = i * dayInWeek + j + 1;
        const progress = ij / finish;
        term.moveTo(1, dayInWeek + 1);
        term.bar(progress, {barStyle: term.brightWhite, innerSize: I});
        const n = parseInt(graph[j].charAt(i)) * program.multiplier;
        for (let k = 0; k < n; k++) {
            const ratio = n / chars.length;
            term.moveTo(i + 1, j + 1, chars[Math.floor(k / ratio)]);
            fs.writeFileSync(`./${folder}/${file}`, readme(commit));
            try {
                execSync(`git -C ${folder} commit --date="${seconds}" -am '${p.name}'`);
            } catch (e) {
                return console.error(e.message);
            }
            commit++;
        }
        seconds += secInDay;
    }
}
term.moveTo(1, dayInWeek + 1);
term.eraseLine();

console.log(`${folder} generated, starting date ${startDate.format('ddd MMM DD YYYY')}`);

if (program.origin) {
    console.log(`Adding origin ${program.origin}`);
    try {
        execSync(`git -C ${folder} remote add origin ${program.origin}`);
    } catch (e) {
        return console.error(e.message);
    }
}

if (program.push) {
    process.stdout.write('Pushing ');
    try {
        execSync(`git -C ${folder} push -u origin master`);
    } catch (e) {
        console.error(e.message);
    }
}
