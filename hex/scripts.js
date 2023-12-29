let gameHistory = [];
let currentRandomColor;
let pickr;

document.addEventListener("DOMContentLoaded", function() {
    pickr = Pickr.create({
        el: '#colorPicker',
        theme: 'nano',
        defaultRepresentation: 'HEX',
        components: {
            preview: true,
            opacity: false,
            hue: true,
            interaction: {
                hex: false,  // Disable hex input
                rgba: false,  // Disable rgba input
                hsla: false,  // Disable hsla input
                hsva: false,  // Disable hsva input
                cmyk: false,  // Disable cmyk input
                input: false,  // Disable input field
                clear: false,  // Disable Clear button
                save: true  // Display Save button
            }
        }
    });
    
    generateRandomHex();
});


document.addEventListener("DOMContentLoaded", function() {
    generateRandomHex();
});


function generateRandomHex() {
    const randomColor = '#' + (Math.floor(Math.random() * 16777215).toString(16)).padStart(6, '0'); // Ensure it's always 6 characters
    document.getElementById('randomHex').textContent = randomColor;
    currentRandomColor = randomColor; // Make sure this line is present
    return randomColor;
}


function checkGuess() {
    const userGuess = pickr.getColor().toHEXA().toString();


    const userGuessRGB = hexToRgb(userGuess);
    const correctColorRGB = hexToRgb(currentRandomColor);

    const diff = calculateColorDifference(userGuessRGB, correctColorRGB);
    const accuracy = (1 - diff / (255 * 3)) * 100; 

    displayResults(userGuess, currentRandomColor, accuracy.toFixed(2));  // Use currentRandomColor instead of generating a new one
    displayGradient(userGuess, currentRandomColor);
}

// ... other functions remain unchanged ...


function calculateColorDifference(color1, color2) {
    return Math.abs(color1[0] - color2[0]) + Math.abs(color1[1] - color2[1]) + Math.abs(color1[2] - color2[2]);
}


function displayResults(userGuess, correctColor, accuracy) {
    const resultsDiv = document.getElementById('results');

    resultsDiv.innerHTML = `
        <h3>Results:</h3>
        <p>Your Guess: <span style="color:${userGuess}">${userGuess}</span></p>
        <p>Correct Color: <span style="color:${correctColor}">${correctColor}</span></p>
        <p>Accuracy: ${accuracy}%</p>
    `;
}

function displayGradient(userGuess, correctColor) {
    const gradientDiv = document.getElementById('gradient');
    gradientDiv.style.background = `linear-gradient(90deg, ${correctColor}, ${userGuess})`;
}

function hexToRgb(hex) {
    const bigint = parseInt(hex.substring(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return [r, g, b];
}

function restartGame() {
    currentRandomColor = generateRandomHex();
    
    // Reset Pickr's color
    pickr.setColor("#ffffff");
    
    document.getElementById('results').innerHTML = '';
    document.getElementById('gradient').style.background = '';
    
    // Restore color cycling animation
    document.body.style.animation = "colorCycle 15s infinite";
}


function displayResults(userGuess, correctColor, accuracy) {
    const resultsDiv = document.getElementById('results');

    resultsDiv.innerHTML = `
        <h3>Results:</h3>
        <p>Your Guess: <span style="color:${userGuess}">${userGuess}</span></p>
        <p>Correct Color: <span style="color:${correctColor}">${correctColor}</span></p>
        <p>Accuracy: ${accuracy}%</p>
    `;

    // Save this game's data to the history
    gameHistory.push({
        userGuess: userGuess,
        correctColor: correctColor,
        accuracy: accuracy
    });

    updateHistory();
    // Set the background color to the correct color
    document.body.style.backgroundColor = correctColor;

    // Also, remove the color cycling animation
    document.body.style.animation = "none";
}

function updateHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = ''; // Clear the current list

    // Display all previous games
    for (let game of gameHistory) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            Given Color: <span style="color:${game.correctColor}">${game.correctColor}</span> | 
            Your Guess: <span style="color:${game.userGuess}">${game.userGuess}</span> | 
            Accuracy: ${game.accuracy}%
        `;
        historyList.appendChild(listItem);
    }
}