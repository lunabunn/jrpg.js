const gridWidth = 32;
const gridHeight = 32;
const frameRate = 60;

let app = new PIXI.Application({width: 544, height: 416});
document.body.appendChild(app.view);
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
window.addEventListener('resize', resize);
resize();
PIXI.Loader.shared.add('res/characters/tremel.png')
                  .add('res/tilesets/rmxp_tileset.png')
                  .add('res/se/voice.wav')
                  .load(setup);

var player;
var tileset, tilemap;
var triggers = [];

function setup() {
  tileset = Tilemap.getTileset(PIXI.Loader.shared.resources['res/tilesets/rmxp_tileset.png'].texture);
  tilemap = new Tilemap(app.stage, tileset, [[[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]], 17, 13);

  triggers.push(new Trigger(app.stage, 5, 5, tileset[19], {
    'main':[
      new TextboxEvent('I\'m just a patch of grass, nothing special about me.', 'Patch of Grass'),
      new DelayEvent(60),
      new TextboxEvent('...Seriously, there\'s nothing to look at here.', 'Patch of Grass'),
      new DelayEvent(120),
      new TextboxEvent('Pl-please, go away...', 'Patch of Grass')
    ]
  }));

  triggers.push(new Trigger(app.stage, 10, 5, tileset[281], {
    'main':[
      new TextboxEvent('A tree stump. There is an axe stuck in it.'),
      new SelectionEvent('Take out the axe?', [{'text': 'Yes', 'channel': 'takeAxe'}, {'text': 'No','channel': 'dontTakeAxe'}])
    ],
    'takeAxe':[
      new DelayEvent(120),
      new TextboxEvent('You try to take out the axe, but it is embeded too deeply into the stump.')
    ],
    'dontTakeAxe':[
      new TextboxEvent('Yeah, I don\'t think I\'ll need an axe anytime soon...', 'Player')
    ]
  }));

  player = new Player(app.stage, 0, 0, PIXI.Loader.shared.resources['res/characters/tremel.png'].texture);

  app.ticker.add(delta => update(delta));
}

function update(delta) {
  player.update(delta);
  for (var i=0; i<triggers.length; i++) {
    triggers[i].update(delta);
  }
}

function keyDown(e) {
  player.keyDown(e.code);
  for (var i=0; i<triggers.length; i++) {
    triggers[i].keyDown(e.code);
  }
}

function keyUp(e) {
  player.keyUp(e.code);
  for (var i=0; i<triggers.length; i++) {
    triggers[i].keyUp(e.code);
  }
}

function resize() {
  var windowRatio = window.innerWidth/window.innerHeight;
  var targetRatio = 17/13;
  if (windowRatio < targetRatio) {
    app.renderer.view.style.width = '100vw';
    app.renderer.view.style.height = 'auto';
  } else if (windowRatio > targetRatio) {
    app.renderer.view.style.width = 'auto';
    app.renderer.view.style.height = '100vh';
  }
}