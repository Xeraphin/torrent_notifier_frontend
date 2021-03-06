const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");
const https = require("https");
const http = require("http");

//if www not in url, redirect
app.all(/.*/, (req, res, next) => {
    const host = req.headers["host"];
    if (host.match(/^www\..*/i)) {
        next();
    } else {
        res.redirect(301, "https://www." + host + req.url);
    }
});

app.use(express.static(path.join(__dirname, "build")));

app.get(["/","/reset_password"], (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "build", "index.html"));
});

https
    .createServer(
        {
            key: fs.readFileSync("private.key"),
            cert: fs.readFileSync("certificate.crt"),
            ca: fs.readFileSync("ca_bundle.crt"),
        },
        app
    )
    .listen(443, () => console.log("app working on port 443"));

//redirect http to https
http
    .createServer((req, res) => {
        res.writeHead(301, {
            Location: "https://" + req.headers["host"] + req.url,
        });
        res.end();
    })
    .listen(80, () => console.log("also 80"));
