class Game
{
    constructor()
    {
        this.uuid = undefined;
        this.frame_rate = 30;
        this.frame_count = 0;
        this.player_one = new Player();
        this.player_two = new Player();
        this.board = new Board();
        this.ball = new Ball();
        this.net = new Net();
        this.scoreLimit = 7;
        this.startDisplayed = true;
        this.requestAnimationFrame = window.requestAnimationFrame || 
            window.mozRequestAnimationFrame || 
            window.webkitRequestAnimationFrame || 
            window.msRequestAnimationFrame;
        this.continueAnimating = false;
        // camera
        this.displayStartMessage = () =>
        {
            this.board.ctx.fillStyle = "#000";
			let pixels = this.board.dim.width * 0.05;
			this.board.ctx.font = pixels + "px bald Arial";
            const text = "Press enter to start :)";
            const textWidth = this.board.ctx.measureText(text).width;
            this.board.ctx.fillText(text, (this.board.dim.width / 2 - textWidth / 2), (this.board.dim.height * 0.3));
        }
        this.initPlayers = () =>
        {
            this.player_one.game = game;
            this.player_two.game = game;
            this.player_one.racket.game = game;
            this.player_one.side = "left"; // keep it for the moment or the score will not be in the right place
            this.player_two.racket.game = game;
            this.player_two.side = "right";

            let border = this.board.dim.width * 0.01;
            this.player_one.pos.x = border;
			this.player_one.pos.y = border;
            this.player_one.racket.defineRacketSize();
            this.player_two.racket.dim = this.player_one.racket.dim;
            this.player_two.pos.x = this.board.dim.width - border - this.player_two.racket.dim.width;
            this.player_two.pos.y = border;
            this.player_two.racket.defineRacketSize();
        }
    }
}