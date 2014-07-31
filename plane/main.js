    window.onload = function() {

        var game = new Phaser.Game(640,1136, Phaser.CANVAS, '', { preload: preload, create: create });
       

        function preload () {
            //  This sets a limit on the up-scale
            game.scale.maxWidth = 640;
            game.scale.maxHeight = 1136;
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.setScreenSize();

            game.load.image('plane', 'resource/plane.png');
            game.load.image('bullet','resource/bullet.png');
            game.load.spritesheet('failtext', 'resource/fail.png', 201, 93, 6);
        }

        function create () {
            game.state.add('game', game_state);
            game.state.add('gameover',gameover_state);

            game.state.start('game');
        }

        

};

var game_state={};
game_state = function (game) {
    this.plane;
    this.old_point = new Phaser.Point(0,0);
    this.bullet_group;
    this.bullet_make_index = 0;
    this.game_timer=0;
    this.make_bullet_event;
    this.game_timer_event;

    this.game;        //  a reference to the currently running game
    this.add;       //  used to add sprites, text, groups, etc
    this.camera;    //  a reference to the game camera
    this.cache;     //  the game cache
    this.input;     //  the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;      //  for preloading assets
    this.math;      //  lots of useful common math operations
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc
    this.stage;     //  the game stage
    this.time;      //  the clock
    this.tweens;    //  the tween manager
    this.state;     //  the state manager
    this.world;     //  the game world
    this.particles; //  the particle manager
    this.physics;   //  the physics manager
    this.rnd;       //  the repeatable random number generator
};

game_state.prototype = {
    preload: function () {

    },

    create: function () {
        var game = this.game;
        var plane = game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'plane');
        this.plane = plane;

        game.physics.enable(plane,Phaser.Physics.ARCADE);

        this.bullet_group = game.add.group();
        var bullet;
        for (var i = 0; i <100; i++) {
            bullet = game.add.sprite(0,0,'bullet');
            game.physics.enable(bullet,Phaser.Physics.ARCADE);
            bullet.visible = false;
            this.bullet_group.add(bullet);
        };

        this.makeBullet();

        this.make_bullet_event = game.time.events.loop(Phaser.Timer.SECOND*5, this.makeBullet, this);
        this.game_timer_event = game.time.events.loop(Phaser.Timer.SECOND,function(){
            this.game_timer+=1;
        },this);
    },

    update: function (){
        var game = this.game;
        var plane = this.plane;
        if (game.input.mousePointer.isDown) {
                var nowPoint = game.input.mousePointer;

                if (!(this.old_point.x ==0 && this.old_point.y==0)){
                    var dx = nowPoint.x - this.old_point.x;
                    var dy = nowPoint.y - this.old_point.y;
                   // console.log('dx,dy',dx,dy);
                    plane.x += dx*1.5;
                    plane.y += dy*1.5;

                }
                this.old_point.x = nowPoint.x;
                this.old_point.y = nowPoint.y;
        }
        else
        {
            this.old_point.x = 0;
            this.old_point.y =0 ;
        }

        for (var i=0;i<100;i++){
            bullet = this.bullet_group.getAt(this.bullet_make_index);
        }

        game.physics.arcade.overlap(plane,this.bullet_group,this.gameover,null,this);
    },

    makeBullet: function(){
            var game = this.game; 
            var bullet;
            for (var i=0;i<50;i++){
                bullet = this.bullet_group.getAt(this.bullet_make_index);
                if (!bullet)
                    continue;

                var dir = game.rnd.integerInRange(0,3);

                switch(dir)
                {
                   case 0:
                        bullet.y = -bullet.height;
                        bullet.x = Math.floor(game.rnd.frac()*100000 % game.world.width);
                        var sign =1;
                        if (bullet.x > game.world.width/2)
                            sing = -1;
                        bullet.body.velocity.x = Math.floor((game.rnd.frac()*1000)%200 * sign);
                        bullet.body.velocity.y = game.rnd.frac()*(200-100) + 100;
                   break; 
                   case 1:
                        bullet.y = game.world.height;
                        bullet.x = Math.floor(game.rnd.frac()*100000 % game.world.width);
                        var sign =1;
                        if (bullet.x > game.world.width/2)
                            sing = -1;
                        bullet.body.velocity.x = Math.floor((game.rnd.frac()*1000)%100 * sign);
                        bullet.body.velocity.y = - (game.rnd.frac()*(200-100) + 100);
                       // console.log('vy:',bullet.body.velocity.y);
                   break;
                   case 2:
                        bullet.x = -bullet.width;
                        bullet.y = Math.floor(game.rnd.frac()*100000 % game.world.height);
                        bullet.body.velocity.x = game.rnd.frac()*(200-100) + 100;
                        var sign =1;
                        if (bullet.x > game.world.height/2)
                            sing = -1;
                        
                        bullet.body.velocity.y = Math.floor((game.rnd.frac()*1000)%100 * sign);
                   break;
                   case 3:
                        bullet.x = game.world.width;
                        bullet.y = Math.floor(game.rnd.frac()*100000 % game.world.height);
                        bullet.body.velocity.x = -(game.rnd.frac()*(200-100) + 100);
                        var sign =1;
                        if (bullet.x > game.world.height/2)
                            sing = -1;
                        
                        bullet.body.velocity.y = Math.floor((game.rnd.frac()*1000)%100 * sign);
                   break;
                }

                bullet.visible = true;

                this.bullet_make_index++;
                if (this.bullet_make_index>=100)
                    this.bullet_make_index = 0;
            }
    },


    gameover : function(){
            console.log('game over!');
            this.plane.kill();
            this.game.time.events.remove(this.game_timer_event);
            this.game.time.events.remove(this.make_bullet_event);
            this.state.start('gameover');
    }


}


gameover_state = {};
gameover_state = function(game){

}

gameover_state.prototype ={
    preload: function () {

    },

    create: function () {
    }
}


title_state = {};
title_state = function(game){

}

title_state.prototype ={
    preload: function () {

    },

    create: function () {
    }
}

