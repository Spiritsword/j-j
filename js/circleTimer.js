class CircleTimer extends UIBlock
{
  constructor(config) {
    console.log("CircleTimerConstructor called");
    super();
    this.scene=config.scene;
    this.graphics=this.scene.add.graphics();
    this.count=100;
    this.setPer(100);
    this.add(this.graphics);
  }
  setCallback(fun, scope=null) {
    this.fun=fun;
    this.scope=scope;
  }
  start() {
    console.log("start called");
    this.timer=this.scene.time.addEvent({delay: 100, callback: this.tick, callbackScope: this, loop: true });
  }
  tick() {
    console.log("tick called");
    this.count-=2;
    this.setPer(this.count);
    if (this.count <= 0) {
      this.stop();
      if (this.scope) {
        this.fun.call().bind(this.scope);
      }
      else {
        this.fun.call();
      }
    }
  }
  stop() {
    this.timer.remove();
  }
  setPer(per) {
    var rad=(per/100)*360;
    this.graphics.clear();
    this.graphics.fillStyle(0xffffff,0.5);
    this.graphics.slice(0, 0, game.config.width*.1, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(rad));
    this.graphics.fillPath();
  }
}
