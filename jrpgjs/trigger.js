class Event {
  play(trigger) {
    this.trigger = trigger;
  }

  update(delta) {
    //
  }

  keyDown(key) {
    //
  }

  keyUp(key) {
    //
  }
}

class TextboxEvent extends Event {
  constructor(message, name='', voice) {
    super();
    this.container = new PIXI.Container();
    this.container.y = viewportHeight - Math.round(viewportHeight * 0.4);
    this.container.z = Number.MAX_VALUE;
    this.message = message;
    this.voice = voice;
    
    var bgRect = new PIXI.NineSlicePlane(PIXI.Loader.shared.resources['nineslice'].texture, 17, 17, 17, 17);
    bgRect.width = viewportWidth;
    bgRect.height = viewportHeight - this.container.y;
    this.container.addChild(bgRect);

    if (name) {
      var nameText = new PIXI.Text(`[ ${name} ]`, new PIXI.TextStyle({
        fontFamily: 'Raleway',
        fontSize: 18,
        fontWeight: 600,
        fill: '#FFFFFF',
        wordWrap: true,
        wordWrapWidth: 524
      }));
      nameText.x = 10;
      nameText.y = 10;
      this.container.addChild(nameText);
    }

    this.text = new PIXI.Text('', new PIXI.TextStyle({
      fontFamily: 'Raleway',
      fontSize: 18,
      fontWeight: 200,
      fill: '#FFFFFF',
      wordWrap: true,
      wordWrapWidth: 524
    }));
    this.text.x = 10;
    this.text.y = 30;
    this.container.addChild(this.text);
    
    this.container.visible = false;
    app.stage.addChild(this.container);
  }

  play(trigger) {
    super.play(trigger);
    
    this.container.visible = true;
    this.reveal = 0;
    this.timer = 0;
    this.text.text = '';
  }

  update(delta) {
    if (this.reveal == this.message.length) return;
    this.timer += delta;
    if (this.timer >= 3) {
      this.timer = 0;

      this.reveal ++;
      this.text.text = this.message.substring(0, this.reveal);

      var charAt = this.message.charAt(this.reveal - 1);
      if (charAt != ' ' &&
          charAt != '-') {
        if (this.voice) this.voice.play();
      }
    }
  }

  keyDown(key) {
    if (key == 'KeyZ') {
      if (this.reveal == this.message.length) {
        this.container.visible = false;
        this.trigger.done();
      } else {
        this.reveal = this.message.length;
        this.text.text = this.message.substring(0, this.reveal);
      }
    }
  }
}

class SelectionEvent extends Event {
  constructor(message, options, name='', voice, selection=0) {
    super();
    this.container = new PIXI.Container();
    this.container.y = viewportHeight - Math.round(viewportHeight * 0.4);
    this.container.z = Number.MAX_VALUE;
    this.message = message;
    this.options = options;
    this.defaultSelection = selection;
    this.voice = voice;
    
    var bgRect = new PIXI.NineSlicePlane(PIXI.Loader.shared.resources['nineslice'].texture, 17, 17, 17, 17);
    bgRect.width = viewportWidth;
    bgRect.height = viewportHeight - this.container.y;
    this.container.addChild(bgRect);

    if (name != '') {
      var nameText = new PIXI.Text(name, new PIXI.TextStyle({
        fontFamily: 'Raleway',
        fontSize: 18,
        fontWeight: 600,
        fill: '#FFFFFF',
        wordWrap: true,
        wordWrapWidth: 524
      }));
      nameText.x = 10;
      nameText.y = 10;
    }

    this.text = new PIXI.Text('', new PIXI.TextStyle({
      fontFamily: 'Raleway',
      fontSize: 18,
      fontWeight: 200,
      fill: '#FFFFFF',
      wordWrap: true,
      wordWrapWidth: 524
    }));
    this.text.x = 10;
    this.text.y = 30;
    this.container.addChild(this.text);

    var optionTextStyle = new PIXI.TextStyle({
      fontFamily: 'Raleway',
      fontSize: 16,
      fontWeight: 200,
      fill: '#FFFFFF',
      wordWrap: true,
      wordWrapWidth: 524
    });

    this.optionRects = [];
    for (var i=0; i<options.length; i++) {
      var temp = new PIXI.Text(options[i].text, optionTextStyle);
      temp.x = viewportWidth - Math.round(viewportWidth * 0.25) + 8;
      temp.y = 32 * (i - options.length) + 8;

      var optionRect = new PIXI.NineSlicePlane(PIXI.Loader.shared.resources['nineslice'].texture, 17, 17, 17, 17);
      this.optionRects.push(optionRect);

      this.container.addChild(optionRect);
      this.container.addChild(temp);
    }
    
    this.container.visible = false;
    app.stage.addChild(this.container);
  }

  play(trigger) {
    super.play(trigger);
    
    this.reveal = 0;
    this.timer = 0;
    this.selection = this.defaultSelection;
    this.text.text = '';

    for (var i=0; i<this.optionRects.length; i++) {
      var notSelected = (i != this.selection);

      this.optionRects[i].x = viewportWidth - Math.round(viewportWidth * 0.25) + (notSelected?2:0);
      this.optionRects[i].y = 32 * (i - this.options.length) + (notSelected?2:0);
      this.optionRects[i].width = Math.round(viewportWidth * 0.25) + (notSelected?-4:0);
      this.optionRects[i].height = 32 + (notSelected?-4:0);
      this.optionRects[i].tint = (notSelected?0xAAAAAA:0xFFFFFF)
    }
    this.container.visible = true;
  }

  update(delta) {
    if (this.reveal == this.message.length) return;
    this.timer += delta;
    if (this.timer >= 3) {
      this.timer = 0;

      this.reveal ++;
      this.text.text = this.message.substring(0, this.reveal);

      var charAt = this.message.charAt(this.reveal - 1);
      if (charAt != ' ' &&
          charAt != '-') {
        if (this.voice) this.voice.play();
      }
    }
  }

  keyDown(key) {
    if (key == 'KeyZ') {
      if (this.reveal == this.message.length) {
        this.container.visible = false;
        if (this.options[this.selection].channel) this.trigger.goto(this.options[this.selection].channel);
        else this.trigger.done();
      } else {
        this.reveal = this.message.length;
        this.text.text = this.message.substring(0, this.reveal);
      }
    } else if (key == 'ArrowUp') {
      this.optionRects[this.selection].x += 2;
      this.optionRects[this.selection].y += 2;
      this.optionRects[this.selection].width -= 4;
      this.optionRects[this.selection].height -= 4;
      this.optionRects[this.selection].tint = 0xAAAAAA;

      this.selection --;
      while (this.selection < 0) {
        this.selection = this.options.length + this.selection;
      }

      this.optionRects[this.selection].x -= 2;
      this.optionRects[this.selection].y -= 2;
      this.optionRects[this.selection].width += 4;
      this.optionRects[this.selection].height += 4;
      this.optionRects[this.selection].tint = 0xFFFFFF;
    } else if (key == 'ArrowDown') {
      this.optionRects[this.selection].x += 2;
      this.optionRects[this.selection].y += 2;
      this.optionRects[this.selection].width -= 4;
      this.optionRects[this.selection].height -= 4;
      this.optionRects[this.selection].tint = 0xAAAAAA;

      this.selection = (this.selection + 1) % this.options.length;

      this.optionRects[this.selection].x -= 2;
      this.optionRects[this.selection].y -= 2;
      this.optionRects[this.selection].width += 4;
      this.optionRects[this.selection].height += 4;
      this.optionRects[this.selection].tint = 0xFFFFFF;
    }
  }
}

class DelayEvent extends Event {
  constructor(time) {
    super();
    this.time = time;
  }

  play(trigger) {
    super.play(trigger);
    this.timer = 0;
  }

  update(delta) {
    this.timer += delta;
    if (this.timer >= this.time) {
      this.trigger.done();
    }
  }
}

class Trigger extends Entity {
  constructor(container, gridX, gridY, sprite, isSolid, eventStream) {
    super(container, gridX, gridY, sprite);
    solid[this.gridY][this.gridX] = isSolid;
    this.eventStream = eventStream;
    this.playing = false;
  }

  play(channel = 'main', index = 0) {
    this.channel = channel;
    this.index = index;
    this.eventStream[this.channel][this.index].play(this);
    this.playing = true;
  }

  done() {
    if (this.index < this.eventStream[this.channel].length - 1) {
      this.index++;
      this.eventStream[this.channel][this.index].play(this);
    } else {
      this.playing = false;
      player.unparalyze();
    }
  }

  goto(channel) {
    this.play(channel);
  }

  update(delta) {
    if (this.playing) this.eventStream[this.channel][this.index].update(delta);
    super.update(delta);
  }

  keyDown(key) {
    if (!this.playing && key == 'KeyZ') {
      if (
        (player.gridX == this.gridX && player.gridY == this.gridY) ||
        (player.desireX == this.gridX && player.desireY == this.gridY)
      ) {
        player.paralyze();
        this.play();
      }
    } else if (this.playing) {
      this.eventStream[this.channel][this.index].keyDown(key);
    }
  }

  keyUp(key) {
    if (this.playing) {
      this.eventStream[this.channel][this.index].keyUp(key);
    }
  }
}

class NPC extends Trigger {
  constructor(container, gridX, gridY, texture, eventStream) {
    super(container, gridX, gridY, null, [true, true, true, true], eventStream);

    this.targetX = gridX;
    this.targetY = gridY;

    this.animDown = [new PIXI.Texture(texture, new PIXI.Rectangle(texture.width * 0, texture.height * 0, texture.width * 0.25, texture.height * 0.25)), new PIXI.Texture(texture, new PIXI.Rectangle(texture.width * 0.25, texture.height * 0, texture.width * 0.25, texture.height * 0.25)), new PIXI.Texture(texture, new PIXI.Rectangle(texture.width * 0.5, texture.height * 0, texture.width * 0.25, texture.height * 0.25)), new PIXI.Texture(texture, new PIXI.Rectangle(texture.width * 0.75, texture.height * 0, texture.width * 0.25, texture.height * 0.25))];
    this.animLeft = [new PIXI.Texture(texture, new PIXI.Rectangle(texture.width * 0, texture.height * 0.25, texture.width * 0.25, texture.height * 0.25)), new PIXI.Texture(texture, new PIXI.Rectangle(texture.width * 0.25, texture.height * 0.25, texture.width * 0.25, texture.height * 0.25)), new PIXI.Texture(texture, new PIXI.Rectangle(texture.width * 0.5, texture.height * 0.25, texture.width * 0.25, texture.height * 0.25)), new PIXI.Texture(texture, new PIXI.Rectangle(texture.width * 0.75, texture.height * 0.25, texture.width * 0.25, texture.height * 0.25))];
    this.animRight = [new PIXI.Texture(texture, new PIXI.Rectangle(texture.width * 0, texture.height * 0.5, texture.width * 0.25, texture.height * 0.25)), new PIXI.Texture(texture, new PIXI.Rectangle(texture.width * 0.25, texture.height * 0.5, texture.width * 0.25, texture.height * 0.25)), new PIXI.Texture(texture, new PIXI.Rectangle(texture.width * 0.5, texture.height * 0.5, texture.width * 0.25, texture.height * 0.25)), new PIXI.Texture(texture, new PIXI.Rectangle(texture.width * 0.75, texture.height * 0.5, texture.width * 0.25, texture.height * 0.25))];
    this.animUp = [new PIXI.Texture(texture, new PIXI.Rectangle(texture.width * 0, texture.height * 0.75, texture.width * 0.25, texture.height * 0.25)), new PIXI.Texture(texture, new PIXI.Rectangle(texture.width * 0.25, texture.height * 0.75, texture.width * 0.25, texture.height * 0.25)), new PIXI.Texture(texture, new PIXI.Rectangle(texture.width * 0.5, texture.height * 0.75, texture.width * 0.25, texture.height * 0.25)), new PIXI.Texture(texture, new PIXI.Rectangle(texture.width * 0.75, texture.height * 0.75, texture.width * 0.25, texture.height * 0.25))];

    this.sprite = new PIXI.AnimatedSprite(this.animDown);
    this.sprite.anchor.set(0.5, 1);
    this.sprite.animationSpeed = 0.1;

    this.sprite.x = Math.round(this.x);
    this.sprite.y = this.sprite.z = Math.round(this.y);
    container.addChild(this.sprite);

    this.speed = 0.01;
  }

  update(delta) {
    if (this.remX == 0 && this.remY == 0) {
      if (this.playing) {
        if (player.gridX < this.gridX) this.sprite.textures = this.animLeft;
        else if (player.gridX > this.gridX) this.sprite.textures = this.animRight;
        else if (player.gridY < this.gridY) this.sprite.textures = this.animUp;
        else this.sprite.textures = this.animDown;

        this.sprite.gotoAndStop(0);
      } else {
        var animPrev = this.sprite.textures, framePrev = this.sprite.currentFrame;

        solid[this.targetY][this.targetX] = tilemap.solid[this.targetY][this.targetX];
        
        do {
          var direction = Math.choose(0, 1, 2, 3); // Down Left Right Up
          this.moveX = ((direction == 2)?this.speed:0) - ((direction == 1)?this.speed:0);
          this.moveY = ((direction == 0)?this.speed:0) - ((direction == 3)?this.speed:0);
        } while (this.gridX + Math.sign(this.moveX) < 0 || this.gridY + Math.sign(this.moveY) < 0 || this.gridX + Math.sign(this.moveX) >= tilemap.width || this.gridY + Math.sign(this.moveY) >= tilemap.height || solid[this.gridY][this.gridX][direction] || solid[this.gridY + Math.sign(this.moveY)][this.gridX + Math.sign(this.moveX)][3 - direction])

        this.targetX = this.gridX + Math.sign(this.moveX);
        this.targetY = this.gridY + Math.sign(this.moveY);
        solid[this.targetY][this.targetX] = [true, true, true, true];

        var animMap = {0: this.animDown, 1: this.animLeft, 2: this.animRight, 3: this.animUp};
        if (animMap[direction] != this.sprite.textures) {
          this.sprite.textures = animMap[direction];
        }

        if (this.moveX == 0 && this.moveY == 0) {
          this.sprite.gotoAndStop(0);
        } else if (this.sprite.textures != animPrev || !this.sprite.playing) {
          this.sprite.gotoAndPlay(framePrev + 1);
        }
      }
    } else if (this.remX + this.moveX < 0 || this.remX + this.moveX > 1 || this.remY + this.moveY < 0 || this.remY + this.moveY > 1) {
      this.remX = Math.round(this.remX);
      this.remY = Math.round(this.remY);

      while (this.remX >= 1) {this.remX--; this.gridX++;}
      while (this.remX < 0) {this.remX++; this.gridX--;}
      while (this.remY >= 1) {this.remY--; this.gridY++;}
      while (this.remY < 0) {this.remY++; this.gridY--;}

      this.moveX = 0;
      this.moveY = 0;
    }

    super.update(delta);
    this.sprite.position.x += gridWidth / 2;
    this.sprite.position.y += gridHeight * 0.875;
  }

  keyDown(key) {
    if (!this.playing && key == 'KeyZ') {
      if (
        (player.gridX == this.gridX + ((this.moveX > 0)?1:0) && player.gridY == this.gridY + ((this.moveY > 0)?1:0)) ||
        (player.desireX == this.gridX + ((this.moveX > 0)?1:0) && player.desireY == this.gridY + ((this.moveY > 0)?1:0))
      ) {
        player.paralyze();
        this.play();
      }
    } else if (this.playing) {
      this.eventStream[this.channel][this.index].keyDown(key);
    }
  }
}