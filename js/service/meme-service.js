'use strict'

const STORAGE_IMGS_KEY = 'imgsDB'
const gKeywordSearchCountMap = {}
let gImgs
let gMeme = {
	selectedImgId: null,
	selectedLineIdx: -1,
	lines: [],
}

_createGallery()

function getImgs() {
	return gImgs
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

function updateSelectedLineIdx(selectedLine) {
	gMeme.selectedLineIdx = selectedLine
}

function updateLine(key, value) {
	const currentLine = gMeme.lines[gMeme.selectedLineIdx]
	if (!currentLine) return
	currentLine[key] = value
}

function setNewLine(line) {
	debugger
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
	gMeme[gMeme.selectedLineIdx].pos.x += dx
	gMeme[gMeme.selectedLineIdx].pos.y += dy
}
