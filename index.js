#!/usr/bin/env node

const execSync = require('child_process').execSync;
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const program = require('commander');
const moment = require('moment');
const term = require('terminal-kit').terminal;

const p = require('./package.json'),
    dayInWeek = 7, chars = ['░', '▒', '▓', '█'],
    mapRange = (x, inMin, inMax, outMin, outMax) => (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin,
    readme = i => `[![](${p.badge})](${p.homepage}#${i})  \n[![](https://i.imgur.com/LhPXoTd.gif)](${p.homepage})`;
let alphabet = require('./alphabet');

program
    .version(p.version)
    .option('-s, --startdate [date]', 'Set the start date (rounded to week)')
    .option('-o, --origin [url]', 'Add origin url')
    .option('-p, --push', 'Push to origin')
    .option('-f, --file [absolute path]', 'Specify a pattern file')
    .option('-t, --text [text]', 'Text to draw')
    .option('--font [font]', 'Set the font')
    .option('-i, --invert', 'Invert the colors')
    .option('-m, --multiplier [n]', 'Multiply the number of commits by n', s => parseInt(s), 1)
    .option('--flipvertical', 'Flip vertically the spray')
    .option('--fliphorizontal', 'Flip horizontally the spray')
    .parse(process.argv);

if (process.argv.length < 3) {
    program.help();
}

if (program.push && !program.origin) {
    console.warn('Option --origin required');
}

if (program.font) {
    const fonts = fs.readdirSync(path.resolve(__dirname, 'fonts')).map(f => f.slice(0, -3));
    if (!fonts.includes(program.font)) {
        return console.warn(`'${program.font}' font not found!\nFonts available: ${fonts.join(' ')}`);
    }
    alphabet = require(`./fonts/${program.font}`);
}
alphabet[' '] = alphabet[' '] || new Array(dayInWeek).fill(' ');

let startDate, pattern;

if (program.startdate) {
    startDate = moment(program.startdate);
    startDate.day(0);
} else {
    startDate = moment.utc();
    startDate.subtract(53, 'week');
    startDate.day(7);
}
startDate.set({hour: 0, minute: 0, second: 0, millisecond: 0});

if (program.file) {
    pattern = JSON.parse(fs.readFileSync(program.file, 'utf8'));
} else if (program.text) {
    pattern = new Array(dayInWeek).fill(' ');
    for (const l of program.text) {
        if (!(l in alphabet)) {
            console.warn(`'${l}' character not supported`);
            return console.info('Charset: ' + Object.keys(alphabet).join(' '));
        }
        const letter = alphabet[l];
        for (let i = 0; i < letter.length; i++) {
            pattern[i] += letter[i] + ' ';
        }
    }
} else {
    return console.warn('Option --text or --file required');
}

pattern = pattern.map(l => l.replace(/ /g, 0));
let matrix = pattern.map(line => line.split('').map(c => parseInt(c)));

let seconds = startDate.unix();
const folder = 'spray-' + crypto.randomBytes(6).toString('hex'), file = 'readme.md';
fs.mkdirSync(folder);
execSync(`git init ${folder}`);
execSync(`touch ${folder}/${file}`);
execSync(`git -C ${folder} add ${file}`);
term.windowTitle(p.name);
term.reset();
term.hideCursor();

const maxWeeks = Math.max(...matrix.map(line => line.length)), area = maxWeeks * dayInWeek;

if (program.invert) {
    const max = Math.max(...matrix.flat());
    matrix = matrix.map(line => line.map(c => max - c));
}

if (program.fliphorizontal) matrix = matrix.map(line => line.reverse());
if (program.flipvertical) matrix = matrix.reverse();

let commits = 0;
for (let week = 0; week < maxWeeks; week++) {
    for (let day = 0; day < dayInWeek; day++) {
        const dayPassed = week * dayInWeek + day + 1;
        const progress = dayPassed / area;
        term.moveTo(1, dayInWeek + 1);
        term.bar(progress, {barStyle: term.brightWhite, innerSize: maxWeeks});
        const commitsPerDay = matrix[day][week] * program.multiplier;
        for (let commit = 0; commit < commitsPerDay; commit++) {
            let progress2 = mapRange(commit, 0, commitsPerDay - 1, 0, chars.length - 1);
            if (isNaN(progress2)) progress2 = chars.length - 1;
            term.moveTo(week + 1, day + 1, chars[progress2]);
            fs.writeFileSync(`./${folder}/${file}`, readme(commits));
            execSync(`git -C ${folder} commit --date="${seconds}" -am '${p.name}'`);
            commits++;
        }
        seconds += 24 * 60 * 60;
    }
}
term.moveTo(1, dayInWeek + 1);
term.eraseLine();
term.hideCursor(0);

console.info(`${folder} generated, starting date ${startDate.format('ddd MMM DD YYYY')}`);

if (program.origin) {
    console.info(`Adding origin ${program.origin}`);
    execSync(`git -C ${folder} remote add origin ${program.origin}`);
}

if (program.push) {
    process.stdout.write('Pushing ');
    execSync(`git -C ${folder} push -u origin master`);
}
