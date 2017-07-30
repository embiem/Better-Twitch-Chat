const _ = require('lodash');
const mimir = require('mimir');
const brain = require('brain.js');
const messages = require('./btc_messages-dataset.json');

// suffle & split into 80% training & 20% testing set
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
messagesShow = _.shuffle(messagesShow);
messagesHide = _.shuffle(messagesHide);

// create a dict containing all text instances
const dict = mimir.dict([...messagesShow, ...messagesHide]);

// create the train/test split
const trainShowSize = Math.floor(messagesShow.length * 0.8);
const trainHideSize = Math.floor(messagesHide.length * 0.8);

const train_messagesShow = messagesShow.slice(0, trainShowSize);
const train_messagesHide = messagesHide.slice(0, trainHideSize);
const test_messagesShow = messagesShow.slice(trainShowSize);
const test_messagesHide = messagesHide.slice(trainHideSize);

// create the traindata, which has classifications associated (Hide / Show)
const traindata = [];
train_messagesShow.forEach(msg => {
  traindata.push([mimir.bow(msg, dict), 1]);
});
train_messagesHide.forEach(msg => {
  traindata.push([mimir.bow(msg, dict), 0]);
});

// final train-data representation
const ann_train = traindata.map(pair => ({
  input: pair[0],
  output: pair[1] === 1 ? { show: 1 } : { hide: 1 }
}));

// build & train NN's with different settings (learning rate, hidden layers etc)

// Default: hiddenLayers: [3, 8, 4]
const netDefault = new brain.NeuralNetwork({ hiddenLayers: [3, 8, 4] });
const netDefaultResult = netDefault.train(ann_train, {
  log: true,
  logPeriod: 10
});
console.log('netDefault train result: ', netDefaultResult);

const netDefaultLrLow = new brain.NeuralNetwork({
  hiddenLayers: [3, 8, 4],
  learningRate: 0.05
});
const netDefaultLrLowResult = netDefaultLrLow.train(ann_train, {
  log: true,
  logPeriod: 10
});
console.log('netDefaultLrLow" train result: ', netDefaultLrLowResult);

const netDefaultLrHigh = new brain.NeuralNetwork({
  hiddenLayers: [3, 8, 4],
  learningRate: 0.6
});
const netDefaultLrHighResult = netDefaultLrHigh.train(ann_train, {
  log: true,
  logPeriod: 10
});
console.log('netDefaultLrHigh train result: ', netDefaultLrHighResult);



// Deep: hiddenLayers: [6, 16, 8]
const netDeep = new brain.NeuralNetwork({ hiddenLayers: [6, 16, 8] });
const netDeepResult = netDeep.train(ann_train, { log: true, logPeriod: 10 });
console.log('netDeep train result: ', netDeepResult);



// Flat: hiddenLayers: [2]
const netFlat = new brain.NeuralNetwork({ hiddenLayers: [2] });
const netFlatResult = netFlat.train(ann_train, { log: true, logPeriod: 10 });
console.log('netFlat train result: ', netFlatResult);

const netFlatLrLow = new brain.NeuralNetwork({
  hiddenLayers: [2],
  learningRate: 0.05
});
const netFlatLrLowResult = netFlatLrLow.train(ann_train, { log: true, logPeriod: 10 });
console.log('netFlatLrLow train result: ', netFlatLrLowResult);


// Flat & Wide: hiddenLayers: [2, 2, 2]
const netFlatWide = new brain.NeuralNetwork({ hiddenLayers: [2, 2, 2] });
const netFlatWideResult = netFlatWide.train(ann_train, { log: true, logPeriod: 10 });
console.log('netFlatWide train result: ', netFlatWideResult);

const netFlatWideLrLow = new brain.NeuralNetwork({
  hiddenLayers: [2, 2, 2],
  learningRate: 0.05
});
const netFlatWideLrLowResult = netFlatWideLrLow.train(ann_train, { log: true, logPeriod: 10 });
console.log('netFlatWideLrLow train result: ', netFlatWideLrLowResult);


// measure their performance by predicting on testing set & use F1 score
const testing = function(net) {
  const predict = function(message) {
    const maxarg = array => {
      return array.indexOf(Math.max.apply(Math, array));
    };

    const test_bow_message = mimir.bow(message, dict);
    const prediction = net.run(test_bow_message);
    //console.log(message, prediction);
    return prediction;
  };

  let truePositives = 0;
  let trueNegatives = 0;
  let falsePositives = 0;
  let falseNegatives = 0;

  for (let i = 0; i < test_messagesShow.length; i++) {
    const result = predict(test_messagesShow[i]);
    if (result.show > result.hide) {
      truePositives++;
    } else {
      falseNegatives++;
    }
  }

  for (let i = 0; i < test_messagesHide.length; i++) {
    const result = predict(test_messagesHide[i]);
    if (result.hide > result.show) {
      trueNegatives++;
    } else {
      falsePositives++;
    }
  }

  const precision = truePositives / (truePositives + falsePositives);
  const recall = truePositives / (truePositives + falseNegatives);
  const f1 = 2 * (precision * recall / (precision + recall));
  return { precision, recall, f1 };
};

const netDefaultTestResult = testing(netDefault);
console.log('netDefaultTestResult: ', netDefaultTestResult);

const netDefaultLrLowTestResult = testing(netDefaultLrLow);
console.log('netDefaultLrLowTestResult: ', netDefaultLrLowTestResult);

const netDefaultLrHighTestResult = testing(netDefaultLrHigh);
console.log('netDefaultLrHighTestResult: ', netDefaultLrHighTestResult);

const netDeepTestResult = testing(netDeep);
console.log('netDeepTestResult: ', netDeepTestResult);

const netFlatTestResult = testing(netFlat);
console.log('netFlatTestResult: ', netFlatTestResult);

const netFlatLrLowTestResult = testing(netFlatLrLow);
console.log('netFlatLrLowTestResult: ', netFlatLrLowTestResult);

const netFlatWideTestResult = testing(netFlatWide);
console.log('netFlatWideTestResult: ', netFlatWideTestResult);

const netFlatWideLrLowTestResult = testing(netFlatWideLrLow);
console.log('netFlatWideLrLowTestResult: ', netFlatWideLrLowTestResult);

// report the score for each NN setting
