const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const session = require('express-session');


app.use(cors());

app.use(express.json());


app.use(session({
    secret: 'geheimnisvollesGeheimnis',
    resave: false,
    saveUninitialized: true
}));

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const users = [
        { username: 'Yassin', password: '1234' }
    ];

    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        req.session.loggedIn = true;
        res.json({ message: 'Anmeldung erfolgreich' });
    } else {
        res.status(401).json({ message: 'Fehler bei der Anmeldung. Überprüfe deine Anmeldeinformationen.' });
    }
});

app.use(express.static(__dirname));




const items = [];

app.post('/add-item', (req, res) => {
    const { itemName, itemOwner, purchaseDate, itemCondition } = req.body;
    const newItem = {
        id: items.length + 1,
        itemName,
        itemOwner,
        purchaseDate,
        itemCondition,
    };
    items.push(newItem);
    res.json({ message: 'Gegenstand wurde hinzugefügt.', item: newItem });
});

app.get('/get-items', (req, res) => {
    res.json(items);
});

app.put('/edit-item/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const { itemName, itemOwner, purchaseDate, itemCondition } = req.body;

    const itemIndex = items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
        res.status(404).json({ message: 'Gegenstand nicht gefunden.' });
    } else {
        items[itemIndex] = {
            ...items[itemIndex],
            itemName,
            itemOwner,
            purchaseDate,
            itemCondition,
        };
        res.json({ message: 'Änderungen gespeichert.', item: items[itemIndex] });
    }
});

app.delete('/delete-item/:id', (req, res) => {
    const itemId = parseInt(req.params.id);

    const itemIndex = items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
        res.status(404).json({ message: 'Gegenstand nicht gefunden.' });
    } else {
        items.splice(itemIndex, 1);
        res.json({ message: 'Gegenstand wurde gelöscht.' });
    }
});

app.get('/', (req, res) => {
    res.send('Welcome to the Lagerverwaltungssystem!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
