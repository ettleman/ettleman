// Load the fonts
WebFont.load({
    google: {
        families: ['Roboto:400,700', 'Open Sans:400,700', 'Lato:400,700']
    },
    active: function() {
        // Re-run applyText if needed
        if (window.textApplied) {
            applyText();
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    function createBatch() {
        const numImages = parseInt(document.getElementById('numImages').value) || 5;
        const width = parseInt(document.getElementById('imgWidth').value) || 100;
        const height = parseInt(document.getElementById('imgHeight').value) || 100;
        const bgColor = document.getElementById('bgColor').value || '#FFFFFF';
        const imageContainer = document.getElementById('imageContainer');
        imageContainer.innerHTML = '';

        for (let i = 0; i < numImages; i++) {
            const canvas = document.createElement('canvas');
            canvas.id = `canvas-${i}`;
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            imageContainer.appendChild(canvas);
        }
    }

});

document.getElementById('imageInput').addEventListener('change', function (event) {
    const files = event.target.files;
    processImages(files);
});

function processImages(files) {
    const imageContainer = document.getElementById('imageContainer');
    imageContainer.innerHTML = '';

    Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;
            img.onload = function () {
                // Create a canvas for each image
                const canvas = document.createElement('canvas');
                canvas.id = `canvas-${index}`;
                
                const scaleFactor = calculateScaleFactor(img.width, img.height, 200, 200);
                canvas.width = img.width * scaleFactor;
                canvas.height = img.height * scaleFactor;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                imageContainer.appendChild(canvas);
            };
        };
        reader.readAsDataURL(file);
    });
}

// ... existing functions ...

function applyText() {
    window.textApplied = true;
    const leftTextValues = parseText(document.getElementById('leftText').value);
    const centerTextValues = parseText(document.getElementById('centerText').value);
    const rightTextValues = parseText(document.getElementById('rightText').value);
    const canvases = document.querySelectorAll('#imageContainer canvas');
    const selectedFont = document.getElementById('fontSelector').value;
    const whattextSize = parseText(document.getElementById('textSize').value);
    const color = document.getElementById('textColor').value;
    const isBold = document.getElementById('boldCheckbox').checked;
    const isItalic = document.getElementById('italicCheckbox').checked;

    canvases.forEach((canvas, index) => {
        const ctx = canvas.getContext('2d');
        const fontSize = canvas.height * (whattextSize * 0.01);//canvas.height * 0.10; // 10% of canvas height
        let fontStyle = '';
        if (isBold) fontStyle += 'bold ';
        if (isItalic) fontStyle += 'italic ';
        ctx.font = `${fontStyle}${fontSize}px '${selectedFont}'`; // Note the single quotes around the font name
    ctx.fillStyle = color;

        // Left aligned text with 5% top margin
        ctx.textAlign = 'left';
        const topMargin = canvas.height * 0.02; // 5% of canvas height
        const textYPosition = topMargin + fontSize; // Position text at 5% margin plus font size
        ctx.fillText(getTextValue(leftTextValues, index), canvas.height * 0.02, textYPosition);

        // Apply left, center, and right text
        //ctx.fillText(getTextValue(leftTextValues, index), canvas.width * 0.05, canvas.height * 0.15);

        ctx.textAlign = 'center';
        ctx.fillText(getTextValue(centerTextValues, index), canvas.width / 2, canvas.height * 0.50);

        ctx.textAlign = 'right';
        ctx.fillText(getTextValue(rightTextValues, index), canvas.width * 0.95, canvas.height * 0.85);
    });
}

function parseText(text) {
    const pattern = /^\[(.*?)\]$/;
    const match = text.match(pattern);

    if (match) {
        return match[1].split(',').map(item => item.trim());
    }
    
    return [text]; // Default to the provided text if no pattern is found
}

function getTextValue(textArray, index) {
    if (index < textArray.length) {
        return textArray[index];
    }
    return textArray[textArray.length - 1] || ""; // Use the last item or an empty string for extra canvases
}

// ... rest of your script.js remains the same ...



            






function applyAlignedText(ctx, text, align, verticalPos, canvasWidth, canvasHeight) {
    ctx.textAlign = align;
    ctx.font = '20px Arial';
    const yPos = (verticalPos / 100) * canvasHeight;
    ctx.fillText(text, align === 'center' ? canvasWidth / 2 : (align === 'left' ? 0 : canvasWidth), yPos);
}

function downloadAllImages() {
    const title = document.getElementById('filenameTitle').value;
    const zip = new JSZip();
    const canvases = document.querySelectorAll('#imageContainer canvas');

    canvases.forEach((canvas, index) => {
        canvas.toBlob(blob => {
            const filename = title ? `${title}-${index}.png` : `image-${index}.png`;
            zip.file(filename, blob);

            if (index === canvases.length - 1) {
                zip.generateAsync({type:"blob"}).then(content => {
                    saveAs(content, `${title}.zip`);
                });
            }
        });
    });
}



function createBatch() {
    const numImages = parseInt(document.getElementById('numImages').value) || 5;
    const width = parseInt(document.getElementById('imgWidth').value) || 100;
    const height = parseInt(document.getElementById('imgHeight').value) || 100;
    const bgColor = document.getElementById('bgColor').value || '#FFFFFF';
    const imageContainer = document.getElementById('imageContainer');
    imageContainer.innerHTML = '';

    for (let i = 0; i < numImages; i++) {
        const canvas = document.createElement('canvas');
        canvas.id = `canvas-${i}`;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        imageContainer.appendChild(canvas);
    }
}

// ... existing functions ...

function updateSliderValue() {
    const sliderValue = document.getElementById('imageHeightSlider').value;
    document.getElementById('sliderValue').textContent = sliderValue;
}


function applyOverlayImages() {
    const files = document.getElementById('overlayImageInput').files;
    const heightPercentage = document.getElementById('imageHeightSlider').value / 100;
    if (!files.length) return;

    const sortedFiles = Array.from(files).sort((a, b) => a.name.localeCompare(b.name));
    const canvases = document.querySelectorAll('#imageContainer canvas');

    canvases.forEach((canvas, index) => {
        // Use a single image for all or unique images for each if multiple
        const file = files.length === 1 ? files[0] : sortedFiles[index % sortedFiles.length];
        
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;
            img.onload = function () {
                const ctx = canvas.getContext('2d');

                const scaleFactor = Math.min(canvas.width / img.width, canvas.height / img.height);
            const newWidth = img.width * scaleFactor * heightPercentage;
            const newHeight = img.height * scaleFactor * heightPercentage;

            ctx.drawImage(img, (canvas.width - newWidth) / 2, (canvas.height - newHeight) / 2, newWidth, newHeight);
        };
        };
        reader.readAsDataURL(file);
    });
}


// ... rest of your script.js remains the same ...

