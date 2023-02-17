'use strict'

let gSection = 'gallery'

function onInit() {
	renderGallery()
	window.addEventListener('resize', createKeywordMap)
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

	let maxFont = 30
	let minFont = 7

	const keywordContainer = document.querySelector('.keywords')
	keywordContainer.innerHTML = ''

	let string = ''
	for (const key in keywords) {
		let fontSize = minFont
		if (keywords[key] > 0) fontSize = (keywords[key] / maxNum) * (maxFont - minFont) + minFont

		string += `<span data-fontsize="${fontSize}px">${key}</span>`
	}

	keywordContainer.innerHTML = string
	document.querySelectorAll('span[data-fontsize]').forEach(elSpan => {
		elSpan.style.fontSize = elSpan.dataset.fontsize
	})

	while (keywordContainer.scrollWidth > keywordContainer.clientWidth) {
		document.querySelector('.btn-more-keywords')?.remove()
		keywordContainer.style.overflow = 'hidden'
		keywordContainer.removeChild(keywordContainer.lastChild)
		keywordContainer.innerHTML += `<button class="btn-more-keywords" onclick="onMoreKeywords()" > more </button>`
	}
}

function onMoreKeywords() {
	const keywordContainer = document.querySelector('.keywords')
	keywordContainer.style.width = 'fit-content'
	keywordContainer.style.overflow = 'visible'
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
	deleteLines()
	setRandomLines(2)
	switchToMemeEditor()
}

function switchToMemeEditor() {
	document.querySelector('li.active')?.classList.remove('active')
	document.body.classList.add('show-meme-editor')

	renderMeme()
}

function onChangeSection(elI) {
	if (document.body.classList.contains('show-meme-editor')) {
		document.body.classList.remove('show-meme-editor')
	}

	document.querySelector('li.active')?.classList.remove('active')
	elI.classList.add('active')
	gSection = elI.dataset.show

	renderGallery()
}

function onToggleHamburger() {
	document.body.classList.toggle('menu-open')
}

function onFlexible() {
	let randomNum
	//how many text lines, one or two
	randomNum = getRandomInt(1, 3)
	setRandomLines(randomNum)

	//get random img
	const imgs = getImgs()
	randomNum = getRandomInt(0, imgs.length)
	setImg(imgs[randomNum].id)

	switchToMemeEditor()
}
