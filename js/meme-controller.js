'use strict'

let gCanvas = document.querySelector('canvas')
let gCtx = gCanvas.getContext('2d')

function renderMeme() {
	// 	 gCanvas= document.querySelector('canvas')
	//  gCtx = gCanvas.getContext('2d')
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
	const colorS = document.querySelector('input[name="stroke-color"]').value
	const align = document.querySelector('.btn-align-active').dataset.align

	setNewLine({ txt, size: 20, color, colorS, align })
	renderTxt()
}

function drawText({ txt, size, color, pos, align, fontFamily }) {
	gCtx.fillStyle = color
	gCtx.font = `${size}px ${fontFamily}`
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
	gCtx.beginPath()
	gCtx.rect(xStart - 10, yStart, xEnd - xStart + 20, yEnd - yStart + 10)
	gCtx.fillStyle = 'rgba(225,225,225,0.2)'
	gCtx.strokeStyle = 'white'
	gCtx.stroke()
	gCtx.fill()
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

function onDeleteTxt() {
	deleteTxt()
	renderCanvas()
}

function onSaveMeme() {
	saveMeme()
}

function onChangeFont(elSelect) {
	updateLine('font', elSelect.value)
	renderCanvas()
}

function onPickStokeColor() {
	updateLine('strokeColor', elSelect.value)
	renderCanvas()
}

//to check the text dimentions
function getTextBlock() {
	const { txt, pos, size, align, fontFamily } = getSelectedLine()

	gCtx.font = size + 'px ' + fontFamily
	let textWidth = gCtx.measureText(txt).width
	let textHeight = gCtx.measureText(txt).fontBoundingBoxAscent + gCtx.measureText(txt).actualBoundingBoxDescent

	let xStart = pos.x
	if (align === 'right') xStart -= textWidth
	if (align === 'center') xStart -= textWidth / 2

	return {
		xStart: xStart,
		yStart: pos.y - textHeight,
		xEnd: xStart + textWidth,
		yEnd: pos.y,
	}
}

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

function renderImg(img) {
	gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
}

function downloadImg(elLink) {
	const imgContent = gCanvas.toDataURL('image/jpeg')
	elLink.href = imgContent
}
