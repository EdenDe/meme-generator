'use strict'

function onImgUpload(ev) {
	loadImageFromInput(ev, renderImg)
}

// CallBack func will run on success load of the img
function loadImageFromInput(ev, onImageReady) {
	const reader = new FileReader()
	// After we read the file
	reader.onload = function (event) {
		let img = new Image() // Create a new html img element
		img.src = event.target.result // Set the img src to the img file we read
		setImg(event.target.result)
		// Run the callBack func, To render the img on the canvas
		// Can also do it this way:
		img.onload = () => onImageReady(img)
	}
	reader.readAsDataURL(ev.target.files[0]) // Read the file we picked
}

function getKeywords() {
	return imgKeyword
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
