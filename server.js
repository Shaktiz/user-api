const express = require('express');
const app = express();

app.use(express.json());

let users = [];

// Middleware: Logger
app.use((req, res, next) => {
    console.log(`${req.method} request at ${req.url}`);
    next();
});

// Middleware: Simple Authentication
app.use((req, res, next) => {
    const token = req.headers['auth'];

    if (token === "12345") {
        next();
    } else {
        res.status(401).send("Unauthorized");
    }
});

// Validation Function
function validateUser(user) {
    return user.name && user.email;
}

// GET all users
app.get('/users', (req, res) => {
    res.json(users);
});

// GET user by ID
app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id == req.params.id);

    if (!user) {
        return res.status(404).send("User not found");
    }

    res.json(user);
});

// POST - Add new user
app.post('/users', (req, res) => {
    if (!validateUser(req.body)) {
        return res.status(400).send("Invalid user data");
    }

    const newUser = {
        id: users.length + 1,
        name: req.body.name,
        email: req.body.email
    };

    users.push(newUser);
    res.send("User added successfully");
});

// PUT - Update user
app.put('/users/:id', (req, res) => {
    const user = users.find(u => u.id == req.params.id);

    if (!user) {
        return res.status(404).send("User not found");
    }

    if (!validateUser(req.body)) {
        return res.status(400).send("Invalid data");
    }

    user.name = req.body.name;
    user.email = req.body.email;

    res.send("User updated");
});

// DELETE - Remove user
app.delete('/users/:id', (req, res) => {
    const index = users.findIndex(u => u.id == req.params.id);

    if (index === -1) {
        return res.status(404).send("User not found");
    }

    users.splice(index, 1);
    res.send("User deleted");
});

// Start server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
