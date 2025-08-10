const express = require('express');
const router = express.Router();
const { createOrUpdateUser, searchUserByEmail, getAllUsers } = require('../controllers/userController');

router.post('/upsert', createOrUpdateUser);    
router.get('/search', searchUserByEmail);       
router.get('/all', getAllUsers);                 

module.exports = router;
