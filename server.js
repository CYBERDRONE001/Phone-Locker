const express = require('express');
const bodyParser = require('body-parser');
const speakeasy = require('speakeasy');
const crypto = require('crypto');
const session = require('express-session');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Use environment variables for secrets
const TWO_FA_SECRET = process.env.TWO_FA_SECRET || '14072008';
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(16).toString('hex');
const USER_PASSWORD = process.env.USER_PASSWORD || 'Aliu';
const OWNER_NAME = 'Abdulwajud';

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // For production, set secure: true if using HTTPS
}));

// Simulate a database
const users = {
    user1: { password: USER_PASSWORD, phoneLocation: 'Unknown', isLocked: false }
};

// Middleware to check if the user is the owner
function checkOwner(req, res, next) {
    const { isOwner } = req.body;
    if (isOwner === true) {
        next();
    } else {
        res.status(401).send({ error: 'Unauthorized' });
    }
}

app.post('/check-owner', (req, res) => {
    const { ownerName } = req.body;
    if (ownerName === OWNER_NAME) {
        res.status(200).send({ success: true });
    } else {
        // Lock the phone if the owner name is incorrect
        lockPhone();
        res.status(401).send({ success: false });
    }
});

app.post('/login', isAuthenticated, (req, res) => {
    const { username, password } = req.body;
    if (users[username] && users[username].password === password) {
        req.session.username = username;
        req.session.authenticated = false; // Not authenticated until 2FA is verified
        res.status(200).send({ success: true, requires2FA: true });
    } else {
        res.status(401).send({ success: false });
    }
});

app.post('/verify-2fa', (req, res) => {
    const { token } = req.body;
    const verified = speakeasy.totp.verify({
        secret: TWO_FA_SECRET,
        encoding: 'base32',
        token: token
    });

    if (verified) {
        req.session.authenticated = true;
        res.status(200).send({ success: true });
    } else {
        res.status(401).send({ success: false });
    }
});

function isAuthenticated(req, res, next) {
    if (req.session.username && req.session.authenticated) {
        next();
    } else {
        res.status(403).send({ error: 'Not authenticated' });
    }
}

app.get('/track', isAuthenticated, (req, res) => {
    const { username } = req.session;
    if (users[username]) {
        res.status(200).send({ location: users[username].phoneLocation });
    } else {
        res.status(404).send({ error: 'User not found' });
    }
});

app.post('/lock', isAuthenticated, (req, res) => {
    lockPhone();
    res.status(200).send({ success: true });
});

function lockPhone() {
    const username = Object.keys(users)[0]; // Assuming there's only one user
    if (users[username]) {
        users[username].isLocked = true;
    }
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});