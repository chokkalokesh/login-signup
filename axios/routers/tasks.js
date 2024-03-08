const express = require('express')
const router = express.Router()
const {gettask , createtask, sendotp} = require("../controllers/tasks")

router.route('/login').post(gettask)
router.route('/signup').post(createtask)
router.route('/verify-otp').post(sendotp)


module.exports = router