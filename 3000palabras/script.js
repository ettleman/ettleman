document.addEventListener('DOMContentLoaded', function() {

console.log(wordPairs); // Place this at the beginning of script.js


// Global variable to keep track of the current subcategory
let currentSubcategory = null;

// Function to update the word box with Spanish-English pairs and add TTS
function updateWordBox(subcategory) {
    currentSubcategory = subcategory; // Update the current subcategory
    const wordBox = document.getElementById('wordBox');
    wordBox.innerHTML = ''; // Clear current content


    const pairs = wordPairs[subcategory] || []; // Handle undefined subcategory

    pairs.forEach(pair => {
        const wordPairBox = document.createElement('div');
        const spanSpanish = document.createElement('span');
        const spanEnglish = document.createElement('span');

        spanSpanish.textContent = pair[0];
        spanEnglish.textContent = pair[1];

        // Set the click event listener on the entire word pair box
        wordPairBox.addEventListener('click', function() {
            speakSpanish(pair[0]);
        });

        wordPairBox.appendChild(spanSpanish);
        wordPairBox.appendChild(spanEnglish);
        wordBox.appendChild(wordPairBox);
    });
 // Show the export button
    document.getElementById('exportCsv').style.display = 'inline-block';
}

// Function to speak a word in Spanish
function speakSpanish(word) {
    const msg = new SpeechSynthesisUtterance(word);
    msg.lang = 'es-MX'; // Set the language to Spanish

    // Cancel any previous speech
    window.speechSynthesis.cancel();

    // Speak the word
    window.speechSynthesis.speak(msg);
}

// Load the voices and set the voice when the browser is ready
window.speechSynthesis.onvoiceschanged = function() {
    // This function now also sets the preferred voice when voices have changed
    let voices = window.speechSynthesis.getVoices().filter(voice => voice.lang.startsWith('es'));
    if (voices.length > 0) {
        speakSpanish('').voice = voices[0]; // Select the first Spanish voice
    }
};



// Function to populate subcategories based on selected category
function populateSubcategories(category) {
    const subcategoryList = document.getElementById('subcategoryList');
    subcategoryList.innerHTML = '<ul></ul>'; // Start with an empty list
    const ul = subcategoryList.querySelector('ul');

    categories[category].forEach(subcat => {
        const li = document.createElement('li');
        li.textContent = subcat;
        li.addEventListener('click', function() {
            // Update the word box when a subcategory is clicked
            updateWordBox(subcat);
        });
        ul.appendChild(li);
    });
}

// Attaching event listeners to category tabs
document.querySelectorAll('.arraybutton').forEach(button => {
    button.addEventListener('click', function() {
        populateSubcategories(this.dataset.category);
    });
});

// Attaching event listeners to category tabs
document.querySelectorAll('.arraybutton').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.arraybutton').forEach(tab => tab.classList.remove('active'));
        this.classList.add('active');
        populateSubcategories(this.dataset.category);
    });
});

// Initialize with the first category and set it as active
const firstCategoryButton = document.querySelector('.arraybutton[data-category="Basic Verbs"]');
firstCategoryButton.classList.add('active');
populateSubcategories("100 Basic Verbs");

});

function conjugateSpanishVerb(verb, subject) {
    const verbEnding = verb.slice(-2);
    const stem = verb.slice(0, -2);
    let conjugation = '';

    const endings = {
        'ar': ['o', 'as', 'a', 'amos', 'áis', 'an'],
        'er': ['o', 'es', 'e', 'emos', 'éis', 'en'],
        'ir': ['o', 'es', 'e', 'imos', 'ís', 'en']
    };

    const subjects = ['yo', 'tú', 'él/ella/Ud.', 'nosotros/nosotras', 'vosotros/vosotras', 'ellos/ellas/Uds.'];

    if (endings[verbEnding]) {
        let index = subjects.indexOf(subject);
        if (index !== -1) {
            conjugation = stem + endings[verbEnding][index];
        } else {
            conjugation = 'Unknown subject';
        }
    } else {
        conjugation = 'Irregular or unknown verb type';
    }

    return conjugation;
}

// Example usage:
console.log(conjugateSpanishVerb('hablar', 'yo')); // hablo
console.log(conjugateSpanishVerb('comer', 'nosotros')); // comemos
console.log(conjugateSpanishVerb('vivir', 'ellos/ellas/Uds.')); // viven



// Function to show the popup
function showPopup(word) {
    console.log("Popup function called for word:", word);
    const popup = document.getElementById('popup');
    popup.innerHTML = ''; // Clear previous content

    const title = document.createElement('h2');
    title.textContent = 'Conjugations for ' + word;
    popup.appendChild(title);

    // Subjects for conjugation
    const subjects = ['yo', 'tú', 'él/ella/Ud.', 'nosotros/nosotras', 'vosotros/vosotras', 'ellos/ellas/Uds.'];

    subjects.forEach(subject => {
        const conjugation = conjugateSpanishVerb(word, subject);
        const line = document.createElement('p');
        line.textContent = `${subject}: ${conjugation}`;
        popup.appendChild(line);
    });

    // Show the popup
    popup.style.display = 'block';
}


// Function to hide the popup
function hidePopup() {
    document.getElementById('popup').style.display = 'none';
}

    

// Add event listeners to words for showing the popup
document.getElementById('wordBox').addEventListener('click', function(e) {
    console.log("Clicked element:", e.target);
    if (e.target.tagName === 'SPAN') {
        showPopup(e.target.textContent);
    }
});



// Optional: Close the popup when clicking outside of it
document.addEventListener('click', function(e) {
    const popup = document.getElementById('popup');
    if (popup.style.display === 'block' && !popup.contains(e.target)) {
        hidePopup();
    }
});


