function fetchStocks() {
    const proxyUrl = 'https://corsproxy.io/?';
    const targetUrl = encodeURIComponent('https://tradestie.com/api/v1/apps/reddit');
    const fullUrl = proxyUrl + targetUrl;

    fetch(fullUrl)
        .then(response => response.json())
        .then(data => displayStocks(data))
        .catch(error => console.error('Error:', error));
}

function displayStocks(stocks) {
    const stocksDiv = document.getElementById('stocks');
    stocksDiv.innerHTML = ''; // Clear previous results
    stocks.forEach(stock => {
        const stockElement = document.createElement('div');
        stockElement.innerHTML = `<strong>${stock.ticker}</strong> - Comments: ${stock.no_of_comments}, Sentiment: ${stock.sentiment} (${stock.sentiment_score})`;
        stocksDiv.appendChild(stockElement);
    });
}
