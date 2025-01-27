const gridSize = 16;
let selectedDigit = null;
let isMouseDown = false;
const pixelGrid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
const digitData = JSON.parse(localStorage.getItem('digitData')) || {};

// Ensure digitData has buffers for digits 0 through 9
for (let i = 0; i <= 9; i++) {
    if (!digitData[i]) {
        digitData[i] = [];
    }
}

function createGrid() {
    const gridContainer = document.getElementById('grid');
    gridContainer.innerHTML = '';
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const pixel = document.createElement('div');
            pixel.className = 'pixel';
            pixel.dataset.row = row;
            pixel.dataset.col = col;
            pixel.style.backgroundColor = pixelGrid[row][col] === 0 ? '#fff' : '#000';
            pixel.addEventListener('mousedown', () => {
                isMouseDown = true;
                setPixel(row, col, pixel);
            });
            pixel.addEventListener('mouseover', () => {
                if (isMouseDown) {
                    setPixel(row, col, pixel);
                }
            });
            pixel.addEventListener('mouseup', () => {
                isMouseDown = false;
            });
            pixel.addEventListener('click', () => {
                setPixel(row, col, pixel);
            });
            gridContainer.appendChild(pixel);
        }
    }
}

function setPixel(row, col, pixel) {
    pixelGrid[row][col] = 1; // Set the pixel to black
    pixel.style.backgroundColor = '#000';
}

function selectDigit(digit) {
    selectedDigit = digit;
    console.log(`Selected digit: ${selectedDigit}`);
    updateDigitSelection();
}

function updateDigitSelection() {
    document.querySelectorAll('.digit-button').forEach(button => {
        if (parseInt(button.dataset.digit) === selectedDigit) {
            button.classList.add('selected');
        } else {
            button.classList.remove('selected');
        }
    });
}

function clearGrid() {
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            pixelGrid[row][col] = 0;
        }
    }
    createGrid();
}

function submitGrid() {
    console.log('Submit button clicked');
    if (selectedDigit !== null) {
        const pixelData = [];
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                pixelData.push([pixelGrid[row][col], row, col]);
            }
        }
        digitData[selectedDigit].push(pixelData);
        localStorage.setItem('digitData', JSON.stringify(digitData));
        console.log(`Data for digit ${selectedDigit} saved:`, pixelData);
        displayPixelData(pixelData);
        clearGrid();
    } else {
        console.log('No digit selected');
    }
}

function displayPixelData(pixelData) {
    const pixelDataContainer = document.getElementById('pixel-data');
    console.log('Displaying pixel data:', pixelData); // Debugging statement

    // Create a readable format for the pixel data
    let formattedData = '[' + pixelData.map(item => `(${item[0]}, ${item[1]}, ${item[2]})`).join(', ') + ']';

    pixelDataContainer.textContent = formattedData;
}

function copyPixelData() {
    const pixelDataContainer = document.getElementById('pixel-data');
    const textToCopy = pixelDataContainer.innerText;
    navigator.clipboard.writeText(textToCopy).then(() => {
        console.log('Pixel data copied to clipboard');
    }).catch(err => {
        console.error('Error copying pixel data:', err);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    createGrid();
    document.getElementById('clear').addEventListener('click', clearGrid);
    document.getElementById('submit').addEventListener('click', submitGrid);
    document.getElementById('copy').addEventListener('click', copyPixelData);
    document.querySelectorAll('.digit-button').forEach(button => {
        button.addEventListener('click', () => selectDigit(parseInt(button.dataset.digit)));
    });

    document.addEventListener('mousedown', () => {
        isMouseDown = true;
    });

    document.addEventListener('mouseup', () => {
        isMouseDown = false;
    });

    document.addEventListener('mouseleave', () => {
        isMouseDown = false;
    });
});