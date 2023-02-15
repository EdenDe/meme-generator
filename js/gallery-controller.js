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
}

function onImg(imgId) {
	document.querySelector('.meme-editor').classList.remove('hide')
	document.querySelector('.image-gallery').classList.add('hide')
	setImg(imgId)
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
