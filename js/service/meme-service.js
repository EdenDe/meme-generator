'use strict'

const STORAGE_IMGS_KEY = 'imgsDB'
const STORAGE_MEMES_KEY = 'memesDB'
const memeStrings = [
	'110 tabs open',
	'not sure where the sound is coming from',
	'enough for today',
	'me after 10 lines of coding',
	'imagine a world where',
	'all sites are responsive',
	'back-end developer',
	'doing css',
	'a bug in my code?',
	"bitch, it's a feature",
	'this guy is a programmer',
	'see? nobody cares',
	'actually using a debugger',
	'why?!',
	'me trying to use github',
]

let gKeywordSearchCountMap = { funny: 4, person: 2, animals: 10 }
let gImgs
let gMeme = {
	selectedImgId: null,
	selectedLineIdx: -1,
	currentLineStartPos: null,
	lines: [],
}
let gMemes
let gSearchImgFilter

// setNewLine({
// 	txt: 'hey',
// 	size: 40,
// 	color: '#fff',
// 	strokeColor: 'grey',
// 	align: 'left',
// 	fontFamily: 'Impact',
// })
// setNewLine({
// 	txt: 'hello',
// 	size: 30,
// 	color: 'red',
// 	strokeColor: 'blue',
// 	align: 'right',
// 	fontFamily: 'Impact',
// })
_createGallery()
_createMemes()

function getKeywordSearchCountMap() {
	return gKeywordSearchCountMap
}

function getMemeStrings() {
	return memeStrings
}

function getImgs() {
	if (!gSearchImgFilter) return gImgs
	return gImgs.filter(img => img.keywords.some(word => word.startsWith(gSearchImgFilter)))
}

function getImgById(id) {
	return gImgs.find(img => img.id === id)
}

function getMemes() {
	return gMemes
}

function getMeme() {
	return gMeme
}

function getSelectedLine() {
	return gMeme.lines[gMeme.selectedLineIdx]
}

function setImg(imgId) {
	gMeme.selectedImgId = imgId
}

function setCurrentLineStartPos(startPos) {
	gMeme.currentLineStartPos = startPos
}

function getCurrentLineStartPos() {
	return gMeme.currentLineStartPos
}

function isTextClicked({ x, y }) {
	for (let index = 0; index < gMeme.lines.length; index++) {
		updateSelectedLineIdx(index)
		const { xStart, yStart, xEnd, yEnd } = getTextBlock()

		if (xStart < x && x < xEnd && yStart < y && y < yEnd) {
			return true
		}
	}
	return false
}

function deleteTxt() {
	gMeme.lines.splice(gMeme.selectedLineIdx, 1)
	updateSelectedLineIdx(gMeme.lines.length > 0 ? 0 : -1)
}

function setFocus() {
	gMeme.lines.forEach(line => (line.isFocus = false))
	updateLine('isFocus', true)
}

function updateSelectedLineIdx(selectedLine) {
	gMeme.selectedLineIdx = selectedLine
}

function updateLine(key, value) {
	const currentLine = gMeme.lines[gMeme.selectedLineIdx]
	if (!currentLine) return
	currentLine[key] = value
}

function setNewLine(line) {
	gMeme.selectedLineIdx++
	let y = 150

	if (gMeme.selectedLineIdx === 0) y = 80
	else if (gMeme.selectedLineIdx === 1) y = 250

	if (!line.fontFamily) line.fontFamily = 'Impact'
	line.pos = {
		x: 150,
		y,
	}
	line.isFocus = false
	line.isDrag = false

	gMeme.lines.push(line)
}

function setSearchFilter(value) {
	gSearchImgFilter = value
	const keywords = getUniqueKeywordList()
	if (!keywords.includes(value)) return

	if (!gKeywordSearchCountMap[value]) gKeywordSearchCountMap[value] = 0
	gKeywordSearchCountMap[value]++
}

function _saveImgsToStorage() {
	saveToStorage(STORAGE_IMGS_KEY, gImgs)
}

function _createGallery() {
	gImgs = loadFromStorage(STORAGE_IMGS_KEY) || []
	if (gImgs.length > 0) return
	const keywords = getKeywords()

	for (let index = 1; index <= 18; index++) {
		gImgs.push({
			id: makeId(),
			imgSrc: `/img/${index}.jpg`,
			keywords: keywords[index - 1],
		})
	}
	_saveImgsToStorage()
}

function moveTxt(dx, dy) {
	gMeme.lines[gMeme.selectedLineIdx].pos.x += dx
	gMeme.lines[gMeme.selectedLineIdx].pos.y += dy
}

function _createMemes() {
	gMemes = loadFromStorage(STORAGE_MEMES_KEY) || []
}

function saveMeme() {
	gMemes.push(gMeme)
	_saveMemesToStorage()
}

function _saveMemesToStorage() {
	saveToStorage(STORAGE_MEMES_KEY, gMemes)
}
