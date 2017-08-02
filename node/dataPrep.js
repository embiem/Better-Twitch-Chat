const fs = require('fs');
const mimir = require('mimir');
const _ = require('lodash');

const data = require('./btc_messages-dataset.json');

const dataFlat = [];
const dataLabels = [];

for (let key in data) {
  dataFlat.push(data[key].message);
  dataLabels.push(data[key].liked ? 'show' : 'hide');
}

const dictData = mimir.dict(dataFlat);
const dictLabels = mimir.dict(dataLabels);

// remove all data that occurs only once
for (let key in dictData.dict) {
  if (dictData.dict[key] <= 2) {
    delete dictData.dict[key];
    _.remove(dictData.words, w => w === key);
    _.remove(dataFlat, w => w === key);
  }
}

fs.writeFileSync('./out/dictData.json', JSON.stringify(dictData, null, 2));
fs.writeFileSync('./out/dictLabels.json', JSON.stringify(dictLabels, null, 2));

fs.writeFileSync('./out/dataFlat.json', JSON.stringify(dataFlat));
fs.writeFileSync('./out/dataLabels.json', JSON.stringify(dataLabels));
