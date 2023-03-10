'use strict'

let gSection = 'gallery'

function onInit() {
	renderGallery()
	window.addEventListener('resize', renderKeywordMap)
}

function renderGallery() {
	let imgs = gSection === 'gallery' ? getImgs() : getMemes()

	document.querySelector('.image-gallery').innerHTML = imgs
		.map(
			img =>
				`
    <div class="card" onclick="onImg('${img.id}')">
    <img class="img-card" src="${gSection === 'gallery' ? img.imgSrc : img.memeDataURL}">
    </div>
    `
		)
		.join('')

	renderDataList()
	renderKeywordMap()
}

function renderKeywordMap() {
	const keywords = getKeywordSearchCountMap()
	const keywordBtn = document.querySelector('.btn-more-keywords')?.dataset.show || 'more'

	let maxNum = Math.max(...Object.values(keywords))
	if (maxNum === 0) maxNum = 1

	let maxFont = 30
	let minFont = 7

	const keywordContainer = document.querySelector('.keywords')
	keywordContainer.innerHTML = ''

	for (const key in keywords) {
		let fontSize = minFont
		if (keywords[key] > 0) fontSize = (keywords[key] / maxNum) * (maxFont - minFont) + minFont
		keywordContainer.innerHTML += `<span onclick="onFilter('${key}')" data-fontsize="${fontSize}px">${key}</span>`
	}

	document.querySelectorAll('span[data-fontsize]').forEach(elSpan => {
		elSpan.style.fontSize = elSpan.dataset.fontsize
	})

	while (keywordContainer.scrollWidth > keywordContainer.clientWidth) {
		if (keywordBtn === 'more') {
			document.querySelector('.btn-more-keywords')?.remove()
			keywordContainer.removeChild(keywordContainer.lastChild)
		}
		keywordContainer.innerHTML += `<button class="btn-more-keywords" data-show="${keywordBtn}" onclick="onMoreKeywords(this)">..${keywordBtn}</button>`
		if (keywordBtn === 'close') return
	}
}

function renderDataList() {
	const keywords = getUniqueKeywordList()
	document.querySelector('#keywords').innerHTML = keywords.map(keyword => `<option>${keyword}</option>`)
}

function onMoreKeywords(elBtn) {
	elBtn.dataset.show = elBtn.dataset.show === 'close' ? 'more' : 'close'
	renderKeywordMap()
}

function onFilter(keyword) {
	setSearchFilter(keyword)
	renderGallery()
}

function onImg(imgId) {
	setImg(imgId)
	switchToMemeEditor()
}

function onLogo() {
	const elLi = document.querySelector('[data-show="gallery"]')
	onChangeSection(elLi)
}

function onChangeSection(elLi) {
	if (document.body.classList.contains('show-meme-editor')) {
		document.body.classList.remove('show-meme-editor')
	}

	document.querySelector('li.active')?.classList.remove('active')
	elLi.classList.add('active')
	gSection = elLi.dataset.show

	renderGallery()
}

function switchToMemeEditor() {
	document.querySelector('li.active')?.classList.remove('active')
	document.body.classList.add('show-meme-editor')
	renderMeme()
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
