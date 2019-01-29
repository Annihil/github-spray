# GitHub Spray
[![npm](https://img.shields.io/npm/v/github-spray.svg?style=flat-square)](https://www.npmjs.com/package/github-spray)
[![license](https://img.shields.io/github/license/annihil/github-spray.svg?style=flat-square)]()

<p align="center">
	<img src="https://i.imgur.com/nPZyGNo.gif" height="200" width="200" alt="GitHub Spray logo"/>
</p>

A CLI to generate sprays for your GitHub commit graph history

![](https://i.imgur.com/Of8MjPj.gif)

## Installation

```sh
npm i -g github-spray
```

## Requirement

- Git
- Recent NodeJS

## Usage

1. Create a new GitHub repository and copy its url
2. 
```sh
github-spray -t <text> --push --origin <github_repository_url>
```
(example)
```sh
github-spray -t hello --push --origin https://github.com/John/hello.git
```

```sh
github-spray --help
```

### Fonts
```sh
github-spray -t <text> --font <font_name>
```
(example)
```sh
github-spray -t Wald0 --font portable_vengeance
```
![](https://i.imgur.com/iF2xwwU.png)  
```sh
github-spray -t Mario? --font mario
```
![](https://i.imgur.com/0P8Dmrn.png)  
#### led7
![](https://i.imgur.com/O5EW9IV.png)  
![](https://i.imgur.com/yUaeoGL.png)  
![](https://i.imgur.com/mvtC6sE.png)  
![](https://i.imgur.com/A76n04M.gif)  
*Fonts available are in the fonts folder*

### Invert colors
![](https://i.imgur.com/328VRba.png)
```sh
github-spray -t hello -i
```

### Custom pattern

To use a custom pattern, create a JSON file like follow.  
*The numbers (1 to 4) will determine the green's darkness.*
```json
[
    "  333  ",
    " 3   3 ",
    "3 2 2 3",
    "3     3",
    "3 222 3",
    " 3   3 ",
    "  333  "
]
```
![](https://i.imgur.com/sZDSnFH.png)
```sh
github-spray -f <path/to/pattern.json> ...
```

**You can use [GitHub Spray Generator](https://annihil.github.io/github-spray-generator/) to graphically draw patterns**

### Custom start date
```sh
github-spray --startdate YYYY-MM-DD ...
```
*The date will be rounded to the nearest sunday.*  
By default the start date is the nearest sunday of the current date - 53 weeks.

### Multiply every commits
```sh
github-spray -m <factor> ...
```
Multiply each commits by the given factor

## Known issues
- Before Monday 10 March 2014 there could be a [shift due to the timezone](https://github.blog/2014-03-07-timezone-aware-contribution-graphs/)
