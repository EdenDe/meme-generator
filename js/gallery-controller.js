'use strict'

function onInit() {
	renderGallery()
}

function renderGallery() {
	const imgs = getImgs()

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
