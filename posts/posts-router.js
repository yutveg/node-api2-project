const express = require("express");

const Posts = require("../data/db.js");

const router = express.Router();

router.post("/", (req, res) => {
  if (!req.body.title || !req.body.contents) {
    res.status(404).json({
      errorMessage: "Please provide title and contents for the post."
    });
  } else
    Posts.insert(req.body)
      .then(info => {
        res.status(200).json(req.body);
      })
      .catch(err => {
        if (!req.body.title || !req.body.content) {
          res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
          });
        } else {
          res.status(500).json({
            error: "There was an error while saving the post to the database"
          });
        }
      });
});

router.post("/:id/comments", (req, res) => {
  if (!req.body.text) {
    res
      .status(400)
      .json({ errorMessage: "Please provide text for the comment." });
  } else {
    Posts.insertComment({ text: req.body.text, post_id: req.params.id })
      .then(info => {
        res.status(201).json(req.body);
      })
      .catch(err => {
        if (Posts.findById(req.params.id)[0] === undefined) {
          res.status(404).json({ error: "Could not find post with that ID." });
        } else
          res.status(500).json({
            error: "There was an error while saving the comment to the database"
          });
      });
  }
});

router.get("/", (req, res) => {
  Posts.find(req.query)
    .then(info => {
      res.status(200).json(info);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

router.get("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then(info => {
      if (info[0] === undefined) {
        res
          .status(404)
          .json({ error: "A post with that ID could not be found" });
      } else {
        res.status(200).json(info);
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

router.get("/:id/comments", (req, res) => {
  Posts.findPostComments(req.params.id)
    .then(info => {
      if (info[0] === undefined) {
        res.status(404).json({ error: "No comments found for this post ID." });
      }
      res.status(200).json(info);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The comments information could not be retrieved." });
    });
});

router.delete("/:id", (req, res) => {
  Posts.remove(req.params.id)
    .then(info => {
      if (info === 0) {
        res.status(404).json({ error: "Could not find post with this ID" });
      }
      res.status(200).json(info);
    })
    .catch(err => {
      res.status(500).json({ error: "The post could not be removed" });
    });
});

router.put("/:id", (req, res) => {
  if (!req.body.title || !req.body.contents) {
    res
      .status(400)
      .json({ error: "Please provide title and contents for the post." });
  } else {
    Posts.update(req.params.id, req.body)
      .then(info => {
        if (info === 1) {
          res.status(200).json({ message: "Update successful." });
        } else {
          res
            .status(404)
            .json({ error: "The post for this ID could not be found" });
        }
      })
      .catch(err => {
        res.status(500).json({ error: "The post could not be updated." });
      });
  }
});

module.exports = router;
