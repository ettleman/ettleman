

function createColumns() {
    var numberOfDays = document.getElementById("shootDays").value;
    var columnsContainer = document.getElementById("shootDayColumns");
    columnsContainer.innerHTML = '';
    var dragulaContainers = [];

    for (let i = 1; i <= numberOfDays; i++) {
        let column = document.createElement("div");
        column.classList.add("dayColumn");
        column.id = 'day' + i;
        column.innerHTML = `
            <h3>Day ${i}</h3>
            <button onclick="addItem(${i})">+ Add Item</button>
            <div class="itemsContainer"></div>
            <div class="dayTotal">Day Total: $0</div>
        `;
        columnsContainer.appendChild(column);
        dragulaContainers.push(column.getElementsByClassName('itemsContainer')[0]);
    }

    dragula(dragulaContainers, {
        accepts: function (el, target, source, sibling) {
            // Prevent moving 'every day' items
            return !el.classList.contains('everyday');
        }
    }).on('drop', function (el) {
        updateTotal();
    });
}
function addItem(day) {
    var newItem = createItemCard(day); // Create a new item card for the specified day
    var column = document.getElementById('day' + day);
    var itemsContainer = column.getElementsByClassName('itemsContainer')[0];
    itemsContainer.appendChild(newItem); // Add the new item card to the day's column
    updateTotal();
}


let itemId = 0; // Global unique ID for each item

function createItemCard(day) {
    var itemCard = document.createElement("div");
    itemCard.classList.add("itemCard");
    itemCard.draggable = true;
    itemCard.dataset.itemId = itemId++; // Assign a unique ID to each item card
    itemCard.ondragstart = function(event) { dragStart(event, day); };
    itemCard.innerHTML = `
        <input type="text" placeholder="Title" class="itemTitle" onchange="updateItemProperty(this, 'title')">
        <select onchange="updateItemProperty(this, 'type')">
            <option value="cast">🎭 Cast</option>
            <option value="location">📍 Location</option>
            <option value="camera">🎥 Camera</option>
            <option value="production">🏭 Production</option>
            <option value="art">🎨 Art</option>
            <option value="sound">🔊 Sound</option>
            <option value="misc">🔧 Misc</option>
            <!-- Add other item types here -->
        </select>
        <input type="number" placeholder="Daily Cost" class="itemCost" onchange="updateItemProperty(this, 'cost')">
        <button onclick="toggleEveryDay(this, ${day})"><img src="everyday.png" /></button>
        <button onclick="duplicateItem(this, ${day})"><img src="duplicate.png" /></button>
        <button onclick="deleteItem(this)"><img src="trash.png" /></button>
    `;
    return itemCard;
}


function updateItemProperty(element, property) {
    var itemCard = element.closest('.itemCard');
    var itemId = itemCard.dataset.itemId;
    var value = element.value;

    if (itemCard.classList.contains('everyday')) {
        var allEverydayItems = document.querySelectorAll(`.everyday[data-item-id="${itemId}"]`);
        allEverydayItems.forEach(item => {
            if (item !== itemCard) {
                if (property === 'title') {
                    item.querySelector('.itemTitle').value = value;
                } else if (property === 'type') {
                    item.querySelector('select').value = value;
                } else if (property === 'cost') {
                    item.querySelector('.itemCost').value = value;
                }
            }
        });
    }
    updateTotal();
}

function toggleEveryDay(button) {
    var itemCard = button.closest('.itemCard');
    var currentColumn = itemCard.closest('.dayColumn');
    var currentDay = currentColumn.getAttribute('id').substring(3); // Get the current day from the column's ID
    var isEveryday = itemCard.classList.toggle('everyday');
    button.classList.toggle('active', isEveryday);

    applyToEveryDay(itemCard, currentDay, isEveryday);
}


function updateTotal() {
    var totalBudget = 0;
    var dayColumns = document.getElementsByClassName('dayColumn');
    for (var i = 0; i < dayColumns.length; i++) {
        var dayTotal = 0;
        var inputs = dayColumns[i].querySelectorAll('.itemCost');
        inputs.forEach(input => {
            var cost = parseInt(input.value);
            if (!isNaN(cost)) {
                dayTotal += cost;
            }
        });
        dayColumns[i].querySelector('.dayTotal').innerText = 'Day Total: $' + dayTotal;
        totalBudget += dayTotal;
    }
    document.getElementById('totalBudget').innerText = totalBudget;
}

function updateTypeTotals() {
    var totals = {};
    var itemCards = document.querySelectorAll('.itemCard');
    itemCards.forEach(card => {
        var type = card.querySelector('select').value;
        var cost = parseFloat(card.querySelector('.itemCost').value) || 0;
        totals[type] = (totals[type] || 0) + cost;
    });

    var totalsDisplay = document.getElementById('typeTotals');
    totalsDisplay.innerHTML = ''; // Clear previous totals
    Object.keys(totals).forEach(type => {
        totalsDisplay.innerHTML += `<p>${type}: $${totals[type].toFixed(2)}</p>`;
    });
}


function applyToEveryDay(itemCard, currentDay, isEveryday) {
    var title = itemCard.querySelector('.itemTitle').value;
    var itemType = itemCard.querySelector('select').value;
    var cost = itemCard.querySelector('.itemCost').value;
    var itemId = itemCard.dataset.itemId;

    if (isEveryday) {
        var columns = document.getElementsByClassName('dayColumn');
        for (var column of columns) {
            if (column.id !== 'day' + currentDay) {
                var newCard = itemCard.cloneNode(true);
                newCard.dataset.itemId = itemId;
                newCard.ondragstart = function(event) { event.preventDefault(); };
                newCard.querySelector('.deleteButton').onclick = function() { deleteItem(this); };
                newCard.querySelector('.itemTitle').value = title;
                newCard.querySelector('select').value = itemType;
                newCard.querySelector('.itemCost').value = cost;
                column.getElementsByClassName('itemsContainer')[0].appendChild(newCard);
            }
        }
    } else {
        var everyDayItems = document.querySelectorAll(`.everyday[data-item-id="${itemId}"]`);
        everyDayItems.forEach(item => {
            if (item !== itemCard) {
                item.remove();
            }
        });
    }
    updateTotal();
}

function updateEverydayItems(select, day) {
    var itemCard = select.closest('.itemCard');
    var itemId = itemCard.dataset.itemId;
    if (itemCard.classList.contains('everyday')) {
        var title = itemCard.querySelector('.itemTitle').value;
        var itemType = select.value;
        var everyDayItems = document.querySelectorAll(`.everyday .itemTitle`);

        everyDayItems.forEach(item => {
            if (item.value === title && item !== select) {
                item.closest('.itemCard').querySelector('select').value = itemType;
            }
        });
    }
}





function updateItemCost(input, day) {
    var itemCard = input.closest('.itemCard');
    if (itemCard.classList.contains('everyday')) {
        var itemId = itemCard.dataset.itemId;
        var cost = input.value;
        var everyDayItems = document.querySelectorAll(`.everyday[data-item-id="${itemId}"]`);

        everyDayItems.forEach(item => {
            if (item !== itemCard) {
                item.querySelector('.itemCost').value = cost;
            }
        });
    }
    updateTotal();
}




// Add event listeners to the title field for syncing
function updateItemTitle(input, day) {
    var itemCard = input.closest('.itemCard');
    var itemId = itemCard.dataset.itemId;
    if (itemCard.classList.contains('everyday')) {
        var everyDayItems = document.querySelectorAll(`.everyday[data-item-id="${itemId}"]`);
        everyDayItems.forEach(item => {
            if (item !== itemCard) {
                item.querySelector('.itemTitle').value = input.value;
            }
        });
    }
}

function duplicateItem(button) {
    var itemCard = button.closest('.itemCard');
    var currentColumn = itemCard.closest('.dayColumn');
    var day = currentColumn.getAttribute('id').substring(3); // Extracting the day number

    var newCard = itemCard.cloneNode(true);
    newCard.dataset.itemId = itemId++; // Assign a new unique ID

    // Set the value of the select element to match the original
    var originalSelect = itemCard.querySelector('select');
    var newSelect = newCard.querySelector('select');
    newSelect.value = originalSelect.value;

    // Reassign event listeners with checks
    newCard.ondragstart = function(event) { dragStart(event, day); };
    var deleteButton = newCard.querySelector('.deleteButton');
    if (deleteButton) deleteButton.onclick = function() { deleteItem(this); };
    var titleInput = newCard.querySelector('.itemTitle');
    if (titleInput) titleInput.onchange = function() { updateItemProperty(this, 'title'); };
    if (newSelect) newSelect.onchange = function() { updateItemProperty(this, 'type'); };
    var costInput = newCard.querySelector('.itemCost');
    if (costInput) costInput.onchange = function() { updateItemProperty(this, 'cost'); };

    // Append the new card to the current column's items container
    var itemsContainer = currentColumn.querySelector('.itemsContainer');
    itemsContainer.appendChild(newCard);
}







function deleteItem(button) {
    var itemCard = button.closest('.itemCard');
    var itemId = itemCard.dataset.itemId; // Unique identifier for the item

    if (itemCard.classList.contains('everyday')) {
        // If it's an 'Everyday' item, delete only its duplicates
        var allEverydayItems = document.querySelectorAll(`.everyday[data-item-id="${itemId}"]`);
        allEverydayItems.forEach(item => {
            item.remove(); // Remove each item with the same itemId
        });
    } else {
        // If it's not an 'Everyday' item, just remove this item
        itemCard.remove();
    }

    updateTotal(); // Update the total after deletion
}


// ... (Rest of your drag and drop functions)


function dragStart(event, day) {
    event.dataTransfer.setData("text/plain", event.target.id);
    event.dataTransfer.effectAllowed = "move";
    event.target.style.opacity = '0.4'; // Optional: Change the opacity of the dragged item
}

function allowDrop(event) {
    event.preventDefault();
    var target = event.target;
    if (target.className === "itemsContainer") {
        var placeholder = document.createElement("div");
        placeholder.classList.add("placeholder");
        target.appendChild(placeholder);
    }
}

function drop(event, el) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text/plain");
    var draggedElement = document.getElementById(data);
    if (el.className === "itemsContainer") {
        el.insertBefore(draggedElement, el.querySelector('.placeholder'));
        draggedElement.style.opacity = '1'; // Reset the opacity
    }
    el.querySelector('.placeholder')?.remove();
    updateTotal();
}

// Call this function to reorder item IDs after drag-and-drop
function reorderItemIDs() {
    // Implementation to reorder IDs for draggable elements
}
    
    
function exportToCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Day,Title,Type,Cost\n"; // CSV Header

    const dayColumns = document.querySelectorAll('.dayColumn');
    dayColumns.forEach((column, dayIndex) => {
        const day = dayIndex + 1;
        const items = column.querySelectorAll('.itemCard');
        
        items.forEach(item => {
            const title = item.querySelector('.itemTitle').value.trim();
            const type = item.querySelector('select').value.trim();
            const cost = item.querySelector('.itemCost').value.trim();
            let row = `${day},${title},${type},${cost}\n`;
            csvContent += row;
        });
    });

    // Encoding and Downloading the CSV File
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "budget_data.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link);
}


