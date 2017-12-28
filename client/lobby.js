var SockSessionClient = require('../services/socksession-client');
var authSapi = require('../sapi/auth-sapi');
var lobbySapi = require('../sapi/lobby-sapi');


function $(id){
  return document.getElementById(id);
}

function textareaAddLine(id, message){
  var textarea = $(id);
  textarea.value += message;
  textarea.scrollTop = textarea.scrollHeight;
}

var ws = new WebSocket("ws://localhost:8080");
ws.onmessage = function(evt){
  var msg = JSON.parse(evt.data);
  console.log(msg)
  switch(msg.event){
    case 'chat/create/error':
    case 'chat/create/response':
      ws.send(JSON.stringify({
        event: 'chat/join/request',
        chatId: chatId,
        accountId: accountId
      }));
      break;
    case 'chat/join/response':
      textareaAddLine('chatwindow', "Joined\n");
      break;
    case 'chat/join/error':
      textareaAddLine('chatwindow', "Joining error:" + msg.error + "\n");
      break;
    case 'chat/message/notify':
      textareaAddLine('chatwindow', msg.accountId + ": " + msg.message + "\n");
      break;
    case 'chat/join/notify':
      textareaAddLine('chatwindow', msg.accountId + " joined\n");
      break;
    case 'chat/leave/notify':
      textareaAddLine('chatwindow', msg.accountId + " left\n");
      break;
    default:
      console.log("Unrecognized: " + JSON.stringify(evt));
  }
};

ws.onopen = function(){
  ws.send(JSON.stringify({
    event: 'chat/create/request',
    chatId: chatId,
    accountId: accountId
  }));
}

function submit(){
  ws.send(JSON.stringify({
    event: 'chat/message/request',
    message: $('editline').value
  }));
  $('editline').value = "";
}

var sessionClient = null;

function init(){
  sessionClient = new SockSessionClient(, null);
}

function join(lobbyId){
  sessionClient.sendAndWait({
    event: 'lobby/join/request',
    chatId: chatId,
    accountId: accountId
  }, 'lobby/join/response', 'lobby/join/error', timeout); 
}

function create(){
  sessionClient.sendAndWait({
    event: 'lobby/join/request',
    chatId: chatId,
    accountId: accountId
  }, 'lobby/join/response', 'lobby/join/error', timeout); 
}