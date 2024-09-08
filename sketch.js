let model
let targetLabel = 'C'

let state = 'collection'

function setup() {
    createCanvas(400, 400)


  env = new p5.Envelope();
  env.setADSR(0.05, 0.1, 0.5, 1);
  env.setRange(1.2, 0);

  wave = new p5.Oscillator();

  wave.setType('sine');
  wave.start();
  wave.freq(440);
  wave.amp(env);


    let options = {
        inputs: ['x', 'y'],
        outputs: ['label'],
        task: 'classification',
        debug: true,
    }
    model = ml5.neuralNetwork(options)
    background(255);
}

function keyPressed() {
    if (key == 't') {
        state = 'training'
        console.log('começou treinamento!')
        model.normalizeData()
        let options = {
            epochs: 200
        }
        model.train(options, whileTraining, finishedTraining)
    } else {
    targetLabel = key.toUpperCase()
}
}

function whileTraining(epoch, loss) {
    console.log(`epoch: ${epoch} loss: ${loss}`)

}

function finishedTraining() {
    console.log('acabou o treino.')
    state = 'prediction'
}

function mousePressed() {
    
    let inputs = {
        x: mouseX,
        y: mouseY
    }
    if (state == 'collection') {
        let target = {
            label: targetLabel
        }
        model.addData(inputs, target)
        stroke(0)
        noFill()
        ellipse(mouseX, mouseY, 24)
        fill(0)
        noStroke()
        textAlign(CENTER, CENTER)
        text(targetLabel, mouseX, mouseY)
        env.play()
    } else if (state == 'prediction') {
        model.classify(inputs, gotResults)
    }
} 


function gotResults(error, results) {
    if (error) {
        console.error(error)
        return
    }
    console.log(results)
    stroke(0, 0, 255, 100)
    noFill()
    ellipse(mouseX, mouseY, 24)
    fill(0)
    noStroke()
    textAlign(CENTER, CENTER)
    text(results[0].label, mouseX, mouseY)
}