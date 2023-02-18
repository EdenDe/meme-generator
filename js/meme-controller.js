'use strict'

let gCanvas
let gCtx
let gTask

function renderMeme() {
	gCanvas = document.querySelector('canvas')
	gCtx = gCanvas.getContext('2d')
	resizeCanvas()
	addListeners()
	updateSelectedLineIdx(-1)
	renderCanvas()
}

function addListeners() {
	gCanvas.addEventListener('mousedown', onDown)
	gCanvas.addEventListener('mousemove', onMove)
	gCanvas.addEventListener('mouseup', onUp)
	window.addEventListener('resize', renderMeme)
}

function renderCanvas() {
	gCtx.rect(0, 0, gCanvas.width, gCanvas.height)
	renderImgFromlocal()
}

function renderImgFromlocal() {
	const { selectedImgId } = getMeme()
	const { imgSrc } = getImgById(selectedImgId)
	const img = new Image()
	img.src = imgSrc
	img.onload = () => {
		gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
		renderTxt()
		if (!gTask) return
		if (gTask === 'download') {
			downloadMeme()
		} else if (gTask === 'save') {
			saveImgMeme()
		}
		gTask = null
	}
}

function renderTxt() {
	const { lines } = getMeme()
	lines.forEach(line => {
		drawText(line)
	})
}

function drawText({ txt, size, fontColor, strokeColor, pos, align, fontFamily }) {
	gCtx.beginPath()
	gCtx.fillStyle = fontColor
	gCtx.strokeStyle = strokeColor
	gCtx.font = `${size}px ${fontFamily}`
	gCtx.textAlign = align

	gCtx.fillText(txt, pos.x, pos.y)
	gCtx.strokeText(txt, pos.x, pos.y)

	renderFocusText()
}

function renderFocusText() {
	const { selectedLineIdx } = getMeme()
	if (selectedLineIdx === -1) return
	updateEditorValues()

	const { xStart, yStart, xEnd, yEnd } = getTextBlock()
	gCtx.beginPath()
	gCtx.fillStyle = 'rgba(225,225,225,0.2)'
	gCtx.fillRect(xStart - 10, yStart, xEnd - xStart + 20, yEnd - yStart + 10)
}

function updateEditorValues() {
	const { txt, fontColor, fontFamily, strokeColor, align } = getSelectedLine()
	document.querySelector('input[name="meme-txt"]').value = txt
	document.querySelector('.label-text-color').style.color = fontColor
	document.querySelector('.label-stroke-color').style.color = strokeColor
	document.querySelector('.btn-align-active').classList.remove('btn-align-active')
	document.querySelector(`.align-${align}`).classList.add('btn-align-active')
	document.querySelector('select').value = fontFamily
}

function onAddtxt() {
	const txt = document.querySelector('input[name="meme-txt"]').value
	const fontColor = document.querySelector('input[name="txt-color"]').value
	const colorS = document.querySelector('input[name="stroke-color"]').value
	const align = document.querySelector('.btn-align-active').dataset.align
	const fontFamily = document.querySelector('select').value

	setNewLine({ txt, size: 20, fontFamily, fontColor, colorS, align })
	renderTxt()
}

function onChangeAlign(elBtn) {
	document.querySelector('.btn-align-active').classList.remove('btn-align-active')
	elBtn.classList.add('btn-align-active')
	updateLine('align', elBtn.dataset.align)
	renderCanvas()
}

function onChangeSize(change) {
	const { size } = getSelectedLine()
	updateLine('size', size + change)
	renderCanvas()
}

function onPickColor(elColor) {
	updateLine('fontColor', elColor.value)
	document.querySelector('.label-text-color').style.color = elColor.value
	renderCanvas()
}

function onToggleTxt() {
	const { selectedLineIdx, lines } = getMeme()
	if (selectedLineIdx + 1 === lines.length) updateSelectedLineIdx(0)
	else updateSelectedLineIdx(selectedLineIdx + 1)

	renderCanvas()
}

function onChangeTxt(txt) {
	updateLine('txt', txt)
	renderCanvas()
}

function onDown(ev) {
	const pos = getEvPos(ev)

	if (!isTextClicked(pos)) return

	updateLine('isDrag', true)
	renderCanvas()

	setCurrentLineStartPos(pos)
	document.body.style.cursor = 'grabbing'
}

function onMove(ev) {
	const meme = getMeme()
	if (meme.selectedLineIdx === -1) return

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
	gTask = 'save'
	updateSelectedLineIdx(-1)
	renderCanvas()
}

function saveImgMeme() {
	const imgContent = gCanvas.toDataURL('image/jpeg')
	saveMeme(imgContent)
}

function onChangeFont(elSelect) {
	updateLine('fontFamily', elSelect.value)
	renderCanvas()
}

function onPickStokeColor(elColor) {
	updateLine('strokeColor', elColor.value)
	document.querySelector('.label-stroke-color').style.color = elColor.value
	renderCanvas()
}

function isTextClicked({ x, y }) {
	const { lines } = getMeme()
	for (let index = 0; index < lines.length; index++) {
		updateSelectedLineIdx(index)
		const { xStart, yStart, xEnd, yEnd } = getTextBlock()

		if (xStart < x && x < xEnd && yStart < y && y < yEnd) {
			return true
		}
	}
	return false
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

function onDownloadMeme() {
	gTask = 'download'
	updateSelectedLineIdx(-1)
	renderCanvas()
}

function downloadMeme() {
	const elLink = document.querySelector('.a-download')
	const imgContent = gCanvas.toDataURL('image/jpeg')
	elLink.href = imgContent
}

window.addEventListener('click', onClickPage)

function onClickPage(event) {
	if (event.target.classList.contains('meme-editor')) {
		document.body.style.cursor = 'default'
		updateSelectedLineIdx(-1)
		renderCanvas()
	}
}

function onFacebookShare() {
	const imgDataUrl = gCanvas.toDataURL('image/jpeg') // Gets the canvas content as an image format
	function onSuccess(uploadedImgUrl) {
		const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
		console.log(encodedUploadedImgUrl)
		window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}`)
	}
	doUploadImg(imgDataUrl, onSuccess)
}

function doUploadImg(imgDataUrl, onSuccess) {
	const formData = new FormData()
	formData.append('img', imgDataUrl)

	const XHR = new XMLHttpRequest()
	XHR.onreadystatechange = () => {
		if (XHR.readyState !== XMLHttpRequest.DONE) return

		if (XHR.status !== 200) return console.error('Error uploading image')
		const { responseText: url } = XHR

		console.log('Got back live url:', url)
		onSuccess(url)
	}
	XHR.onerror = (req, ev) => {
		console.error('Error connecting to server with request:', req, '\nGot response data:', ev)
	}
	XHR.open('POST', '//ca-upload.com/here/upload.php')
	XHR.send(formData)
}
