// TODO
game.playerEntity = me.Entity.extend({
    //function initializes character
    init: function(x, y, settings) {
        this._super(me.Entity, "init", [x, y, {
                /*
                 * determines proper size of character
                 */
                image: "mario",
                spritewidth: "64",
                spriteheight: "64",
                height: 64,
                width: 64,
                getShape: function() {
                    return (new me.Rect(64, 64, 64, 64)).toPolygon();
                }
            }]);
        /*
         * '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
         * Generates all animations for the character
         * '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
         */
        this.renderable.addAnimation("idle", [39]);
        //sets standiing animation
        this.renderable.addAnimation("smallWalk", [143, 144, 145, 146, 147, 148, 149, 150, 151], 80);
        //gives animation for walking
        this.renderable.addAnimation("bigWalk", [55, 56, 57, 58, 59], 80);
        this.renderable.addAnimation("bigIdle", [14, 15, 16, 17, 18, 19]);
        this.renderable.addAnimation("hurt", [229, 230, 231], 39);
        this.renderable.setCurrentAnimation("idle");
        //activates standing animation
        this.big = false;
        this.body.setVelocity(5, 20);
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
    },
    update: function(delta) {
        if (me.input.isKeyPressed("left")) {
            //tells character to move left
            this.flipX(true);
            // flips animations for moving right
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
            // sets velocity and speed for moving left
        }
        /*
         * ------------------------------------------------------------------------------------------------------------
         * tells to move the character right  when pressing the right arrow key
         * ------------------------------------------------------------------------------------------------------------
         */
        else if (me.input.isKeyPressed("right")) {
            this.flipX(false);
            //keeps animations from being flipped
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            /*zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz
             *allows jumping using space key 
             */
            if (me.input.isKeyPressed("jump")) {
                if (!this.body.jumping && !this.body.falling) {
                    this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                    this.body.jumping = true;
                }
            }
        } else {
            this.body.vel.x = 0;
        }


        this.body.update(delta);
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        if (!this.big) {
            if (this.body.vel.x !== 0) {
                if (!this.renderable.isCurrentAnimation("smallWalk")) {
                    this.renderable.setCurrentAnimation("smallWalk");
                    this.renderable.setAnimationFrame();
                    // used seperately for normal size walking
                }
            } else {
                this.renderable.setCurrentAnimation("idle");
            }
            //makes character stand still
        } else {
            if (this.body.vel.x !== 0) {
                if (!this.renderable.isCurrentAnimation("bigWalk")) {
                    this.renderable.setCurrentAnimation("bigWalk");
                    this.renderable.setAnimationFrame();
                    // starts and activates mushroom walk sequence
                }
            } else {
                this.renderable.setCurrentAnimation("bigIdle");
                //activates mushroom standing animation
            }
        }


        this._super(me.Entity, "update", [delta]);
        return true;
    },
    collideHandler: function(response) {
        var ydif = this.pos.y - response.b.pos.y;

        if (response.b.type === "CompleteJerk") {
            if (ydif <= -115) {
                // gives value for killing jerk
                response.b.alive = false;
            } else {
                console.log("hit");
                if (this.big) {
                    this.big = false;
                    response.b.alive = false;
                    // destroy's mushrooms effects but kill badguy
                    console.log("big");
                } else if (response.b.alive) {
                    me.state.change(me.state.MENU);
                    // takes you to menu screen when dead
                } else {
                    if (this.godLike = true) {
                        response.b.alive = false;
                    }
                }
            }
        }
        //code that tells mario to eat the mushroom and have it disappear
        else if (response.b.type === "steroids") {
            this.big = true;
            this.renderable.setCurrentAnimation("bigIdle");
            me.game.world.removeChild(response.b);
        } else {
            if (response.b.type === "godLike") {
                this.godLike = true;
                console.log("god");
            }
        }
    }
});
game.LevelTrigger = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, settings]);
        this.body.onCollision = this.onCollision.bind(this);
        this.level = settings.level;
        this.xSpawn = settings.xSpawn;
        this.ySpawn = settings.ySpawn;
    },
    onCollision: function() {
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);
        me.levelDirector.loadLevel(this.level);
        me.state.current().resetPlayer(this.xSpawn, this.ySpawn);
    }
});


game.CompleteJerk = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, "init", [x, y, {
                image: "slime",
                //shows game width and height of badguy
                spritewidth: "60",
                spriteheight: "28",
                height: 60,
                width: 28,
                getShape: function() {
                    return (new me.Rect(0, 00, 28, 60)).toPolygon();
                }
            }]);
        this.spritewidth = 60;
        var width = settings.width;
        x = this.pos.x;
        this.startX = x;
        //sets it to move at start position
        this.endX = x + width - this.spritewidth;
        this.pos.x = x + width - this.spritewidth;
        // tells badguy its end space for alternating
        this.updateBounds();

        this.alwaysUpdate = true;
        //lets badguy update even off screen
        this.walkLeft = false;
        this.alive = true;
        // shows that the badguy is alive
        this.type = "CompleteJerk";
        //adds special type for advanced use

        this.body.setVelocity(4, 6);

        //sets velocity for enemy
    },
    update: function(delta) {
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        if (this.alive) {
            if (this.walkLeft && this.pos.x <= this.startX) {
                this.walkLeft = false;
            } else if (!this.walkLeft && this.pos.x >= this.endX) {
                this.walkLeft = true;
            }
            this.flipX(!this.walkLeft);
            this.body.vel.x += (this.walkLeft) ? -this.body.accel.x * me.timer.tick : this.body.accel.x * me.timer.tick;
        } else {
            me.game.world.removeChild(this);
        }

        this.body.update(delta);
// allows the character to update and move  within its boundaries 
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    collideHandler: function() {

    }
});
game.Steroids = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, "init", [x, y, {
                image: "steroids",
                //shows game width and height of badguy
                spritewidth: "64",
                spriteheight: "64",
                height: 64,
                width: 64,
                getShape: function() {
                    return (new me.Rect(0, 0, 64, 64)).toPolygon();
                }
            }]);
        // tells game for checking for shroom
        me.collision.check(this);
        this.type = "steroids";
    }

});
game.godLike = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, "init", [x, y, {
                image: "godLike",
                //shows game width and height of badguy
                spritewidth: "64",
                spriteheight: "64",
                height: 64,
                width: 64,
                getShape: function() {
                    return (new me.Rect(0, 0, 64, 64)).toPolygon();
                }
            }]);
        // tells game for checking for shroom
        me.collision.check(this);
        this.type = "godLike";
    }

});
           