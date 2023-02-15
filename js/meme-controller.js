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
	gCanvas.addEventListener('mousedown', onDown)
	gCanvas.addEventListener('mousemove', onMove)
	gCanvas.addEventListener('mouseup', onUp)

	window.addEventListener('resize', () => onInit())
}

function renderCanvas() {
	gCtx.rect(0, 0, gCanvas.width, gCanvas.height)
	renderImgFromlocal()
}

function renderTxt() {
	const { lines } = getMeme()

	lines.forEach((line, index) => {
		drawText(line)
		if (line.isFocus) {
			markText(index)
		}
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
	renderTxt()
}

function drawText({ txt, size, color, pos, align, isFocus }) {
	gCtx.fillStyle = color
	gCtx.font = `${size}px arial`
	gCtx.textAlign = align

	gCtx.fillText(txt, pos.x, pos.y)
}

function onChangeAlign(elBtn) {
	document.querySelector('.btn-align-active').classList.remove('btn-align-active')
	elBtn.classList.add('btn-align-active')
	updateLine('align', elBtn.dataset.align)
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
	const newSelectedIdx = selectedLineIdx + diff
	if (newSelectedIdx < 0 || newSelectedIdx >= lines.length) return
	updateSelectedLineIdx(newSelectedIdx)
	updateLine('isFocus', true)
	renderCanvas()
}

function markText(selectedId) {
	const { xStart, yStart, xEnd, yEnd } = getTextBlock(selectedId)
	gCtx.strokeStyle = 'white'
	gCtx.strokeRect(xStart, yStart, xEnd - xStart, yEnd - yStart)
}

function onDown(ev) {
	const pos = getEvPos(ev)

	if (!isTextClicked(pos)) return

	updateLine('isDrag', true)
	setFocus()
	renderCanvas()

	setCurrentLineStartPos(pos)
	document.body.style.cursor = 'grabbing'
}

function onMove(ev) {
	const { isDrag } = getSelectedLine()
	if (!isDrag) return

	const pos = getEvPos(ev)
	const startPos = getCurrentLineStartPos()

	if (!startPos) return

	const dx = pos.x - startPos.x
	const dy = pos.y - startPos.y

	moveTxt(dx, dy)
	setCurrentLineStartPos(pos)
	renderCanvas()
}

function onUp() {
	updateLine('isDrag', false)
	document.body.style.cursor = 'grab'
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
