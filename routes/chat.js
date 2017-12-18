var express = require('express');
var router = express.Router();

var chats = {};

/* GET home page. */
router.get('/:chatid/:username', function(req, res, next) {
  const chatid = req.params.chatid;
  const username = req.params.username;
  if (chatid in chats == false){
    chats[chatid] = []
  }
  chats[chatid].push(username)
  console.log(chats)
  res.render('chat', { title: 'Express' });
});

module.exports = router;
