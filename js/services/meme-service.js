'use strict'

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

let gKeywordSearchCountMap = { funny: 4, person: 2, animals: 10, baby: 3, cats: 1, sleep: 12 }
let gSavedMemeDataURL

let gMeme = {
	selectedImgId: null,
	selectedLineIdx: -1,
	currentLineStartPos: null,
	lines: [],
}

_createMemes()

function getKeywordSearchCountMap() {
	return gKeywordSearchCountMap
}

function getMemeStrings() {
	return memeStrings
}

function getCurrentLineStartPos() {
	return gMeme.currentLineStartPos
}

function getMemes() {
	return gSavedMemeDataURL
}

function getMeme() {
	return gMeme
}

function getSelectedLine() {
	return gMeme.lines[gMeme.selectedLineIdx]
}

function setSaveMemeLines() {
	deleteLines()
	const meme = gSavedMemeDataURL.find(meme => meme.id === gMeme.selectedImgId)
	meme.lines.forEach(line => {
		setNewLine(line)
	})
}

function setRandomLines(howMany = 2) {
	const lines = getMemeStrings()
	for (let index = 0; index < howMany; index++) {
		setNewLine({
			txt: lines[getRandomInt(0, lines.length)],
			size: getRandomInt(15, 35),
			fontColor: getRandomColor(),
			strokeColor: getRandomColor(),
			align: 'center',
		})
	}
}

function setImg(imgId) {
	gMeme.selectedImgId = imgId
}

function setCurrentLineStartPos(startPos) {
	gMeme.currentLineStartPos = startPos
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

function deleteLines() {
	gMeme.selectedLineIdx = -1
	gMeme.lines = []
	gMeme.currentLineStartPos = null
}

function deleteTxt() {
	gMeme.lines.splice(gMeme.selectedLineIdx, 1)
	updateSelectedLineIdx(gMeme.lines.length > 0 ? 0 : -1)
}

function updateLine(key, value) {
	const currentLine = gMeme.lines[gMeme.selectedLineIdx]
	if (!currentLine) return
	currentLine[key] = value
}

function updateSelectedLineIdx(selectedLine) {
	gMeme.selectedLineIdx = selectedLine
}

function isMemeAlreadySaved() {
	return gSavedMemeDataURL.some(meme => meme.id === gMeme.selectedImgId)
}

function saveMeme(memeDataURL) {
	let memeIdx = gSavedMemeDataURL.findIndex(meme => meme.id === gMeme.selectedImgId)
	const { imgSrc } = getImgById(gMeme.selectedImgId)
	let isExists = memeIdx !== -1

	if (!isExists) {
		memeIdx = gSavedMemeDataURL.length
	}

	gSavedMemeDataURL[memeIdx] = {
		id: isExists ? gMeme.selectedImgId : makeId(),
		imgSrc,
		memeDataURL,
		lines: gMeme.lines,
	}
	_saveMemesToStorage()
}

function moveTxt(dx, dy) {
	gMeme.lines[gMeme.selectedLineIdx].pos.x += dx
	gMeme.lines[gMeme.selectedLineIdx].pos.y += dy
}

function _createMemes() {
	gSavedMemeDataURL = loadFromStorage(STORAGE_MEMES_KEY) || []
}

function _saveMemesToStorage() {
	saveToStorage(STORAGE_MEMES_KEY, gSavedMemeDataURL)
}
