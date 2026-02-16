const express = require('express');
const router = express.Router();
const {getAllContacts,getAllMessages,sendMessage,getChatpartners} = require('../controllers/message.controller');
const authMiddleware = require('../middleware/middleware');
const arcjetProtection = require('../middleware/archjet.middleware');

router.use(arcjetProtection,authMiddleware);
router.get("/contacts",getAllContacts)
router.get("/chats",getChatpartners)
router.get("/:id",getAllMessages)

router.post("/send/:id",sendMessage)

module.exports = router;
