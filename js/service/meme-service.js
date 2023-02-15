'use strict'

const STORAGE_IMGS_KEY = 'imgsDB'
const STORAGE_MEMES_KEY = 'memesDB'

const gKeywordSearchCountMap = {}
let gImgs
let gMeme = {
	selectedImgId: null,
	selectedLineIdx: -1,
	currentLineStartPos: null,
	lines: [],
}
let gMemes

setNewLine({
	txt: 'hey',
	size: 40,
	color: '#fff',
	align: 'center',
	fontFamily: 'Impact',
	pos: { x: 150, y: 100 },
	isFocus: false,
	isDrag: false,
})
setNewLine({
	txt: 'hello',
	size: 30,
	color: 'red',
	align: 'center',
	fontFamily: 'Impact',
	pos: { x: 150, y: 250 },
	isFocus: false,
	isDrag: false,
})
_createGallery()
_createMemes()

function getImgs() {
	return gImgs
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

//to check the text dimentions
function getTextBlock() {
	const { txt, pos, size, align, fontFamily } = getSelectedLine()
	gCtx.font = size + 'px ' + fontFamily
	let textWidth = gCtx.measureText(txt).width
	const ratio = textWidth / gCanvas.width + 1
	textWidth *= ratio

	let xStart = pos.x + textWidth
	if (align === 'right') xStart = pos.x - textWidth
	if (align === 'center') xStart = pos.x - textWidth / 2

	return {
		xStart: xStart - 10,
		yStart: pos.y - size,
		xEnd: xStart + textWidth + 10,
		yEnd: pos.y + 10,
	}
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
	gMeme.lines.push(line)
}

function updateKeyword(imgId, keyword) {
	const img = getImgById(imgId)
	if (!img) return

	img.keywords.push(keyword)
}

function _saveImgsToStorage() {
	saveToStorage(STORAGE_IMGS_KEY, gImgs)
}

function getImgById(id) {
	return gImgs.find(img => img.id === id)
}

function _createGallery() {
	gImgs = loadFromStorage(STORAGE_IMGS_KEY) || []
	if (gImgs.length > 0) return

	for (let index = 1; index <= 18; index++) {
		gImgs.push({
			id: makeId(),
			imgSrc: `/img/${index}.jpg`,
			keywords: [],
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
