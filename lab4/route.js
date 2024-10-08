const express = require('express');
const path = require('path');
const router = express.Router();
const PORT = process.env.PORT || 4000;

const dictionary = {};
let requestCount = 0;

//app.use(express.json());

const cors = require('cors');
router.use(cors());
router.options('*', cors());

const utils = require("./modules/utils");
//const messages = require("./lang/en/en");

router.get("/api/definitions/", (req, res) => {
    requestCount++;

    let word = req.query.word;

    if(word === undefined || !(word in dictionary))
    {
        let message = `Request #${requestCount}, word '${word}' not found.`;
        res.writeHead(404, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*"});
        res.end(message);
        return;
    }

    let response = `Request #${requestCount}, ${word}: ${dictionary[word]}`
    res.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*"});
    res.end(response);
});

router.post("/api/definitions", (req, res) => {
    requestCount++;

    console.log(req.body);

    let word = req.body.word;
    let definition = req.body.definition;

    if(word === undefined || definition === undefined)
        {
            let message = `Request #${requestCount}, word: '${word}' or definition: '${definition}' is not valid.`;
            res.writeHead(400, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*"});
            res.end(message);
            return;
        }

    else if(word in dictionary) {
        let message = `Request #${requestCount}, a definition for ${word} already exists.`;
        res.writeHead(400, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*"});
        res.end(message);
        return;
    }

    else {
        let message = `Request #${requestCount}, definition added for ${word}. Updated: ${utils.getCurrentDate()}`;

        dictionary[word] = definition;

        res.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*"});
        res.end(message);
    }
})

module.exports = router;