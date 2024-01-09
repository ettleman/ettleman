let clickCount = 0;
const startPageTitle = "Manchester_City_F.C."; // Set your start page title here
const targetPageTitle = "Donald_Trump"; // Set your target page title here
let targetPageKeywords = [];
let targetPageLinks = [];
let targetPageWords = new Set();
let currentTitle = "";

const stopwords = new Set([
    "a", "of", "it", "with", "as", "the", "an", "has", "also", "important", "is", "and", 
    "in", "on", "for", "by", "this", "that", "to", "at", "be", "are", "was", "were", "can",
    "its", "or", "we", "you", "they", "i", "he", "she", "which", "what", "where", "when",
    "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such",
    "since", "based", "won", "one", "two", "three", "had", "through", "until", "would", "him", "her"
    "january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"

    // Add more stopwords as needed
]);

document.addEventListener('DOMContentLoaded', function() {
    fetchTargetPageWords(targetPageTitle); // Fetch words from the target page when the game starts
    const startButton = document.getElementById('startGame');
    if (startButton) {
        startButton.addEventListener('click', function() {
            loadWikipediaPage(startPageTitle);
            fetchTargetPageKeywords(targetPageTitle); // Fetch hyperlinked words when the game starts
            startButton.style.display = 'none'; // Hide the start button
            document.getElementById('currentTitle').style.visibility = 'visible'; // Show the current title
        });
    }
});

function getTextContent(html) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
}

function loadWikipediaPage(title, incrementClickCounter = true) {
    const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(title)}&format=json&origin=*`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.parse && data.parse.text && data.parse.text['*']) {
                let content = data.parse.text['*'];
                content = removeImagesAndUnwantedContent(content);
                document.getElementById('content').innerHTML = content;
                updateUiTitle(title.replace(/_/g, ' '));
                updateHeatMeter(content);
                
                // Check for redirect
                handleRedirect(content);

                if (incrementClickCounter) {
                    clickCount++;
                    document.getElementById('clickCounter').textContent = `Clicks: ${clickCount}`;
                }
            } else {
                throw new Error('Malformed API response');
            }
        })
        .catch(error => {
            console.error('Error fetching or parsing data:', error);
            document.getElementById('content').innerHTML = 'Error loading content...';
        });
}


function fetchTargetPageWords(title) {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=extracts&format=json&origin=*`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const page = data.query.pages;
            const pageId = Object.keys(page)[0];
            const extract = page[pageId].extract;
            const textContent = getTextContent(extract);
            // Process and store the words from the target page
            targetPageWords = new Set(textContent.toLowerCase().match(/\b(\w+)\b/g));
        })
        .catch(error => {
            console.error('Error fetching target page words:', error);
        });
}


function updateUiTitle(title) {
    document.getElementById('currentTitle').textContent = title;
}



function removeImagesAndUnwantedContent(content) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    
    // Remove tables that are not part of the main article text
    doc.querySelectorAll('img, ul.gallery, .gallery, .mw-gallery-traditional, .reflist, .navbox, .vertical-navbox, .noprint, .mw-editsection, .infobox, .hatnote.navigation-not-searchable, div.thumbinner, div.multiimageinner, table, .infobox, .navbox, .vertical-navbox, .noprint, .mw-editsection, .hatnote, .thumb, .reference, .reflist, .gallery, .metadata').forEach(el => el.remove());

    // Remove specific headers like 'Notes', 'References', 'External links', etc.
    doc.querySelectorAll('h2').forEach(header => {
        const sectionTitle = header.textContent.toLowerCase();
        if (sectionTitle.includes('notes') || sectionTitle.includes('references') || sectionTitle.includes('external links') || sectionTitle.includes('see also') || sectionTitle.includes('sources')) {
            let element = header;
            do {
                let nextElement = element.nextElementSibling;
                element.remove();
                element = nextElement;
            } while(element && element.tagName !== 'H2');
        }
    });

    return doc.body.innerHTML;
}



// We'll implement a function that fetches the target page links and uses them for the heat meter calculation
function fetchTargetPageLinks(title) {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=links&pllimit=50&format=json&origin=*`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Access the first (and typically the only) page in the query
            const pageId = Object.keys(data.query.pages)[0];
            if (data.query.pages[pageId].hasOwnProperty('links')) {
                targetPageLinks = data.query.pages[pageId].links
                    // Filter out non-article links and extract titles
                    .filter(link => link.ns === 0)
                    .map(link => link.title.toLowerCase());
            }
        })
        .catch(error => {
            console.error('Error fetching target page links:', error);
        });
}




function fetchTargetPageKeywords(title) {
    // Fetch only hyperlinked words for the heat meter
    const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(title)}&format=json&prop=text&origin=*`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.parse && data.parse.text && data.parse.text['*']) {
                const content = data.parse.text['*'];
                const parser = new DOMParser();
                const doc = parser.parseFromString(content, 'text/html');
                const links = doc.querySelectorAll('p a');
                targetPageKeywords = Array.from(new Set(Array.from(links).map(link => link.textContent.trim().toLowerCase()))).filter(word => word.length > 1);
            }
        })
        .catch(error => {
            console.error('Error fetching target page keywords:', error);
        });
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

function handleRedirect(content) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const firstParagraph = doc.querySelector('p');

    if (firstParagraph && firstParagraph.textContent.startsWith('Redirect')) {
        const firstLink = firstParagraph.querySelector('a');
        if (firstLink) {
            const redirectPageTitle = firstLink.getAttribute('title');
            loadWikipediaPage(redirectPageTitle, false); // Load the redirect page without incrementing the click counter
        }
    }
}


function updateHeatMeter(content) {
    const contentText = getTextContent(content).toLowerCase();
    const contentWords = new Set(contentText.match(/\b(\w+)\b/g));

    // Filter out stopwords from content words
    const filteredContentWords = new Set([...contentWords].filter(word => !stopwords.has(word)));

    // Calculate common words excluding stopwords
    const commonWords = [...filteredContentWords].filter(word => targetPageWords.has(word));

    // Highlight common words in the content
    const processedContent = highlightCommonWords(content, new Set(commonWords));
    document.getElementById('content').innerHTML = processedContent;

    document.getElementById('heatValue').textContent = `Common Words: ${commonWords.length}`;
}

function getTextContent(html) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
}


function checkDirectLink(currentTitle, targetTitle) {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(currentTitle)}&prop=links&pllimit=max&format=json&origin=*`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const pages = data.query.pages;
            const pageId = Object.keys(pages)[0];
            if (pages[pageId].hasOwnProperty('links')) {
                const pageLinks = pages[pageId].links.map(link => link.title.toLowerCase());
                directLinkToTarget = pageLinks.includes(targetTitle.toLowerCase());
            }
        })
        .catch(error => {
            console.error('Error checking for direct link:', error);
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

function updateLinkColors(heatPercentage) {
    const color = getHeatColor(heatPercentage);
    document.querySelectorAll('#content a').forEach(link => {
        link.style.color = color;
    });
}

function checkIfTargetPage() {
    if (currentTitle.toLowerCase() === targetPageTitle.toLowerCase()) {
        showCongratsPopup(clickCount);
    }
}

// Call fetchTargetPageLinks with the target page title when the game starts
fetchTargetPageLinks(targetPageTitle);

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

document.getElementById('content').addEventListener('click', function(event) {
    if (event.target.tagName === 'A') {
        event.preventDefault(); // Prevent the default link behavior
        const href = event.target.getAttribute('href');
        if (href && href.startsWith('/wiki/')) {
            const pageTitle = href.split('/wiki/')[1];
            loadWikipediaPage(decodeURIComponent(pageTitle.replace(/_/g, ' ')), true); // Replace underscores and decode URI component
        }
    }
});


function highlightCommonWords(content, commonWords) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    function createHighlightedFragment(text) {
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        text.replace(/\b(\w+)\b/g, (match, word, offset) => {
            // Append the text before the word
            fragment.appendChild(document.createTextNode(text.slice(lastIndex, offset)));

            // Append the highlighted word if it's a common word
            if (commonWords.has(word.toLowerCase())) {
                const highlighted = document.createElement('span');
                highlighted.style.backgroundColor = 'lightgreen'; // Apply highlighted background
                highlighted.textContent = word;
                fragment.appendChild(highlighted);
            } else {
                fragment.appendChild(document.createTextNode(word));
            }

            lastIndex = offset + word.length;
        });

        // Append any remaining text
        fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
        return fragment;
    }

    function traverseAndHighlight(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const fragment = createHighlightedFragment(node.textContent);
            node.replaceWith(fragment);
        } else {
            Array.from(node.childNodes).forEach(traverseAndHighlight);
        }
    }

    traverseAndHighlight(tempDiv);
    return tempDiv.innerHTML;
}



