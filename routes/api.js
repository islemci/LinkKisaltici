require("dotenv").config();
const express = require("express");
const shortid = require("shortid");

const router = express.Router();

const db = require("../db_connect");

const baseURL = process.env.baseURL || `https://linkshortener.cuurle.repl.co/`;

router.get("/all", (req, res) => {
  db.find({}, (err, docs) => {
    if (!err) {
      res.send(docs);
    } else {
      res.status(500).send({
        err
      });
    }
  });
});

router.post("/create", (req, res) => {
  if (req.body.URL) {
    let URL = req.body.URL;
    if (
      /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
        URL
      )
    ) {
      db.findOne(
        {
          URL: req.body.URL
        },
        (err, fndURL) => {
          if (err) {
            res.status(500).send({
              err
            });
          } else {
            if (!fndURL) {
              let ID = shortid.generate();
              let shortenedLink = baseURL + "/api/" + ID;
              let URLobject = {
                ID,
                URL: req.body.URL,
                shortened_url: shortenedLink
              };
              db.insert(URLobject, (err, newObj) => {
                if (!err) {
                  res.status(201).send(newObj);
                } else {
                  res.status(500).send({
                    err
                  });
                }
              });
            } else {
              res.status(201).send(fndURL);
            }
          }
        }
      );
    } else
      res.status(400).json({
        msg: "Hatalı URL"
      });
  } else {
    res.status(400).json({
      msg: "Geçersiz URL"
    });
  }
});

router.get("/:id", (req, res) => {
  db.findOne(
    {
      ID: req.params.id
    },
    (err, doc) => {
      if (err) {
        res.status(500).send({
          err
        });
      } else {
        res.redirect(doc.URL);
      }
    }
  );
});

module.exports = router;
