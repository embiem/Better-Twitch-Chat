const messages = require('./btc_messages-dataset.json');
const mimir = require('mimir');
const fs = require('fs');
const _ = require('lodash');

let messagesShow = [];
let messagesHide = [];
for (let key in messages) {
  const msg = messages[key];
  if (msg.liked) {
    messagesShow.push(msg.message);
  } else {
    messagesHide.push(msg.message);
  }
}

// create a dict containing all text instances
const dictShow = mimir.dict(messagesShow);
const dictHide = mimir.dict(messagesHide);

// fs.writeFile('dictShow.json', JSON.stringify(dictShow));
// fs.writeFile('dictHide.json', JSON.stringify(dictHide));

const dictShowSorted = Object.keys(dictShow.dict).sort(function(a, b) {
  return dictShow.dict[b] - dictShow.dict[a];
});
const dictHideSorted = Object.keys(dictHide.dict).sort(function(a, b) {
  return dictHide.dict[b] - dictHide.dict[a];
});

console.log(dictShowSorted.slice(0, 10));
console.log(dictHideSorted.slice(0, 10));

const showWordCount = [], hideWordCount = [];
dictShowSorted.forEach(key => showWordCount.push({word: key, count: dictShow.dict[key]}));
dictHideSorted.forEach(key => hideWordCount.push({word: key, count: dictHide.dict[key]}));

// fs.writeFile('showWordCount.json', JSON.stringify(showWordCount));
// fs.writeFile('hideWordCount.json', JSON.stringify(hideWordCount));
