//set dimensions
var dimension = {
    "screen": {
        "height": 400,
        "width": 800
    },
    "ball": {
        "diameter": 25,
        "radius": 12.5,
        "top": 50,
        "left": 0
    },
    "backboard": {
        "height": 80, // 60
        "width": 7, // 5
        "top": 160, // 120
        "left": 20
    },
    "court": {
        "height": 80,
        "width": 800,
        "top": 0,
        "left": 0
    },
    "goaltending": {
        "height": 5,
        "width": 85,
        "top": 80,
        "left": 0
    },
    "halfcourt": {
        "height": 7,
        "width": 7,
        "top": 0,
        "left": 0
    },
    "net": {
        "height": 25,
        "width": 50
    },
    "slime": {
        "radius": 40
    },
    "rim": {
        "height": 5, // 3
        "width": 55, // 41
        "top": 215, // 160
        "left": 27
    }
}

var keys = {
    "w": false,
    "a": false,
    "s": false,
    "d": false,
    "left": false,
    "up": false,
    "right": false,
    "down": false
}

var color = {
    "white": "#FFFFFF",
    "blue": "#0000FF",
    "grey": "#999999",
    "yellow": "#FAF702",
    "orange": "#FF6103"
}

var canvas;
var stage;
var background;
var court;
var goaltendingArea;
var halfcourt;
var backboard;
var rim;
var net;
var player1;
var player2;
var ball;

//increase negative velocity each time
var GRAVITY = .7;
var JUMP_SPEED = 12;
var SPEED = 8;
var p1XV = 0;
var p1YV = 0;
var p2XV = 0;
var p2YV = 0;

//ball vars
var ballX = 500;
var ballY = 400;
var ballOldX = 500;
var ballOldY = 400;
var ballVX = 0;
var ballVY = 0;

var fP1Sticky = false;
var fP1Touched = false;
var fP2Sticky = false;
var fP2Touched = false;
var fhold1 = false;
var fhold2 = false;
var gameOver = false;

var FPS = 60;


dimension.court.top = dimension.screen.height - dimension.court.height;
dimension.goaltending.top = dimension.court.top + 2;
dimension.halfcourt.left = (dimension.screen.width / 2 - dimension.halfcourt.width / 2);
dimension.halfcourt.top = dimension.court.top;
dimension.ball.left = (dimension.screen.width / 2 - dimension.ball.radius);
dimension.rim.left = (dimension.backboard.left + 7);

createjs.Ticker.setFPS(FPS);
createjs.Ticker.addEventListener("tick", new_frame);

function init() {
    //setting the stage
    canvas = document.getElementById("canvas");
    stage = new createjs.Stage(canvas);

    drawBackground();
    drawCourt();
    drawGoaltending();
    drawHalfcourt();
    drawBackboard();
    drawRim();
    drawBall();
    drawPlayer1();
    drawPlayer2();

    //anytime a key is pressed or release we need to check and set it
    document.addEventListener("keydown", setDownKey, false);
    document.addEventListener("keyup", setUpKey, false);

}

function new_frame() {
    move_slimes();
    move_ball();
    stage.update();
    createjs.Ticker.setFPS(document.getElementById('FPS').value);
}

function gameStart() {

}

function move_ball() {
    var i = (30 * dimension.screen.height) / 1000;
    var j = (ballOldX * dimension.screen.width) / 1000;
    var k = (4 * dimension.screen.height) / 5 - (ballOldY * dimension.screen.height) / 1000;

    ballVY--;
    ball.y -= ballVY;
    ball.x += ballVX;

    if (!gameOver) {
        var l = (ball.x - player2.x) * 2;
        var i1 = dimension.ball.x * dimension.screen.width / 1000;
        var j1 = l * l + i1 * i1;
        var k1 = ballVX - p1XV;
        var l1 = ballVY - p1YV;

        //collision detection: player 1 and ball
        if (i1 > 0 && j1 < 15625 && j1 > 25) {
            var i2 = Math.sqrt(j1);
            var k2 = (l * k1 + i1 * l1) / i2;
            ball.x = player1.x + (l * 63) / i2;
            ball.y = player1.y - ((i1 * 125) / j2);
            if (k2 <= 0) {
                if (!fP1Sticky) {
                    ballVY += p1YV - (2 * i1 * k2) / i2;
                    ballVX += ((p1XV - (2 * l * k2) / i2) * 7) / 10;
                } else {
                    ballVX = 0;
                    ballVY = 0;
                }
                if (ballVX < -15) {
                    ballVX = -15;
                }
                if (ballVX > 15) {
                    ballVX = 15;
                }
                if (ballVY < -22) {
                    ballVY = -22;
                }
                if (ballVY > 22) {
                    ballVY = 22;
                }
            }
            fP1Touched = true;
            if (fhold1) {
                ballVX = 15;
                ballVY = 25;
            }
            lastTouch = player1.x;
        }

        l = (ball.x - player2.x) * 2;
        i1 = -(ball.y - player2.y);
        j1 = l * l + i1 * i1;
        k1 = ballVX - p2XV;
        l1 = ballVY - p2YV;

        // collision detection: player 2 and ball
        if (i1 > 0 && j1 < 15625 && j1 > 25) {
            var j2 = Math.sqrt(j1);
            var l2 = (l * k1 + i1 * l1) / j2;
            ball.x = player2.x + (l * 63) / j2;
            ball.y = player2.y - ((i1 * 125) / j2);
            if (l2 <= 0) {
                if (!fP2Sticky) {
                    ballVX += ((p2XV - (2 * l * l2) / j2) * 7) / 10;
                    ballVY += p2YV - (2 * i1 * l2) / j2;
                } else {
                    ballVX = 0;
                    ballVY = 0;
                }
                if (ballVX < -15) {
                    ballVX = -15;
                }
                if (ballVX > 15) {
                    ballVX = 15;
                }
                if (ballVY < -22) {
                    ballVY = -22;
                }
                if (ballVY > 22) {
                    ballVY = 22;
                }
            }
            fP2Touched = true;
            if (fhold2) {
                ballVX = -15;
                ballVY = 25;
            }
            lastTouch = player2.x;
        }
        // readjust these for your court size, accounts for ball hitting wall
        if (ball.x < 0) {
            ball.x = 0;
            ballVX = -ballVX;
        }
        if (ball.x > (dimension.screen.width - 2 * dimension.ball.radius)) {
            ball.x = (dimension.screen.width - 2 * dimension.ball.radius);
            ballVX = -ballVX;
        }
        // hitting backboard?
        if (-ball.y >= dimension.backboard.height && -ball.y <= dimension.backboard.top) {
            if (ball.x <= dimension.backboard.left) {
                ball.x = dimension.backboard.left;
                ballVX = -ballVX;
            }
            if (ball.x >= 960) {
                ball.x = 960;
                ballVX = -ballVX;
            }
        }
        // checking if it goes through the hoop?
        if (-ball.y >= 252 && -ball.y <= 274) {
            if (ball.x <= 115 && ball.x >= 90) {
                if (ballOldX >= 115) {
                    ball.x = 115;
                    ballVX = -ballVX;
                } else
                if (ballOldX <= 90) {
                    ball.x = 90;
                    ballVX = -ballVX;
                }
                if (ballOldY >= 274) {
                    ball.y = -274;
                }
                if (ballOldY <= 252) {
                    ball.y = -252;
                }
                ballVY = -ballVY;
            }
            //checking for the other hoop
            if (ball.x <= 907 && ball.x >= 891) {
                if (ballOldX >= 907) {
                    ballOldX = 903;
                    ballVX = -ballVX;
                } else
                if (ballOldX <= 891) {
                    ballOldX = 891;
                    ballVX = -ballVX;
                }
                // will this even happen inside this outer loop, line 260
                if (ballOldY >= 274) {
                    ball.y = -274;
                }
                if (ballOldY <= 252) {
                    ball.y = -252;
                }
                ballVY = -ballVY;
            }
            if (ball.x <= 45) {
                if (ballOldY >= 274) {
                    ball.y = -274;
                }
                if (ballOldY <= 252) {
                    ball.y = -252;
                }
                ball.x = 45;
                ballVY = -ballVY;
                ballVX = -ballVX + 1;
            }
        }
        //checking if it's hitting the ground
        if (-ball.y < 12.5) {
            ball.y = -12.5;
            ballVY = (-ballVY * 7) / 10;
            ballVX = (ballVX * 7) / 10;
        }
    }
    j = ball.x;
    k = 4 / 5 - ball.y;

    //figure out how this all shakes out with EaselJS

    //screen.setColor(Color.yellow);
    //screen.fillOval(j - i, k - i, i * 2, i * 2);
}

function move_slimes() {
    if (keys.a === true) {
        player_1_left();
    } else if (keys.d === true) {
        player_1_right();
    } else {
        p1XV = 0;
    }

    if (keys.w === true) {
        player_1_jump();
    }

    if (keys.left === true) {
        player_2_left();
    } else if (keys.right === true) {
        player_2_right();
    } else {
        p2XV = 0;
    }
    if (keys.up === true) {
        player_2_jump();
    }

    /*Player 1*/
    //move according to x velociy
    player1.x += p1XV;
    //if he's out of the screen, bring him back
    if (player1.x < 0) {
        player1.x = 0;
    }
    if (player1.x > (800 - 2 * dimension.slime.radius)) {
        player1.x = (800 - 2 * dimension.slime.radius);
    }
    //if he has vertical velocity, move him and decrease the velocity
    if (p1YV != 0) {
        p1YV = p1YV - GRAVITY;
        player1.y -= p1YV;
        if (player1.y > 0) {
            player1.y = 0;
            p1YV = 0;
        }
    }

    /*Player 2*/
    //move according to x velocity
    player2.x += p2XV;
    //if he's out of the screen, bring him back
    if (player2.x > (800 - 2 * dimension.slime.radius)) {
        player2.x = (800 - 2 * dimension.slime.radius);
    }
    if (player2.x < 0) {
        player2.x = 0;
    }
    //if he has vertical velocity, move him and decrease the velocity
    if (p2YV != 0) {
        p2YV = p2YV - GRAVITY;
        player2.y -= p2YV;
        //notice the greater than sign because the canvas is drawn from the top down
        if (player2.y > 0) {
            player2.y = 0;
            p2YV = 0;
        }
    }
}

function setRelativeValues() {
    dimension.court.top = dimension.screen.height - dimension.court.height;
    dimension.goaltending.top = dimension.court.top + 2;
    dimension.halfcourt.left = (dimension.screen.width / 2 - dimension.halfcourt.width / 2);
    dimension.halfcourt.top = dimension.goaltending.top;
    dimension.ball.left = (dimension.screen.width / 2 - dimension.ball.radius);
    dimension.rim.left = (dimension.backboard.left + 7);
}

function drawBackground() {
    background = new createjs.Shape();
    background.graphics.f(color.blue).r(0, 0, dimension.screen.width, dimension.screen.height);
    stage.addChild(background);
}

function drawCourt() {
    //draw the court on the bottom
    court = new createjs.Shape();
    court.graphics.f(color.grey).r(dimension.court.left, dimension.court.top, dimension.court.width, dimension.court.height);
    stage.addChild(court);
}

function drawGoaltending() {
    goaltendingArea = new createjs.Shape();
    goaltendingArea.graphics.f(color.white).r(dimension.goaltending.left, dimension.goaltending.top, dimension.goaltending.width, dimension.goaltending.height);
    stage.addChild(goaltendingArea);
}

function drawHalfcourt() {
    halfcourt = new createjs.Shape();
    halfcourt.graphics.f(color.white).r(dimension.halfcourt.left, dimension.halfcourt.top, dimension.halfcourt.width, dimension.halfcourt.height);
    stage.addChild(halfcourt);
}

function drawBackboard() {
    backboard = new createjs.Shape();
    backboard.graphics.f(color.white).r(dimension.backboard.left, dimension.backboard.top, dimension.backboard.width, dimension.backboard.height);
    stage.addChild(backboard);
}

function drawRim() {
    rim = new createjs.Shape();
    rim.graphics.f(color.orange).r(dimension.rim.left, dimension.rim.top, dimension.rim.width, dimension.rim.height);
    stage.addChild(rim);
}

function drawBall() {
    ball = new createjs.Shape();
    ball.graphics.f(color.yellow).dc(dimension.ball.radius, dimension.court.top, dimension.ball.radius);
    ball.x = dimension.ball.left;
    ball.y = -(dimension.court.top - dimension.ball.top);
    stage.addChild(ball);
}

function drawPlayer1() {
    player1 = new createjs.Shape();
    player1.graphics.f(color.yellow).arc(dimension.slime.radius, dimension.court.top, dimension.slime.radius, Math.PI, 0);
    player1.x = (320 - dimension.slime.radius);
    stage.addChild(player1);
}

function drawPlayer2() {
    player2 = new createjs.Shape();
    player2.graphics.f(color.orange).arc(dimension.slime.radius, dimension.court.top, dimension.slime.radius, Math.PI, 0);
    player2.x = (dimension.screen.width - 320 - dimension.slime.radius);
    stage.addChild(player2);
}

function player_1_jump() {
    if (player1.y === 0) {
        p1YV = JUMP_SPEED;
    }
}

function player_1_left() {
    p1XV = -SPEED;
}

function player_1_right() {
    p1XV = SPEED;
}

function player_2_jump() {
    if (player2.y === 0) {
        p2YV = JUMP_SPEED;
    }
}

function player_2_left() {
    p2XV = -SPEED;
}

function player_2_right() {
    p2XV = SPEED;
}

function setDownKey(event) {
    var key = event.keyCode;
    if (key === 87) { //key = w
        keys.w = true;
    } else if (key === 65) { //key = a
        keys.a = true;
    } else if (key === 68) { //key = d
        keys.d = true;
    } else if (key === 83) { //key = s
        keys.s = true;
    } else if (key === 38) { //key = up
        keys.up = true;
    } else if (key === 37) { //key = left
        keys.left = true;
    } else if (key === 39) { //key = right
        keys.right = true;
    } else if (key === 40) { //key = down
        keys.down = true;
    }
}

function setUpKey(event) {
    var key = event.keyCode;
    if (key === 87) { //key = w
        keys.w = false;
    } else if (key === 65) { //key = a
        keys.a = false;
    } else if (key === 68) { //key = d
        keys.d = false;
    } else if (key === 83) { //key = s
        keys.s = false;
    } else if (key === 38) { //key = up
        keys.up = false;
    } else if (key === 37) { //key = left
        keys.left = false;
    } else if (key === 39) { //key = right
        keys.right = false;
    } else if (key === 40) { //key = down
        keys.down = false;
    }
}