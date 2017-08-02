const fs = require('fs');
const brain = require('brain.js');

module.exports = {
  testing: function(net, testData, threshold) {
    const maxarg = array => {
      return array.indexOf(Math.max.apply(Math, array));
    };

    let truePositives = 0;
    let trueNegatives = 0;
    let falsePositives = 0;
    let falseNegatives = 0;

    for (let i = 0; i < testData.length; i++) {
      const result = net.run(testData[i].input);
      if (result.show >= threshold && testData[i].output.show === 1) {
        truePositives++;
      } else {
        falseNegatives++;
      }
    }

    const precision = truePositives / (truePositives + falsePositives);
    const recall = truePositives / (truePositives + falseNegatives);
    const f1 = 2 * (precision * recall / (precision + recall));
    return { precision, recall, f1 };
  }
};
