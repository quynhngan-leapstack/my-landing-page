// API endpoint
const API_URL = 'https://official-joke-api.appspot.com';

// State management
let currentCategory = 'any';
let jokeHistory = [];
let jokeCount = 0;
let favorites = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    displayStats();
    loadHistory();
});

/**
 * Fetch a joke from the API
 */
async function getJoke() {
    const generateBtn = document.getElementById('generateBtn');
    const spinner = document.getElementById('spinner');
    const jokeContent = document.getElementById('jokeContent');
    const jokeType = document.getElementById('jokeType');

    // Disable button and show loading state
    generateBtn.disabled = true;
    spinner.classList.add('loading');
    jokeContent.innerHTML = '<p>Loading a joke for you...</p>';

    try {
        let url;
        if (currentCategory === 'any') {
            url = `${API_URL}/random_joke`;
        } else {
            url = `${API_URL}/jokes/${currentCategory}/random`;
        }

        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const joke = await response.json();
        displayJoke(joke);
        addToHistory(joke);
        jokeCount++;
        saveToLocalStorage();
        displayStats();

    } catch (error) {
        console.error('Error fetching joke:', error);
        jokeContent.innerHTML = `
            <p>Oops! Something went wrong. Please try again.</p>
            <p style="font-size: 0.8em; margin-top: 15px; opacity: 0.8;">Error: ${error.message}</p>
        `;
        jokeType.textContent = 'Error';
    } finally {
        generateBtn.disabled = false;
        spinner.classList.remove('loading');
    }
}

/**
 * Display joke on the page
 */
function displayJoke(joke) {
    const jokeContent = document.getElementById('jokeContent');
    const jokeType = document.getElementById('jokeType');

    // Determine if it's a two-part joke (setup + delivery) or single line
    let jokeText = '';
    if (joke.setup && joke.delivery) {
        jokeText = `<p>${joke.setup}</p><p style="margin-top: 15px;">🤔</p><p style="margin-top: 15px;">${joke.delivery}</p>`;
    } else if (joke.joke) {
        jokeText = `<p>${joke.joke}</p>`;
    }

    jokeContent.innerHTML = jokeText;
    jokeType.textContent = joke.type ? joke.type.charAt(0).toUpperCase() + joke.type.slice(1) : 'General';
}

/**
 * Set category filter
 */
function setCategory(category) {
    currentCategory = category;

    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Get new joke with selected category
    getJoke();
}

/**
 * Add joke to history
 */
function addToHistory(joke) {
    const jokeText = joke.setup ? `${joke.setup} ${joke.delivery}` : joke.joke;
    jokeHistory.unshift(jokeText.substring(0, 80) + (jokeText.length > 80 ? '...' : ''));
    
    // Keep only last 10 jokes
    if (jokeHistory.length > 10) {
        jokeHistory.pop();
    }
    
    loadHistory();
}

/**
 * Display joke history
 */
function loadHistory() {
    const historyList = document.getElementById('jokeHistory');
    historyList.innerHTML = '';

    jokeHistory.forEach((joke, index) => {
        const li = document.createElement('li');
        li.textContent = joke;
        li.title = joke; // Full text on hover
        historyList.appendChild(li);
    });
}

/**
 * Clear joke history
 */
function clearHistory() {
    if (confirm('Are you sure you want to clear the history?')) {
        jokeHistory = [];
        loadHistory();
        saveToLocalStorage();
    }
}

/**
 * Display statistics
 */
function displayStats() {
    document.getElementById('jokeCount').textContent = jokeCount;
    document.getElementById('favoriteCount').textContent = favorites.length;
}

/**
 * Save data to LocalStorage
 */
function saveToLocalStorage() {
    const data = {
        jokeHistory,
        jokeCount,
        favorites,
        currentCategory
    };
    localStorage.setItem('jokeGeneratorData', JSON.stringify(data));
}

/**
 * Load data from LocalStorage
 */
function loadFromLocalStorage() {
    const data = localStorage.getItem('jokeGeneratorData');
    if (data) {
        const parsed = JSON.parse(data);
        jokeHistory = parsed.jokeHistory || [];
        jokeCount = parsed.jokeCount || 0;
        favorites = parsed.favorites || [];
        currentCategory = parsed.currentCategory || 'any';
    }
}