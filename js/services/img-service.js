'use strict'

const STORAGE_IMGS_KEY = 'imgsDB'
let gImgs
let gSearchImgFilter
const imgKeyword = [
	['politics', 'man', 'person'],
	['animals', 'dogs', 'love'],
	['animals', 'dogs', 'love', 'baby', 'sleep'],
	['animals', 'cats', 'sleep'],
	['success', 'cute', 'baby'],
	['person', 'man'],
	['funny', 'baby', 'person'],
	['person', 'man'],
	['funny', 'person', 'baby'],
	['politics', 'man', 'person'],
	['love', 'man', 'person'],
	['person', 'man'],
	['person', 'man'],
	['person', 'man'],
	['person', 'man'],
	['person', 'man', 'funny'],
	['person', 'man', 'politics'],
	['person', 'man', 'toys'],
]

_createGallery()

function getImgs() {
	if (!gSearchImgFilter) return gImgs
	return gImgs.filter(img => img.keywords.some(word => word.startsWith(gSearchImgFilter)))
}

function getImgById(id) {
	let img = gImgs.find(img => img.id === id)
	if (!img) img = gSavedMemeDataURL.find(img => img.id === id)
	return img
}

function _saveImgsToStorage() {
	saveToStorage(STORAGE_IMGS_KEY, gImgs)
}

function _createGallery() {
	gImgs = loadFromStorage(STORAGE_IMGS_KEY) || []
	if (gImgs.length > 0) return

	for (let index = 1; index <= 18; index++) {
		gImgs.push({
			id: makeId(),
			imgSrc: `img/${index}.jpg`,
			keywords: imgKeyword[index - 1],
		})
	}
	_saveImgsToStorage()
}

function onImgUpload(ev) {
	loadImageFromInput(ev, renderImg)
}

function loadImageFromInput(ev, onImageReady) {
	const reader = new FileReader()

	reader.onload = function (event) {
		let img = new Image()
		img.src = event.target.result
		setImg(event.target.result)
		img.onload = () => onImageReady(img)
	}
	reader.readAsDataURL(ev.target.files[0])
}

function getKeywords() {
	return imgKeyword
}

function getUniqueKeywordList() {
	let keywords = getKeywords()
	keywords = keywords.flat()

	const filterdKeyWords = []
	keywords.forEach(keyword => {
		if (!filterdKeyWords.includes(keyword)) filterdKeyWords.push(keyword)
	})

	return filterdKeyWords
}
