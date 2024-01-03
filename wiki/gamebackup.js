let clickCount = 0;
const startPageTitle = "Earth"; // Set your start page title here
const targetPageTitle = "Moon"; // Set your target page title here
let targetPageKeywords = [];

// Stopwords list to filter common words from being counted as keywords
const stopwords = ["the", "of", "in", "and", "a", "to", "is", "on", "for", "by", "with", "as", "was", "that", "it", "from", "are", "at", "be", "this", "which", "or", "also", "has", "had", "an", "not", "may", "were", "can", "its"];


document.addEventListener('DOMContentLoaded', function() {
    // Ensure the 'startGame' button is present in the DOM
    const startButton = document.getElementById('startGame');
    const contentDiv = document.getElementById('content');
    const clickCounterDiv = document.getElementById('clickCounter');
    
    if (startButton && contentDiv && clickCounterDiv) {
        startButton.addEventListener('click', function() {
            if (clickCount === 0) {  // Load start page only if the game hasn't started
                loadWikipediaPage(startPageTitle);
            }
        });

        contentDiv.addEventListener('click', function(event) {
            // Rest of your event delegation logic for handling clicks on links
            // ...
        });
    } else {
        console.error('One or more required elements are missing in the DOM.');
    }
});

// ... Rest of your JavaScript functions (loadWikipediaPage, fixImageUrls, etc.)


function loadWikipediaPage(title) {
    const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(title)}&format=json&origin=*`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.parse && data.parse.text && data.parse.text['*']) {
                let content = data.parse.text['*'];
                content = fixImageUrls(content);
                content = removeUnwantedContent(content);
                document.getElementById('content').innerHTML = content;
                document.getElementById('clickCounter').textContent = `Clicks: ${clickCount}`;
                checkIfTargetPage(title);
            } else {
                throw new Error('Malformed API response');
            }
        })
        .catch(error => {
            console.error('Error fetching or parsing data:', error);
            document.getElementById('content').innerHTML = 'Error loading content...';
        });
}

function fixImageUrls(content) {
    return content.replace(/src="\/\//g, 'src="https://');
}


function removeUnwantedContent(content) {
    // This is a basic implementation and may need refinement
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');

    // Remove everything except for the title and the text paragraphs
    Array.from(doc.body.children).forEach(child => {
        if (!child.querySelector('img, p, h1, h2, h3')) {
            child.remove();
        }
    });

    return doc.body.innerHTML;
}


function fetchTargetPageKeywords(title) {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=extracts&format=json&origin=*`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const page = data.query.pages;
            const pageId = Object.keys(page)[0];
            const extract = page[pageId].extract;
            const textContent = getTextContent(extract);
            targetPageKeywords = extractKeywords(textContent);
        })
        .catch(error => {
            console.error('Error fetching target page keywords:', error);
        });
}

function getTextContent(html) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
}

function extractKeywords(text) {
    // Split the text into words and filter out stopwords and non-alphabetic strings
    const words = text.match(/\w+/g).filter(word => !stopwords.includes(word.toLowerCase()));
    // Count word occurrences and sort by frequency
    const wordCounts = words.reduce((acc, word) => {
        const lcWord = word.toLowerCase();
        acc[lcWord] = (acc[lcWord] || 0) + 1;
        return acc;
    }, {});
    // Extract top 10 keywords by frequency
    return Object.entries(wordCounts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(entry => entry[0]);
}



function updateHeatMeter(content) {
    const targetKeywords = targetPageTitle.split('_');
    let heat = 0;

    targetKeywords.forEach(keyword => {
        const regex = new RegExp(keyword, 'gi');
        const matches = content.match(regex);
        heat += matches ? matches.length : 0;
    });

    document.getElementById('heatValue').textContent = heat;
}

document.getElementById('content').addEventListener('click', function(event) {
    if (event.target.tagName === 'A') {
        event.preventDefault();
        const href = event.target.getAttribute('href');
        if (href.startsWith('/wiki/')) {
            const pageTitle = href.split('/wiki/')[1];
            clickCount++;
            loadWikipediaPage(decodeURIComponent(pageTitle));
        }
    }
});


function checkIfTargetPage(title) {
    if (title.toLowerCase() === targetPageTitle.toLowerCase()) {
        // Show a HTML popup instead of an alert
        showCongratsPopup(clickCount);
    }
}

function showCongratsPopup(clicks) {
    const popup = document.createElement('div');
    popup.id = 'congratsPopup';
    popup.className = 'popup';
    popup.innerHTML = `
        <div class="popup-content">
            <span class="close-btn" onclick="document.getElementById('congratsPopup').remove();">&times;</span>
            <h2>Congratulations!</h2>
            <p>You found the target page in ${clicks} clicks.</p>
        </div>
    `;
    document.body.appendChild(popup);
}


