const mimir = require('mimir');
const brain = require('brain.js');

class NeuralNet {
  constructor() {
    this.net = new window.brain.NeuralNetwork({
      hiddenLayers: [2],
      learningRate: 0.05
    });
    this.dict = null;

    this.train = this.train.bind(this);
    this.predict = this.predict.bind(this);
    this.saveToJSON = this.saveToJSON.bind(this);
    this.loadFromJSON = this.loadFromJSON.bind(this);
    this.isTrained = this.isTrained.bind(this);
  }

  isTrained() {
    return this.net && this.dict;
  }

  saveToJSON() {
    const netJSON = JSON.stringify(this.net.toJSON());
    const dictJSON = JSON.stringify(this.dict);
    return {netJSON, dictJSON};
  }

  loadFromJSON({netJSON, dictJSON}) {
    this.net.fromJSON(JSON.parse(netJSON));
    this.dict = JSON.parse(dictJSON);
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
    console.log(`training started with ${messagesShow.length + messagesHide.length} datapoints`);

    // create the traindata, which has classifications associated (Hide / Show)
    const traindata = [];
    messagesShow.forEach(msg => {
      traindata.push([mimir.bow(msg, this.dict), 1]);
    });
    messagesHide.forEach(msg => {
      traindata.push([mimir.bow(msg, this.dict), 0]);
    });

    // train our NN
    const ann_train = traindata.map(pair => ({
      input: pair[0],
      output: vec_result(pair[1], 2)
    }));
    return this.net.train(ann_train);
  }

  predict(message) {
    const maxarg = array => {
      return array.indexOf(Math.max.apply(Math, array));
    };

    if (typeof message !== 'string' || message.length < 1) {
      console.warn(`Invalid message for prediction: ${message}`);
      return 0;
    }

    if (!this.net || !this.dict || typeof this.net.run !== 'function') {
      console.error('Cant predict because: net | dict', this.net, this.dict);
      return 0;
    }

    const test_bow_message = mimir.bow(message, this.dict);
    const prediction = this.net.run(test_bow_message);
    //console.log(message, prediction);
    return maxarg(prediction);
  }
};

export default new NeuralNet();
