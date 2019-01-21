# GitHub Spray

An utility to generate sprays for your GitHub commit graph history

![](https://i.imgur.com/Of8MjPj.gif)

## Installation

```sh
npm i -g github-spray
```

## Requirement

- git should be installed

## Usage

```sh
github-spray -t hello --push --origin https://github.com/XXX/yyy.git
```

```sh
github-spray --help
```

### Custom pattern

To use a custom pattern, create a javascript file like follow.  
*The numbers (1 to 9) will determine the darkness of the green.*
```js
module.exports = [
    '  999',
    ' 9   9',
    '9 9 9 9',
    '9     9',
    '9 999 9',
    ' 9   9',
    '  999'
];
```
```sh
github-spray -f path/to/pattern.js ...
```

### Custom start date
```sh
github-spray --startdate YYYY-MM-DD ...
```
*The date will be rounded to the nearest sunday.*  
By default the start date is the nearest sunday of the current date - 53 weeks.