const express = require('express');
const router = express.Router();
const { createItem, getItems, getItem, updateItem, deleteItem, getItemAvailability } = require('../controllers/itemController');
const auth = require('../middleware/authMiddleware');
const upload = require('../utils/upload');

router.post('/', auth, upload.array('images', 5), createItem);
router.get('/', getItems);
router.get('/:id', getItem);
router.get('/:id/availability', getItemAvailability);
router.put('/:id', auth, updateItem);
router.delete('/:id', auth, deleteItem);

module.exports = router;
