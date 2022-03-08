class SceneMain extends Phaser.Scene {
  constructor() {
    super('SceneMain');
  }
  preload() {
    //load our images or sounds
    this.load.spritesheet('blocks', 'images/blocks.png', {
      frameWidth: 64,
      frameHeight: 84,
    });
  }

  create() {
    //define our objects
    //    console.log('hi there');
    var blockLayout = [];
    this.colorArray = [];
    var xx = 0;
    var yy = 0;
    var k = 0;
    var remainingBlockNumbers = [];
    const BLOCKDISPLAYWIDTH = 100;
    const BLOCKDISPLAYHEIGHT = 100;

    this.input.on('gameobjectdown', tryMoveBlock, this);

    //initialising arrays
    for (var i = 0; i < 8; i++) {
      remainingBlockNumbers[i] = i;
      var color = Phaser.Math.Between(0, 4);
      this.colorArray[i] = color;
    }
    remainingBlockNumbers[8] = 'blank';
    for (var i = 0; i < 3; i++) {
      blockLayout[i] = [];
      for (var j = 0; j < 3; j++) {
        length = remainingBlockNumbers.length;
        var randomBlockNumber = Phaser.Math.Between(0, length - 1);
        //        console.log(randomBlockNumber);
        if (randomBlockNumber != length) {
          [
            remainingBlockNumbers[randomBlockNumber],
            remainingBlockNumbers[length - 1],
          ] = [
            remainingBlockNumbers[length - 1],
            remainingBlockNumbers[randomBlockNumber],
          ];
        }
        //console.log(i, this.block[i]);
        //console.log('remainingBlockNumbers = ' + remainingBlockNumbers);
        blockLayout[i][j] = remainingBlockNumbers.pop();
      }
    }

    //drawing the inital arrangement

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        //        console.log(i, j, this.blocks[i][j]);
        if (blockLayout[i][j] == 'blank') {
          yy += BLOCKDISPLAYHEIGHT;
          continue;
        } else {
          var currentBlock = this.add.image(0, 0, 'blocks');
          //          console.log(currentBlock);
          currentBlock.location = [i, j];
          currentBlock.displayWidth = BLOCKDISPLAYWIDTH;
          currentBlock.displayHeight = BLOCKDISPLAYHEIGHT;
          currentBlock.setFrame(this.colorArray[blockLayout[i][j]]);
          //block.setOrigin(0,0);
          currentBlock.x = xx + BLOCKDISPLAYHEIGHT / 2;
          currentBlock.y = yy + BLOCKDISPLAYWIDTH / 2;
          currentBlock.setInteractive();
          yy += BLOCKDISPLAYWIDTH;
        }
      }
      yy = 0;
      xx += BLOCKDISPLAYHEIGHT;
    }
    function neighbouringLocations(location) {
      console.log(location);
      switch (location[0]) {
        case 0:
          switch (location[1]) {
            case 0:
              console.log('case1');
              return [
                [0, 1],
                [1, 0],
              ];
            case 1:
              console.log('case2');
              return [
                [0, 0],
                [1, 1],
                [0, 2],
              ];
            case 2:
              console.log('case3');
              return [
                [0, 1],
                [1, 2],
              ];
          }
        case 1:
          switch (location[1]) {
            case 0:
              console.log('case4');
              return [
                [0, 0],
                [1, 1],
                [2, 0],
              ];
            case 1:
              console.log('case5');
              return [
                [0, 1],
                [1, 0],
                [1, 2],
                [2, 1],
              ];
            case 2:
              console.log('case6');
              return [
                [0, 2],
                [1, 1],
                [2, 2],
              ];
          }
        case 2:
          switch (location[1]) {
            case 0:
              console.log('case7');
              return [
                [1, 0],
                [2, 1],
              ];
            case 1:
              console.log('case8');
              return [
                [2, 0],
                [1, 1],
                [2, 2],
              ];
            case 2:
              console.log('case9');
              return [
                [2, 1],
                [1, 2],
              ];
          }
      }
    }
    function tryMoveBlock(pointer, block) {
      var neighbouringSpace;
      //      console.log(block, block.location);
      var possibleMoves = neighbouringLocations(block.location);
      //      console.log(possibleMoves);
      for (i = 0; i < possibleMoves.length; i++) {
        var row = possibleMoves[i][0];
        var col = possibleMoves[i][1];
        //        console.log('this.blocks = ' + this);
        //        console.log('this.blocks = ' + this.blocks);
        if (blockLayout[row][col] === 'blank') {
          moveBlock(block, row, col);
          return;
        }
      }
      return 'blocked';
    }

    function moveBlock(currentBlock, newRow, newCol) {
      //      console.log('currentBlock.location = ' + currentBlock.location);
      //      console.log('currentBlock.location[0] = ' + currentBlock.location[0]);
      const currentRow = currentBlock.location[0];
      const currentCol = currentBlock.location[1];
      currentBlock.location = [newRow, newCol];
      //block.setOrigin(0,0);
      console.log('currentBlock.x = ' + currentBlock.x);
      console.log('newRow = ' + newRow);
      currentBlock.x = currentBlock.displayHeight * (newRow + 1 / 2);
      console.log('currentBlock.x = ' + currentBlock.x);
      currentBlock.y = currentBlock.displayWidth * (newCol + 1 / 2);
      blockLayout[newRow][newCol] = blockLayout[currentRow][currentCol];
      blockLayout[currentRow][currentCol] = 'blank';
    }
  }
}

/*
    this.colorArray[12] = -1;
    this.pickColor();
    this.input.on('gameobjectdown', this.selectBlock, this);

    this.timer = new CircleTimer({ scene: this });
    this.timer.x = this.centerBlock.x;
    this.timer.y = this.centerBlock.y;
    console.log('start to be called from Scene');
    this.timer.setCallback(this.timeUp, this);
    this.timer.start();
  }
  timeUp() {
    alert('Time is up!');
  }
  selectBlock(pointer, block) {
    if (block.frame.name == this.centerBlock.frame.name) {
      console.log('right');
      block.removeInteractive();
      this.fall(block);
      this.pickColor();
    } else {
      console.log('wrong');
    }
  }
  fall(block) {
    this.tweens.add({ targets: block, duration: 1000, scaleX: 0, scaleY: 0 });
  }
  pickColor() {
    if (this.colorArray.length == 0) {
      console.log('next level');
      //next level
      return;
    }
    var color = this.colorArray.shift();
    if (color == -1) {
      this.pickColor();
      return;
    }
    this.centerBlock.setFrame(color);
  }
  update() {
    //constant running loop
  }
  }
  */
