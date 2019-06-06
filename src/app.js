const express = require('express');
const app = express();
const fs = require('fs');
const config = fs.readFileSync('./config/config.json');
const AppleAuth = require('./apple-auth.js');
const AppleClientSecret = require("./token");

let auth = new AppleAuth(config, './config/AuthKey.p8');

app.get("/", (req, res) => {
    res.send(`<a href="${auth.loginURL()}">Sign in with Apple</a>`);
});

app.get('/token', (req, res) => {
    res.send(auth._tokenGenerator.generate());
});

app.get('/auth', async (req, res) => {
    try {
        const accessToken = await auth.accessToken(req.query.code);
        res.json(accessToken);
    } catch (ex) {
        console.error(ex);
        res.send("An error occurred!");
    }
});

app.get('/refresh', async (req, res) => {
    try {
        const accessToken = await auth.refreshToken(req.query.refreshToken);
        res.json(accessToken);
    } catch (ex) {
        console.error(ex);
        res.send("An error occurred!");
    }
});

app.listen(3000, () => {
    console.log("Listening on https://apple.exun.co");
})