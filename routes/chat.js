var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/:chatId/:accountId', function(req, res, next) {
  const chatId = req.params.chatId;
  const accountId = req.params.accountId;

  res.render('chat', { title: 'Express', chatId : chatId, accountId : accountId });
});

module.exports = router;
