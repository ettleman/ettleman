function fetchStocks() {
    fetch('stocks_data.json')
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
