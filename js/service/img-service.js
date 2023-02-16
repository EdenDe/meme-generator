'use strict'

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
