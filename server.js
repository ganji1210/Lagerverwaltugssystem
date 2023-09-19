const express = require('express');
const sessions = require('express-session');
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;
const oneDay = 1000 * 60 * 60 * 24;

let session;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(__dirname));

app.use(sessions({
    secret: 'geheimnisvollesGeheimnis',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: oneDay },
}));

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const users = [
        { username: 'Yassin', password: '1234' }
    ];

    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        req.session.loggedIn = true;
        return res.status(200).json({ message: 'Anmeldung erfolgreich' });
    } else {
        return res.status(401).json({ message: 'Fehler bei der Anmeldung. Überprüfe deine Anmeldeinformationen.' });
    }
});

const items = [];

app.post('/add-item', (req, res) => {
    session = req.session;
    if (!session.loggedIn)
        res.status(403).end('session expired');
    const { itemName, itemOwner, purchaseDate, itemCondition } = req.body;
    const newItem = {
        id: items.length + 1,
        itemName,
        itemOwner,
        purchaseDate,
        itemCondition,
    };
    items.push(newItem);
    return res.status(201).json({ message: 'Gegenstand wurde hinzugefügt.', item: newItem });
});

app.get('/get-items', (req, res) => {
    session = req.session;
    if (!session.loggedIn)
        res.status(403).end('session expired');
    return res.status(200).json(items);
});

app.put('/edit-item/:id', (req, res) => {
    session = req.session;
    if (!session.loggedIn)
        res.status(403).end('session expired');

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
        return res.status(201).json({ message: 'Änderungen gespeichert.', item: items[itemIndex] });
    }
});

app.delete('/delete-item/:id', (req, res) => {
    session = req.session;
    if (!session.loggedIn)
        res.status(403).end('session expired');
    const itemId = parseInt(req.params.id);

    const itemIndex = items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
        return res.status(404).json({ message: 'Gegenstand nicht gefunden.' });
    } else {
        items.splice(itemIndex, 1);
        return res.status(204).json({ message: 'Gegenstand wurde gelöscht.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
