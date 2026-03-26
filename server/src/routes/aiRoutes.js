const { Router } = require('express');
const { askAi } = require('../controllers/aiController');

const router = Router();

router.post('/ask-ai', askAi);

module.exports = router;
