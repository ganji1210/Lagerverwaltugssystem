const addItemForm = document.getElementById('addItemForm');
const itemList = document.getElementById('itemList');

addItemForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const itemName = document.getElementById('itemName').value;
    const itemOwner = document.getElementById('itemOwner').value;
    const purchaseDate = document.getElementById('purchaseDate').value;
    const itemCondition = document.getElementById('itemCondition').value;

    const response = await fetch('http://localhost:3000/add-item', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            itemName,
            itemOwner,
            purchaseDate,
            itemCondition,
        }),
    });

    if (response.ok) {
        alert('Gegenstand wurde hinzugefügt.');
        loadItems();
    } else {
        if (response.status === 403) {
            alert('Session ist abgelaufen');
            window.location.href = 'login.html';
            window.history.forward();
        }
        alert('Etwas ist schief gelaufen.');
    }
});
itemList.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-item')) {
        const itemId = e.target.getAttribute('data-item-id');
        deleteItem(itemId);
    } else if (e.target.classList.contains('edit-item')) {
        const itemId = e.target.getAttribute('data-item-id');
        editItem(itemId);
    } else if (e.target.classList.contains('save-item')) {
        const itemId = e.target.getAttribute('data-item-id');
        saveItem(itemId);
    }
});

async function deleteItem(itemId) {
    const response = await fetch(`http://localhost:3000/delete-item/${itemId}`, {
        method: 'DELETE',
    })
    if (response.ok) {
        alert('Gegenstand wurde gelöscht.');
        loadItems();
    } else {
        if (response.status === 403) {
            alert('Session ist abgelaufen');
            window.location.href = 'login.html';
            window.history.forward();
        }
        alert('Etwas ist schief gelaufen.');
    }
}

function editItem(itemId) {
    const row = document.querySelector(`tr[data-item-id="${itemId}"]`);
    const itemNameElement = row.querySelector('.item-name');
    const itemOwnerElement = row.querySelector('.item-owner');
    const purchaseDateElement = row.querySelector('.purchase-date');
    const itemConditionElement = row.querySelector('.item-condition');

    itemNameElement.contentEditable = true;
    itemOwnerElement.contentEditable = true;
    purchaseDateElement.innerHTML = `<input type="date" class="edit-purchase-date" value="${purchaseDateElement.textContent}">`;
    itemConditionElement.contentEditable = true;

    row.querySelector('.edit-item').style.display = 'none';
    row.querySelector('.delete-item').style.display = 'none';
    row.querySelector('.save-item').style.display = 'inline';
}

async function saveItem(itemId) {
    const row = document.querySelector(`tr[data-item-id="${itemId}"]`);
    const itemName = row.querySelector('.item-name').textContent;
    const itemOwner = row.querySelector('.item-owner').textContent;
    const purchaseDate = row.querySelector('.edit-purchase-date').value;
    const itemCondition = row.querySelector('.item-condition').textContent;

    const response = await fetch(`http://localhost:3000/edit-item/${itemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            itemName,
            itemOwner,
            purchaseDate,
            itemCondition,
        }),
    });

    if (response.ok) {
        alert('Änderungen gespeichert.');
        loadItems();
    } else {
        if (response.status === 403) {
            alert('Session ist abgelaufen');
            window.location.href = 'login.html';
            window.history.forward();
        }
        alert('Etwas ist schief gelaufen.');
    }
}

async function loadItems() {
    const response = await fetch('http://localhost:3000/get-items');
    if (response.ok) {
        const data = await response.json();

        document.getElementById('itemList').innerHTML = '';

        data.forEach(item => {
            const row = document.createElement('tr');
            row.setAttribute('data-item-id', item.id);

            row.innerHTML = `
            <td class="item-name" contenteditable="false">${item.itemName}</td>
            <td class="item-owner" contenteditable="false">${item.itemOwner}</td>
            <td class="purchase-date" contenteditable="false">${item.purchaseDate}</td>
            <td class="item-condition" contenteditable="false">${item.itemCondition}</td>
            <td>
                <button class="edit-item" data-item-id="${item.id}">Bearbeiten</button>
                <button class="delete-item" data-item-id="${item.id}">Löschen</button>
                <button class="save-item" data-item-id="${item.id}" style="display: none;">Speichern</button>
            </td>
        `;

            document.getElementById('itemList').appendChild(row);
        });
    } else {
        window.location.href = 'login.html';
        window.history.forward();
    }
}

loadItems();