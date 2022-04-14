class SceneMain extends Phaser.Scene {
  constructor() {
    super('SceneMain');
  }
  preload() {
    //Each number from 1 to 8 represents a moveable square/block and it's (single) sprite image corresponds to that number image in the spritesheet.
    //Load the spritesheet into 'blocks' sprite.
    this.load.spritesheet('blocks', 'images/JSHv4.png', {
      frameWidth: 100,
      frameHeight: 100,
    });
    this.load.spritesheet('jBlocks', 'images/JSPv4.png', {
      frameWidth: 100,
      frameHeight: 100,
    });
  }
  /*
  game.add.tileSprite(0, 0, 800, 600, 'space');

  var sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');

  sprite.anchor.setTo(0.5, 0.5);
  sprite.alpha = 0;

  game.add.tween(sprite).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
*/

  create() {
    //Declaring our objects
    //"blocks" is the list of blocks.
    //"xx" and "yy" are used in the physical placement of blocks.
    //the location of the blank ("empty block") is initally in the centre of the 3x3 space - code = 4. (The location codes are counted from zero to 8 right to left and then top to bottom on the grid.)

    var blockAtLocation = [];
    var jBlockAtLocation = [];
    var previousLocation = 4;
    var blankLocationVar = 4;
    var firstClick = false;
    const BLOCKDISPLAYWIDTH = 100;
    const BLOCKDISPLAYHEIGHT = 100;
    const XSHIFT = 30;
    const YSHIFT = 130;

    //When a game object (i.e. one of the squares) is clicked on, try to move it. (It will move to the space, if it neighbours it.)
    this.input.on('gameobjectdown', tryMoveBlock, this);

    //Initialising arrays
    //Each block is created, added in to blocks and assigned its preliminary position in the grid, matching the solution state.
    //The blocks then will be moved a random number of times, but according to the laws of the game, in order to reach the "initial" position. This process is carried out to ensure that the solution state is accessible from the initial position.

    for (var i = 0; i < 9; i++) {
      if (i == 4) {
        blockAtLocation[i] = 'blank';
      } else {
        var currentBlock = this.add.image(0, 0, 'blocks');
        currentBlock.displayWidth = BLOCKDISPLAYWIDTH;
        currentBlock.displayHeight = BLOCKDISPLAYHEIGHT;
        currentBlock.setInteractive();
        currentBlock.location = i;
        currentBlock.number = i;
        blockAtLocation[i] = currentBlock;
        if (i > 4) {
          currentBlock.setFrame(i - 1);
        } else {
          currentBlock.setFrame(i);
        }
      }
    }

    for (var i = 0; i < 9; i++) {
      var currentJBlock = this.add.image(0, 0, 'jBlocks');
      currentJBlock.alpha = 0;
      currentJBlock.displayWidth = BLOCKDISPLAYWIDTH;
      currentJBlock.displayHeight = BLOCKDISPLAYHEIGHT;
      jBlockAtLocation[i] = currentJBlock;
      currentJBlock.setFrame(i);
      if (i == 4) {
        currentJBlock.setFrame(8);
      }
      if (i > 4) {
        currentJBlock.setFrame(i - 1);
      }
    }

    var numberOfMoves = Phaser.Math.Between(15, 30);
    for (var i = 0; i < numberOfMoves; i++) {
      makeRandomMove();
    }

    drawGridWithHoles();
    var style = { font: '25px Arial', fill: '#f7f890', align: 'center' };
    var finalText = this.add.text(
      30,
      520,
      'Jesus is the missing piece.',
      style
    );
    finalText.alpha = 0;

    promptClicks();

    // Define helper functions.
    /*
    function unfade(element) {
      var op = 0.1; // initial opacity
      element.style.display = 'block';
      var timer = setInterval(function () {
        if (op >= 1) {
          clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ')';
        op += op * 0.1;
      }, 10);
    }
*/

    function promptClicks() {
      if (firstClick == false) {
        setTimeout(() => {
          console.log('noClickYet');
          makeRandomMove();
          drawGridWithHoles();
          promptClicks();
        }, 3000);
        return;
      }
      return;
    }

    function makeRandomMove() {
      var possibleLocations = neighbouringLocations(blankLocationVar);
      var numberOfNeighbours = possibleLocations.length;
      var arrayElement = Phaser.Math.Between(0, numberOfNeighbours - 1);
      var selectedBlockLocation = possibleLocations[arrayElement];
      if (selectedBlockLocation == previousLocation) {
        //If location is the one the block has just come from, choose a different location.
        possibleLocations.splice(arrayElement, 1);
        numberOfNeighbours = numberOfNeighbours - 1;
        arrayElement = Phaser.Math.Between(0, numberOfNeighbours - 1);
        selectedBlockLocation = possibleLocations[arrayElement];
      }
      //Moveblock and update arrays and blankLocation.
      previousLocation = blankLocationVar;
      /* console.log(
        'possibleLocations = ' +
          possibleLocations +
          '; BlankLocation = ' +
          blankLocationVar +
          '; selectedBlockLocation =' +
          selectedBlockLocation +
          '; Random block = ' +
          blockAtLocation[selectedBlockLocation]
      );
  */
      moveBlock(selectedBlockLocation, blankLocationVar);
    }

    function moveBlock(loc1, loc2) {
      const movingBlock = blockAtLocation[loc1];
      //   console.log('loc1 =' + loc1);
      [
        blockAtLocation[loc1],
        blockAtLocation[loc2],
        movingBlock.location,
        blankLocationVar,
      ] = ['blank', movingBlock, loc2, loc1];
    }

    function neighbouringLocations(location) {
      switch (location) {
        case 0:
          return [1, 3];
        case 1:
          return [0, 2, 4];
        case 2:
          return [1, 5];
        case 3:
          return [0, 4, 6];
        case 4:
          return [1, 3, 5, 7];
        case 5:
          return [2, 4, 8];
        case 6:
          return [3, 7];
        case 7:
          return [4, 6, 8];
        case 8:
          return [5, 7];
      }
    }

    //Drawing the initial arrangement
    //Each game object assigned its physical 2D location: location attribute is initialised for each block (as this is the array that will be needed when player moves the blocks, rather than the blockAtLocation array)
    //TO DO...
    function drawGridWithHoles() {
      var k = 0;
      var xx = XSHIFT;
      var yy = YSHIFT;
      for (var j = 0; j < 3; j++) {
        for (var i = 0; i < 3; i++) {
          //        console.log(i, j, this.blocks[i][j]);
          if (blockAtLocation[k] == 'blank') {
            xx += BLOCKDISPLAYWIDTH;
            k += 1;
            continue;
          } else {
            var currentBlock = blockAtLocation[k];
            //block.setOrigin(0,0);
            currentBlock.x = xx + BLOCKDISPLAYHEIGHT / 2;
            currentBlock.y = yy + BLOCKDISPLAYWIDTH / 2;
            xx += BLOCKDISPLAYWIDTH;
            k += 1;
          }
        }
        xx = XSHIFT;
        yy += BLOCKDISPLAYHEIGHT;
      }
    }

    function drawGridWithJesus() {
      var k = 0;
      var xx = XSHIFT;
      var yy = YSHIFT;
      for (var j = 0; j < 3; j++) {
        for (var i = 0; i < 3; i++) {
          //        console.log(i, j, this.blocks[i][j]);
          var currentJBlock = jBlockAtLocation[k];
          //block.setOrigin(0,0);
          currentJBlock.x = xx + BLOCKDISPLAYHEIGHT / 2;
          currentJBlock.y = yy + BLOCKDISPLAYWIDTH / 2;
          xx += BLOCKDISPLAYWIDTH;
          k += 1;
        }
        xx = XSHIFT;
        yy += BLOCKDISPLAYHEIGHT;
      }
    }

    function tryMoveBlock(pointer, block) {
      //      var neighbouringSpace;
      //      console.log(block, block.location);
      var possibleMoves = neighbouringLocations(block.location);
      //    console.log('block.location =' + block.location);
      //    console.log('possibleMoves =' + possibleMoves);
      //      console.log(possibleMoves);
      firstClick = true;
      for (i = 0; i < possibleMoves.length; i++) {
        if (blockAtLocation[possibleMoves[i]] === 'blank') {
          moveBlock(block.location, possibleMoves[i]);
          drawGridWithHoles();
          if (isFinished()) {
            console.log('Finished!');
            endLoop();
          }
          return;
        }
      }
      return 'blocked';
    }

    function isFinished() {
      for (var i = 0; i < 9; i++) {
        console.log('i = ' + i);
        if (i == 4) {
          if (blockAtLocation[i] != 'blank') {
            return false;
          }
        } else {
          if (blockAtLocation[i].number != i) return false;
        }
        console.log(i + ' is good.');
      }
      return true;
    }

    function endLoop() {
      freezeBlocks();
      console.log('Starting setTimeout');
      setTimeout(() => {
        console.log('Waited');
        fadeJesusIn();
        setTimeout(() => {
          addFinalText();
        }, 3500);
      }, 1000);
      console.log('Finished setTimeout');
      //      pauseBlocks();
      //      fadeJesusIn();
      //      addFinalText();
    }

    function freezeBlocks() {
      for (i = 0; i < 9; i++) {
        if (i != 4) {
          blockAtLocation[i].disableInteractive();
        }
      }
    }

    function fadeJesusIn() {
      drawGridWithJesus();
      for (i = 0; i < 9; i++) {
        /*        this.add
          .tween(jBlockAtLocation[i])
          .to(
            { alpha: 1 },
            2000,
            Phaser.Easing.Linear.None,
            true,
            0,
            1000,
            true
          );
*/
        //        unfade(jBlockAtLocation[i]);
        fadeIn(jBlockAtLocation[i], 0);
      }
    }

    function fadeIn(object, opacity) {
      object.alpha = opacity;
      if (opacity >= 1) {
        return;
      } else opacity = opacity + 0.01;
      setTimeout(function () {
        fadeIn(object, opacity);
      }, 40);
    }

    function addFinalText() {
      fadeIn(finalText, 0);
    }
  }
}

/*
OBSOLETE CODE

Random Initialisation:

    for (var i = 0; i < 8; i++) {
      remainingBlockNumbers[i] = i;
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

        blockLayout[i][j] = remainingBlockNumbers.pop();
      }
    }

neighbouringLocations definition:

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

//Drawing the initial arrangement
//Each game object assigned its physical 2D location

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
          currentBlock.setFrame(blockLayout[i][j]);
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
  
*/
