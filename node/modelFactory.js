const fs = require('fs');
const brain = require('brain.js');
const mimir = require('mimir');
const _ = require('lodash');
const testing = require('./modelTesting').testing;

let dataFlat = require('./out/dataFlat.json');
let dataLabels = require('./out/dataLabels.json');
let dictData = require('./out/dictData.json');
let dictLabels = require('./out/dictLabels.json');

// create final train-data representation using one-hot encoded arrays
const allData = [];
dataFlat.forEach((entry, idx) => {
  allData.push({
    input: mimir.bow(entry, dictData),
    output: mimir.bow(dataLabels[idx], dictLabels)
  });
});

// don't need those anymore
dictData = null;
dictLabels = null;
dataFlat = null;
dataLabels = null;
global.gc();

// split into train & test data
const trainSize = Math.floor(allData.length * 0.8);

const hyperParamTuning = function(layerParams, learningRateParams, folds, threshold) {
  brain.NeuralNetwork.defaults.binaryThresh = threshold;
  
  const tuningResults = {};

  for (let fold = 0; fold < folds; fold++) {
    const shuffledData = _.shuffle(allData);
    const traindata = shuffledData.slice(0, trainSize);
    const testdata = shuffledData.slice(trainSize);

    console.log(`---------- Fold: ${fold + 1} ----------`);
    for (let layers of layerParams) {
      for (let lr of learningRateParams) {
        console.log(`## Layers: ${JSON.stringify(layers)} | LR: ${lr}`);
        // create the net
        const net = new brain.NeuralNetwork({
          hiddenLayers: layers,
          learningRate: lr
        });

        // train the net
        const trainResult = net.train(traindata, {
          errorThresh: 0.005,
          iterations: 10000,
          log: true,
          logPeriod: 100
        });
        console.log(
          `#### Train-Result: ${JSON.stringify(trainResult)}`
        );

        // test the net
        const testResult = testing(net, testdata, threshold);
        console.log(`#### Test-Result: ${JSON.stringify(testResult)}`);

        const netName = `net_layers${JSON.stringify(layers).replace(
          /[^a-z0-9]/gi,
          '-'
        )}_lr${JSON.stringify(lr).replace(/[^a-z0-9]/gi, '-')}`;

        // write net to file
        fs.writeFileSync(
          `./out/nets/${fold + 1}_${netName}.json`,
          JSON.stringify(net.toJSON())
        );

        // save all the results per fold
        if (!_.has(tuningResults, netName)) {
          tuningResults[netName] = {
            trainResults: [],
            testResults: []
          };
        }
        tuningResults[netName].trainResults.push(trainResult);
        tuningResults[netName].testResults.push(testResult);
      }
    }
  }
  // write all results to file
  fs.writeFileSync(
    `./out/tuningResults.json`,
    JSON.stringify(tuningResults, null, 2)
  );
};

hyperParamTuning(
  [
    [2]
  ],
  [0.1, 0.05],
  4,
  0.4
);
