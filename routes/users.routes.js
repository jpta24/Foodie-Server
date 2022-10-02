const router = require("express").Router();

const User = require('../models/User.model');

router.get("/", (req, res, next) => {
    res.send('working too')
})

router.put("/", (req, res, next) => {
    const {image} = req.body;

});


module.exports = router;