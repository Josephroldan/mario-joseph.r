
/* Game namespace */
var game = {
    // an object where to store game information
    data: {
        // score
        score: 0
    },
    // Run on page load.
    "onload": function() {
        // Initialize the video.
        if (!me.video.init("screen", me.video.CANVAS, 1067, 600, true, 1.0)) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        // add "#debug" to the URL to enable the debug Panel
        if (document.location.hash === "#debug") {
            window.onReady(function() {
                me.plugin.register.defer(this, debugPanel, "debug");
            });
        }

        // Initialize the audio.
        me.audio.init("mp3,ogg");

        // Set a callback to run when loading is complete.
        me.loader.onload = this.loaded.bind(this);

        // Load the resources.
        me.loader.preload(game.resources);

        // Initialize melonJS and display a loading screen.
        me.state.change(me.state.LOADING);
    },
    // Run on game resources loaded.
    /*
     * +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
     * loads and registers all characters and functions needed
     * +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
     */
    "loaded": function() {
        me.pool.register("mario", game.playerEntity, true);
        me.pool.register("CompleteJerk", game.CompleteJerk);
        me.pool.register("steroids", game.Steroids);
        me.pool.register("levelTrigger", game.LevelTrigger);
        me.pool.register("godLike", game.godLike)

        /*
         * =================================================================
         * sets stage changes in game
         * =================================================================
         */
        me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());

        // Start the game.
        me.state.change(me.state.MENU);
    }
};
