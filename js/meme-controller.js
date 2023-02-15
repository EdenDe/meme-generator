'use strict'

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
let gCanvas
let gCtx

setImg('tB0Lb')
renderMeme()

function renderMeme() {
	gCanvas = document.querySelector('canvas')
	gCtx = gCanvas.getContext('2d')

	resizeCanvas()
	addListeners()
}

function addListeners() {
	window.addEventListener('resize', () => onInit())
}

function renderCanvas() {
	gCtx.rect(0, 0, gCanvas.width, gCanvas.height)
	renderImgFromlocal()
}

function renderTxt() {
	const { lines } = getMeme()

	lines.forEach((line, index) => {
		updateSelectedLineIdx(index)
		drawText()
	})
}

function renderImgFromlocal() {
	const { selectedImgId } = getMeme()
	const { imgSrc } = getImgById(selectedImgId)
	const img = new Image()
	img.src = imgSrc
	img.onload = () => {
		gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
		renderTxt()
	}
}

function onAddtxt() {
	const txt = document.querySelector('input[name="meme-txt"]').value
	const color = document.querySelector('input[name="txt-color"]').value
	const align = document.querySelector('.btn-align-active').dataset.align

	setNewLine({ txt, size: 20, color, align, pos: { x: 50, y: 250 } })
	drawText()
}

function drawText() {
	const { txt, size, color, pos, align } = getSelectedLine()

	gCtx.fillStyle = color
	gCtx.font = `${size}px arial`
	gCtx.textAlign = align

	gCtx.fillText(txt, pos.x, pos.y)
}

function onChangeAlign(elBtn) {
	document.querySelector('.btn-align-active').classList.remove('btn-align-active')
	elBtn.classList.add('btn-align-active')
	updateLine('align', elBtn.dataset.name)
	renderCanvas()
}

function onChangeSize(change) {
	const { size } = getSelectedLine()
	updateLine('size', size + change + 10)
	renderCanvas()
}

function onPickColor(color) {
	updateLine('color', color)
	renderCanvas()
}

function onToggleTxt(diff) {
	const { selectedLineIdx, lines } = getMeme()
	const newNum = selectedLineIdx + diff
	if (newNum < 0 || newNum >= lines.length) return
	updateSelectedLineIdx(newNum)
}

function moveTxt() {
	// const dx = pos.x - gStartPos.x
	// const dy = pos.y - gStartPos.y
	// moveTxt(dx, dy)
}
function onDeleteTxt() {}

function resizeCanvas() {
	const elContainer = document.querySelector('.canvas-container')
	gCanvas.width = elContainer.offsetWidth
	gCanvas.height = elContainer.offsetHeight

	renderCanvas()
}

function getEvPos(ev) {
	let pos = {
		x: ev.offsetX,
		y: ev.offsetY,
	}
	return pos
}
