game.PlayScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
        // reset the score
        game.data.score = 0;
        me.levelDirector.loadLevel("Josephlevel01");
        // loads the first level
        this.resetPlayer(0, 400);

        me.input.bindKey(me.input.KEY.RIGHT, "right");
        // binds the right arrow key for moving right
        me.input.bindKey(me.input.KEY.LEFT, "left");
        // binds left arrow key for left direction
        me.input.bindKey(me.input.KEY.SPACE, "jump");
        // add our HUD to the game world
        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD);
    },
    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        // remove the HUD from the game world
        me.game.world.removeChild(this.HUD);
    },
    resetPlayer: function(x, y) {
        var player = me.pool.pull("mario", x, y, {});
        me.game.world.addChild(player, 6);
// lets player reset and be added in js
    }
});
