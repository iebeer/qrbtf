const svgHead = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n " +
    "<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 20010904//EN\" \"http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd\">\n"

export function isChrome() {
    return navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
}

export function saveSvg(filename, content) {
    let htmlContent = [svgHead + content]
    let bl = new Blob(htmlContent, {type: "image/svg+xml"})
    let a = document.createElement("a")
    filename = "QRcode_" + filename + ".svg"

    a.href = URL.createObjectURL(bl)
    a.download = filename
    a.hidden = true
    a.click()
}

export function saveImg(filename, content, width, height) {
    // Finish creating downloadable data
    filename = "QRcode_" + filename + ".jpg";
    const wrap = document.createElement('div');
    wrap.innerHTML = content;

    const $svg = wrap.firstChild
    const $clone = $svg.cloneNode(true);

    $clone.setAttribute('width', width);
    $clone.setAttribute('height', height);

    const svgData = new XMLSerializer().serializeToString($clone);

    let canvas = document.createElement('canvas');

    // Image will be scaled to the requested size.
    // var size = data.requestedSize;
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);

    let ctx = canvas.getContext('2d');

    let img = document.createElement('img');

    // New window for the image when it's loaded
    if(!isChrome()) window.open('', 'download');

    img.onload = () => {
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, width, height)
        ctx.drawImage(img, 0, 0, width, height);
        // `download` attr is not well supported
        // Will result in a download popup for chrome and the
        // image opening in a new tab for others.

        let a = document.createElement('a');
        a.setAttribute('href', canvas.toDataURL('image/jpeg', 0.8))
        a.setAttribute('target', 'download')
        a.setAttribute('download', filename);
        a.click();
    };

    img.setAttribute('src', 'data:image/svg+xml;base64,' + btoa(svgData));
}