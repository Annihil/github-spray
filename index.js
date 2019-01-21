#!/usr/bin/env node

const pjson = require('./package.json');
const execSync = require('child_process').execSync;
const crypto = require('crypto');
const fs = require('fs');
const program = require('commander');
const moment = require('moment');
const term = require('terminal-kit').terminal;

const alphabet = require('./alphabet');
const secInDay = 86400, weekInYear = 53, dayInWeek = 7, title = 'github-spray';

program
    .version(pjson.version)
    .option('-s, --startdate [date]', 'Set the start date (rounded to week)')
    .option('-o, --origin [url]', 'Add origin url')
    .option('-p, --push', 'Push to origin')
    .option('-f, --file [path]', 'Specify a pattern file')
    .option('-t, --text [text]', 'Text to draw')
    .parse(process.argv);

if (process.argv.length < 3) {
    program.help();
}

if (program.push && !program.origin) {
    console.warn('option --origin required');
}

let startDate;

if (program.startdate) {
    startDate = moment(program.startdate);
    startDate.day(0);
} else {
    startDate = moment.utc();
    startDate.set({hour: 0, minute: 0, second: 0, millisecond: 0});
    startDate.subtract(weekInYear, 'week');
    startDate.day(7);
}

let graph;

if (program.file) {
    try {
        graph = require(program.file);
    } catch (e) {
        return console.error(e.message);
    }
} else if (program.text) {
    graph = new Array(dayInWeek).fill('');
    for (const l of program.text.toLowerCase()) {
        if (!(l in alphabet)) {
            console.warn(`'${l}' character not supported`);
            console.log('Charset: ' + Object.keys(alphabet).join(' '));
            return;
        }
        const letter = alphabet[l];
        for (let i = 0; i < letter.length; i++) {
            graph[i + 1] += letter[i] + ' ';
        }
    }
} else {
    console.warn('option --text or --file required');
}

let seconds = startDate.unix();
const folder = 'spray-' + crypto.randomBytes(6).toString('hex');
fs.mkdirSync(folder);
try {
    execSync(`git init ${folder}`);
    execSync(`touch ${folder}/readme.md`);
    execSync(`git -C ${folder} add readme.md`);
} catch (e) {
    return console.error(e.message);
}
term.windowTitle(title);
term.reset();

const readme = i => `Made with [${title}](https://github.com/Annihil/${title}#${i})`;

const I = Math.max(...graph.map(l => l.length));
const finish = I * dayInWeek;

const chars = ['░', '▒', '▓', '█'];

let commit = 0;
for (let i = 0; i < I; i++) {
    for (let j = 0; j < dayInWeek; j++) {
        const ij = (i * dayInWeek + (j + 1));
        const progress = ij / finish;
        term.moveTo(1, dayInWeek + 1);
        term.bar(progress, {barStyle: term.brightWhite, innerSize: I});
        const commits = graph[j].charAt(i);
        if (commits !== ' ') {
            const nb = parseInt(commits);
            for (let k = 0; k < nb; k++) {
                const ratio = nb / (chars.length - 1);
                term.moveTo(i + 1, j + 1, chars[Math.round(k / ratio)]);
                fs.writeFileSync(`./${folder}/readme.md`, readme(commit));
                try {
                    execSync(`git -C ${folder} commit --date="${seconds}" -am 'github-spray'`);
                } catch (e) {
                    return console.error(e.message);
                }
                commit++;
            }
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
    console.log(`Pushing to origin`);
    try {
        execSync(`git -C ${folder} push -u origin master`);
    } catch (e) {
        console.error(e.message);
    }
}
