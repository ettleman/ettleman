
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
    const leftTextValues = parseText(document.getElementById('leftText').value);
    const centerTextValues = parseText(document.getElementById('centerText').value);
    const rightTextValues = parseText(document.getElementById('rightText').value);
    const canvases = document.querySelectorAll('#imageContainer canvas');

    canvases.forEach((canvas, index) => {
        const ctx = canvas.getContext('2d');
        const fontSize = canvas.height * 0.10; // 10% of canvas height
        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = 'black';

        // Apply left, center, and right text
        ctx.textAlign = 'left';
        ctx.fillText(getTextValue(leftTextValues, index), canvas.width * 0.05, canvas.height * 0.15);

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
        const zip = new JSZip();
        const canvases = document.querySelectorAll('#imageContainer canvas');

        canvases.forEach((canvas, index) => {
            canvas.toBlob(blob => {
                zip.file(`image-${index}.png`, blob);
                if (index === canvases.length - 1) {
                    zip.generateAsync({ type: "blob" }).then(function (content) {
                        saveAs(content, "images.zip");
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

function applyOverlayImages() {
    const files = document.getElementById('overlayImageInput').files;
    const sortedFiles = Array.from(files).sort((a, b) => a.name.localeCompare(b.name));
    const canvases = document.querySelectorAll('#imageContainer canvas');

    sortedFiles.forEach((file, index) => {
        if (index >= canvases.length) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;
            img.onload = function () {
                const canvas = canvases[index];
                const ctx = canvas.getContext('2d');

                // Optional: Scale the overlay image to fit the canvas
                // or adjust as needed
                const scaleFactor = Math.min(canvas.width / img.width, canvas.height / img.height);
                const newWidth = img.width * scaleFactor;
                const newHeight = img.height * scaleFactor;

                ctx.drawImage(img, (canvas.width - newWidth) / 2, (canvas.height - newHeight) / 2, newWidth, newHeight);
            };
        };
        reader.readAsDataURL(file);
    });
}

// ... rest of your script.js remains the same ...

