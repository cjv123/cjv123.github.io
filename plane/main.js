    window.onload = function() {

        var game = new Phaser.Game(640,1136, Phaser.CANVAS, '', { preload: preload, create: create ,update:update});
        var plane;
        var old_point = new Phaser.Point(0,0);
        var bullet_group;
        var bullet_make_index = 0;

        function preload () {
            //  This sets a limit on the up-scale
            game.scale.maxWidth = 640;
            game.scale.maxHeight = 1136;
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.setScreenSize();

            game.load.image('plane', 'resource/plane.png');
            game.load.image('bullet','resource/bullet.png');
        }

        function create () {
            plane = game.add.sprite(game.world.centerX, game.world.centerY, 'plane');

            bullet_group = game.add.group();
            var bullet;
            for (var i = 0; i <100; i++) {
                bullet = game.add.sprite(0,0,'bullet');
                game.physics.enable(bullet,Phaser.Physics.ARCADE);
                bullet.visible = false;
                bullet_group.add(bullet);
            };

            makeBullet();
        }

        function makeBullet(){
            var bullet;
            for (var i=0;i<50;i++){
                bullet = bullet_group.getAt(bullet_make_index);
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
                        console.log('vy:',bullet.body.velocity.y);
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

                bullet_make_index++;
                if (bullet_make_index>=100)
                    bullet_make_index = 0;
            }
        }

        function update(){

            if (game.input.mousePointer.isDown) {
                var nowPoint = game.input.mousePointer;

                if (!(old_point.x ==0 && old_point.y==0)){
                    var dx = nowPoint.x - old_point.x;
                    var dy = nowPoint.y - old_point.y;
                   // console.log('dx,dy',dx,dy);
                    plane.x += dx*1.5;
                    plane.y += dy*1.5;

                }
                old_point.x = nowPoint.x;
                old_point.y = nowPoint.y;
            }
            else
            {
                old_point.x = 0;
                old_point.y =0 ;
            }
        }



};
