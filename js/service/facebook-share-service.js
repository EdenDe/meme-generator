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
	// Pack the image for delivery
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
