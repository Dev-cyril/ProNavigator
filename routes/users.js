const express = require('express');
const router = express.Router();

const {CreateUser, GetUserByEmail, GetUserById} = require('../controllers/userController')

router.post('/signup', CreateUser);
router.post('/signin', GetUserByEmail);
router.get('/api/user/:_id', GetUserById);

module.exports = router;