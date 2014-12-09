game.TitleScreen = me.ScreenObject.extend({
    /**	
     *  action to perform on state change
     */
    onResetEvent: function() {
        var titleImage = new me.Sprite(0, 0, me.loader.getImage("title-screen"));
        // loads image for title
        me.game.world.addChild(titleImage, -10);
        me.input.bindKey(me.input.KEY.ENTER, "start");// TODO

        me.game.world.addChild(new (me.Renderable.extend({
            init: function() {
                this._super(me.Renderable, 'init', [510, 30, me.game.viewport.width, me.game.viewport.height]);
                // generates the screen width and height
                this.font = new me.Font("Arial", 46, "white");
                //generates font color, size, and type
            },
            draw: function(renderer) {
                this.font.draw(renderer.getContext(), "Marioish ", 450, 130);
                //these two lines draw the words on screen itself
                this.font.draw(renderer.getContext(), "Press enter to play if you dare", 250, 530);
            }
        })));

        this.handeler = me.event.subscribe(me.event.KEYDOWN, function(action, keyCode, edge) {
            if (action === "start") {
                me.state.change(me.state.PLAY);

                //lets the game start when you hit enter
            }
        });
    },
    /**	
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        me.input.unbindKey(me.input.KEY.ENTER); // TODO
        me.event.unsubscribe(this.handeler);
        //stops you from instantly restarting whenever you hit enter
    }
});
