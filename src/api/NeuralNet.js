const mimir = require('mimir');
const brain = require('brain');

class NeuralNet {
  constructor() {
    this.net = null;
    this.dict = null;
  }

  train(messagesShow, messagesHide) {
    const vec_result = (res, num_Classes) => {
      var i = 0,
        vec = [];
      for (i; i < num_Classes; i += 1) {
        vec.push(0);
      }
      vec[res] = 1;
      return vec;
    };

    // create a dict containing all text instances
    this.dict = mimir.dict([...messagesShow, ...messagesHide]);

    // create the traindata, which has classifications associated (Hide / Show)
    const traindata = [];
    messagesShow.forEach(msg => {
      traindata.push([mimir.bow(msg, this.dict), 1]);
    });
    messagesHide.forEach(msg => {
      traindata.push([mimir.bow(msg, this.dict), 0]);
    });

    // train our NN
    this.net = new brain.NeuralNetwork({
      hiddenLayers: [3, 8, 4]
    });
    const ann_train = traindata.map(pair => ({
      input: pair[0],
      output: vec_result(pair[1], 2)
    }));
    this.net.train(ann_train);
  }

  predict(message) {
    const maxarg = array => {
      return array.indexOf(Math.max.apply(Math, array));
    };

    if (typeof message !== 'string' || message.length < 1) {
      console.warn(`Invalid message for prediction: ${message}`);
      return 0;
    }

    if (this.net && typeof this.net.run === 'function') {
      const test_bow_message = mimir.bow(message, this.dict);
      const prediction = this.net.run(test_bow_message);
      //console.log(message, prediction);
      return maxarg(prediction);
    } else {
      return 0;
    }
  }
};

export default new NeuralNet();
