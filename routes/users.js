const express = require('express');
const router = express.Router();

const {
  CreateUser,
  GetUserById,
  GetUserByEmail,
  UpdateUser,
  DeleteUser
} = require('../controllers/userController');

router.post('/signup', CreateUser);
router.post('/signin', GetUserByEmail);
router.get('/api/user/:_id', GetUserById);
router.put('/api/user/:_id/update', UpdateUser);
router.delete('/api/user/:_id/delete', DeleteUser);

module.exports = router;
