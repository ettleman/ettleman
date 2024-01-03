let clickCount = 0;
const startPageTitle = "Earth"; // Set your start page title here
const targetPageTitle = "Moon"; // Set your target page title here
let targetPageKeywords = [];

// Stopwords list to filter common words from being counted as keywords
const stopwords = ["the", "of", "in", "and", "a", "to", "is", "on", "for", "by", "with", "as", "was", "that", "it", "from", "are", "at", "be", "this", "which", "or", "also", "has", "had", "an", "not", "may", "were", "can", "its"];


document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startGame');
    if (startButton) {
        startButton.addEventListener('click', function() {
            if (clickCount === 0) {  // Load start page only if the game hasn't started
                loadWikipediaPage(startPageTitle);
                fetchTargetPageKeywords(targetPageTitle); // Fetch keywords when the game starts
            }
        });
    }
});

function loadWikipediaPage(title) {
    const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(title)}&format=json&origin=*`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.parse && data.parse.text && data.parse.text['*']) {
                let content = data.parse.text['*'];
                content = removeImagesAndUnwantedContent(content);
                document.getElementById('content').innerHTML = content;
                document.getElementById('clickCounter').textContent = `Clicks: ${clickCount}`;
                updateHeatMeter(content);
            } else {
                throw new Error('Malformed API response');
            }
        })
        .catch(error => {
            console.error('Error fetching or parsing data:', error);
            document.getElementById('content').innerHTML = 'Error loading content...';
        });
 updateUiTitle(title.replace(/_/g, ' ')); // Replace underscores with spaces for readability
}

function updateUiTitle(title) {
    document.getElementById('currentTitle').textContent = title;
}

function removeImagesAndUnwantedContent(content) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    
    // Remove images
    doc.querySelectorAll('img').forEach(img => img.remove());

    // Remove divs with role="note"
    doc.querySelectorAll('div[role="note"]').forEach(div => div.remove());
    
    // Remove divs with role="note"
    doc.querySelectorAll('table[class="infobox"]').forEach(div => div.remove());

    // Remove 'Notes', 'References', 'External Links' sections and '[edit]' links
    doc.querySelectorAll('.mw-references-wrap, .mw-editsection, .reflist, .navbox, .vertical-navbox, .noprint').forEach(el => el.remove());

    // Add here any other content removal if needed

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
    return Object.entries(wordCounts).sort((a, b) => b[1] - a[1]).slice(0, 100).map(entry => entry[0]);
}



function updateHeatMeter(content) {
    const textContent = getTextContent(content);
    let matches = targetPageKeywords.reduce((acc, keyword) => acc + textContent.toLowerCase().includes(keyword), 0);
    let heatPercentage = (matches / targetPageKeywords.length) * 100;
    document.getElementById('heatValue').textContent = `Heat: ${heatPercentage.toFixed(2)}%`;
    
    // Update link colors based on the heat percentage
    const color = getHeatColor(heatPercentage);
    document.querySelectorAll('#content a').forEach(link => {
        link.style.color = color;
    });
}

function getHeatColor(percentage) {
    // This is a simple linear interpolation between blue and red based on the percentage
    const red = Math.round((255 * percentage) / 100);
    const blue = 255 - red;
    return `rgb(${red}, 0, ${blue})`;
}

/*
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

*/

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
            <span class="close-btn" onclick="closePopup('congratsPopup')">&times;</span>
            <h2>Congratulations!</h2>
            <p>You found the target page in ${clicks} clicks.</p>
        </div>
    `;
    document.body.appendChild(popup);
}

function closePopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.remove();
    }
}

// Make sure this event listener is at the bottom of your script to ensure all above functions are defined
document.getElementById('content').addEventListener('click', function(event) {
    // ... existing event delegation logic ...
    // Add checkIfTargetPage call after updating the page with new content
    checkIfTargetPage(decodeURIComponent(event.target.getAttribute('href').split('/wiki/')[1]));
});

