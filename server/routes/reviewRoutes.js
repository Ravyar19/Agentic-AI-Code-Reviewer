const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

router.post("/review-code", reviewController.handleCodeReview);
module.exports = router;
