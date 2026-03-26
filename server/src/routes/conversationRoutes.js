const { Router } = require('express');
const { saveConversation, getConversations, deleteConversation } = require('../controllers/conversationController');

const router = Router();

router.post('/conversations', saveConversation);
router.get('/conversations', getConversations);
router.delete('/conversations/:id', deleteConversation);

module.exports = router;
