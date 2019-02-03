# GitHub Spray
[![npm](https://img.shields.io/npm/v/github-spray.svg?style=flat-square)](https://www.npmjs.com/package/github-spray)
[![license](https://img.shields.io/github/license/annihil/github-spray.svg?style=flat-square)]()

<p align="center">
	<img src="https://i.imgur.com/nPZyGNo.gif" height="200" width="200" alt="GitHub Spray logo"/>
</p>

A CLI to generate sprays for your GitHub contribution history graph

![](https://i.imgur.com/Of8MjPj.gif)

## Installation

```sh
npm i -g github-spray
```

## Requirements

- Git
- Recent NodeJS

## Usage

1. Create a new GitHub repository and copy its url
2. 
```sh
github-spray -t <text> --multiplier <factor> --push --origin <github_repository_url>
```
(example)
```sh
github-spray -t hello --multiplier 10 --push --origin https://github.com/John/hello.git
```
_Depending on your number of contributions on the given period that you want to spray, you will need to multiply the number of commit per day by a specific factor (--multiplier) so that the spray become more relevant on your calendar heatmap_.  

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
![](https://i.imgur.com/rgSownU.png)
```sh
github-spray -t hello -i
```

### Flip vertical
![](https://i.imgur.com/xHNnAGb.png)
```sh
github-spray -t hello --flipvertical
```

### Flip horizontal
![](https://i.imgur.com/LMtZGAr.png)
```sh
github-spray -t hello --fliphorizontal
```

### Custom pattern

To use a custom pattern, create a JSON file like follow.  
*The numbers (1 to 4) will determine the number of commit per day, and thus the green's darkness.*
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

### Multiplier: scale colors
```sh
github-spray -m <factor> ...
```
Multiply the number of commit per day by the given factor to make the spray darker or brighter on your calendar heatmap. 

## Known issues
- Before Monday 10 March 2014 there could be a [shift due to the timezone](https://github.blog/2014-03-07-timezone-aware-contribution-graphs/)
