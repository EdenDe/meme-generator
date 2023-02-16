'use strict'

let gSection = 'gallery'

function onInit() {
	renderGallery()
}

function renderGallery() {
	let imgs
	if (gSection === 'gallery') imgs = getImgs()
	else imgs = getMemes()

	document.querySelector('.image-gallery').innerHTML = imgs
		.map(
			({ imgSrc, id }) =>
				`
    <div class="card" onclick="onImg('${id}')">
    <img class="img-card" src="${imgSrc}">
    </div>
    `
		)
		.join('')

	createDataList()
	createKeywordMap()
}

function createKeywordMap() {
	const keywords = getKeywordSearchCountMap()

	let maxNum = Math.max(...Object.values(keywords))
	if (maxNum === 0) maxNum = 1

	let maxFont = 42
	let minFont = 7

	let string = ''

	for (const key in keywords) {
		let fontSize = minFont
		if (keywords[key] > 0) fontSize = (keywords[key] / maxNum) * (maxFont - minFont) + minFont

		string += `<span data-fontsize="${fontSize}px">${key}</span>`
	}
	document.querySelector('.keywords').innerHTML = string
	document.querySelectorAll('span[data-fontsize]').forEach(elSpan => {
		elSpan.style.fontSize = elSpan.dataset.fontsize
	})
}

function createDataList() {
	const keywords = getUniqueKeywordList()
	document.querySelector('#keywords').innerHTML = keywords.map(keyword => `<option>${keyword}</option>`)
}

function onFilter(value) {
	setSearchFilter(value)
	renderGallery()
}

function onImg(imgId) {
	setImg(imgId)
	switchToMemeEditor()
}

function switchToMemeEditor() {
	document.querySelector('.meme-editor').classList.remove('hide')
	document.querySelector('.image-gallery').classList.add('hide')
	renderMeme()
}

function changeSection(elI) {
	document.querySelector('li.active').classList.remove('active')
	elI.classList.add('active')
	gSection = elI.innerText

	const elGallery = document.querySelector('.image-gallery')

	if (elGallery.classList.contains('hide')) {
		elGallery.classList.remove('hide')
		document.querySelector('.meme-editor').classList.add('hide')
	}
	renderGallery()
}

function onToggleHamburger() {
	document.body.classList.toggle('menu-open')
}

function onFlexible() {
	let randomNum
	//how many text lines, one or two
	randomNum = getRandomInt(1, 3)
	const lines = getMemeStrings()

	for (let index = 0; index < randomNum; index++) {
		setNewLine({
			txt: lines[getRandomInt(0, lines.length)],
			size: getRandomInt(15, 35),
			fontColor: getRandomColor(),
			strokeColor: getRandomColor(),
			align: 'center',
		})
	}

	//get random img
	const imgs = getImgs()
	randomNum = getRandomInt(0, imgs.length)
	setImg(imgs[randomNum].id)

	switchToMemeEditor()
}
