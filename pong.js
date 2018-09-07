class Vec {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    get len() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    set len(value) {
        const fact = value / this.len;
        this.x *= fact;
        this.y *= fact;
    }
}

class Rect {
    constructor(x = 0, y = 0) {
        this.pos = new Vec(x, y);
        this.size = new Vec(x, y);
    }

    get right() {
        return this.pos.x + this.size.x / 2;
    }
    get left() {
        return this.pos.x - this.size.x / 2;
    }
    get top() {
        return this.pos.y - this.size.y / 2;
    }
    get bottom() {
        return this.pos.y + this.size.y / 2;
    }
}

class Ball extends Rect {
    constructor() {
        super(15, 15);
        this.vel = new Vec(35, 15);
    }
}

class Player extends Rect {
    constructor() {
        super(10, 100);
        this.score = 0;
    }
}

class Pong {
    constructor(canvas) {
        scoreP1.innerHTML = "<span>Player one: 0</span>"
        scoreP2.innerHTML = "<span>Player two: 0</span>"

        this._canvas = canvas;
        this._context = canvas.getContext("2d");

        let lastTime;
        const callback = (millis) => {
            if (lastTime) {
                this.update((millis - lastTime) / 1000);
            }
            lastTime = millis;
            requestAnimationFrame(callback);
        };

        this.players = [
            new Player(),
            new Player()
        ];


        this.players[0].pos.x = 40;
        this.players[0].pos.y = this._canvas.height / 2;
        this.players[1].pos.x = this._canvas.width - 40;
        this.players[1].pos.y = this._canvas.height / 2;

        this.ball = new Ball();


        callback();
        this.playing = true;
        this.reset();
    }
    reset() {
        this.playing = false;
        this.ball.pos.x = this._canvas.width / 2;
        this.ball.pos.y = this._canvas.height / 2;

        this.start();
    }

    pause() {
        this.playing = false;
        this.ball.vel.x = 0;
        this.ball.vel.y = 0;
    }

    start() {
        if (this.ball.vel.x === 0 && this.ball.vel.y === 0) {
            this.ball.vel.x = 100 * (Math.random() > 0.5 ? 1 : -1);
            this.ball.vel.y = 100 * (Math.random() * 2 - 1);
            this.ball.vel.len = 200;
        } else {
            this.ball.vel.x = 100 * (Math.random() > 0.5 ? 1 : -1);
            this.ball.vel.y = 100 * (Math.random() * 2 - 1);
            this.ball.vel.len = 200;
        }
        this.playing = true;
    }

    collide(player, ball) {
        if (player.left < ball.right &&
            player.right > ball.left &&
            player.top < ball.bottom &&
            player.bottom > ball.top) {

            ball.vel.x = -ball.vel.x;
            ball.vel.len *= 1.05;
        }
    }

    draw() {
        this._context.fillStyle = "#000";
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
        this.drawRect(this.ball);
        this.players.forEach(player => {
            this.drawRect(player);
        });
    }

    drawRect(rect) {
        this._context.fillStyle = "#fff";
        this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
    }

    update(deltaTime) {
        this.ball.pos.x += this.ball.vel.x * deltaTime;
        this.ball.pos.y += this.ball.vel.y * deltaTime;

        if (this.ball.left < 0 || this.ball.right > this._canvas.width) {
            if (this.ball.left < 0) {
                this.players[1].score++;
                scoreP2.innerHTML = "<span>Player two:" + this.players[1].score + "</span>"
            } else if (this.ball.rigth > this._canvas.width) {
                this.players[0].score++;
                scoreP1.innerHTML = "<span>Player one:" + this.players[0].score + "</span>"
            }
            this.ball.vel.x = -this.ball.vel.x;
            this.reset();
        }

        if (this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
            this.ball.vel.y = -this.ball.vel.y;
        }
        // this.players[0].pos.y = this.ball.pos.y;
        this.players[1].pos.y = this.ball.pos.y;
        this.players.forEach(player => this.collide(player, this.ball));
        this.draw();

    }
}
const scoreP1 = document.getElementById("score_player1");
const scoreP2 = document.getElementById("score_player2");
const canvas = document.getElementById("pong");
const pong = new Pong(canvas);

canvas.addEventListener('click', function() {
    if (pong.playing) {
        pong.pause();
    } else {
        pong.start();
    }
});
canvas.addEventListener('mousemove', function(event) {
    pong.players[0].pos.y = canvas.height * (event.offsetY / event.target.getBoundingClientRect().height);
});