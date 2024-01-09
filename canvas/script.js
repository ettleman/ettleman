
let selectedPixel = null; // Declare at the top

document.addEventListener('DOMContentLoaded', function () {
    const panzoomInstance = Panzoom(document.getElementById('canvas'), {
        maxScale: 5,
        contain: 'outside',
        touchAction: 'none',
        onStart: function(e) {
            // Prevent panning if a pixel is clicked
            if (e.target.classList.contains('pixel')) {
                e.preventDefault();
            }
        }
    });

    document.getElementById('canvas-container').addEventListener('wheel', function(e) {
        e.preventDefault();
        panzoomInstance.zoomWithWheel(e);
        console.log("canvas-container done");
    });

    const canvas = document.getElementById('canvas');
    const popup = document.getElementById('popup');
    const inputText = document.getElementById('inputText');
    const colorPicker = document.getElementById('colorPicker');
    const saveButton = document.getElementById('saveButton');

    // Creating the 100x100 grid
    for (let i = 0; i < 10000; i++) {
        let pixel = document.createElement('div');
        pixel.classList.add('pixel');
        pixel.addEventListener('click', function () {
            selectedPixel = pixel;
            popup.classList.add('visible');
            inputText.value = pixel.textContent;
            colorPicker.value = pixel.style.backgroundColor || '#ffffff'; // Default to white if no color set
            positionPopup(event); // Function to position the popup near the clicked pixel
        });
        canvas.appendChild(pixel);
    }

    // Function to position the popup
    function positionPopup(e) {
        popup.style.top = `${e.pageY + 5}px`;
        popup.style.left = `${e.pageX + 5}px`;
    }

    // Saving the input data
    saveButton.addEventListener('click', function () {
        if (selectedPixel) {
            selectedPixel.textContent = inputText.value;
            selectedPixel.style.backgroundColor = colorPicker.value;
            popup.classList.remove('visible');
        }
    });

    // Close popup when clicking outside
    window.addEventListener('click', function (e) {
        if (e.target !== popup && e.target !== selectedPixel) {
            popup.classList.remove('visible');
        }
    });
    document.querySelectorAll('.pixel').forEach(function(pixel) {
        pixel.addEventListener('click', function () {
            selectedPixel = pixel; // Now accessible
            // ...rest of your popup logic...
        });
    });

});

// ... rest of your JavaScript code ...

// Toggle popup visibility with animation
function togglePopup(visible) {
    if (visible) {
        popup.classList.add('visible');
    } else {
        popup.classList.remove('visible');
    }
}

// Update event listener for saveButton
saveButton.addEventListener('click', function () {
    if (selectedPixel) {
        selectedPixel.textContent = inputText.value;
        selectedPixel.style.backgroundColor = colorPicker.value;
        togglePopup(false);
    }
});

// Close popup when clicking outside
window.addEventListener('click', function (e) {
    if (popup.classList.contains('visible') && !popup.contains(e.target) && e.target !== selectedPixel) {
        popup.classList.remove('visible');
    }
});

let zoomLevel = 1;

document.getElementById('zoomIn').addEventListener('click', function() {
    zoomLevel += 0.1;
    updateZoom();
});

document.getElementById('zoomOut').addEventListener('click', function() {
    zoomLevel = Math.max(0.1, zoomLevel - 0.1);
    updateZoom();
});

function updateZoom() {
    document.getElementById('canvas').style.transform = `scale(${zoomLevel})`;
}
