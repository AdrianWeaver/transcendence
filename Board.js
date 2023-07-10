class	Board
{
	constructor()
	{
		this.borderStyle = "1px solid";
		this.backgroundColor = "#FFF";
		this.irlWidth = 274;
		this.irlHeight = 152.5;
		this.irlRatio = this.irlHeight / this.irlWidth;
		this.canvas = document.getElementById("board");
		this.ctx = this.canvas.getContext("2d");
		this.ctx.font = "30px Arial";
		this.ctx.fillStyle = "#000";
		this.ctx.textAlign = "center";
		this.dim = new Dimension();
		this.game = undefined;
		this.setHeight = () =>
		{
			this.dim.height = this.irlRatio * this.dim.width;
			return (this.dim.height);
		};
		this.updateSizeAfterResize = () =>
		{
			let prevWidth = this.dim.width; // this.width 
			let	prevHeight = this.dim.height; // this.height obj Borad 
			let windowWidth = window.innerWidth;
			this.canvasWidth = windowWidth * 0.66;
			this.canvasHeight = this.setHeight();
			
			this.dim.width = this.canvasWidth;
			this.dim.height = this.canvasHeight;
			this.canvas.width = this.dim.width;
			this.canvas.height = this.dim.height;
		
			let multiplicator_width = this.dim.width / prevWidth;
			let multiplicator_height = this.dim.height / prevHeight;

			this.game.player_one.pos.x = this.game.player_one.pos.x * multiplicator_width;
			this.game.player_one.pos.y = this.game.player_one.pos.y * multiplicator_height;
			this.game.player_two.pos.x = this.game.player_two.pos.x * multiplicator_width;
			this.game.player_two.pos.y = this.game.player_two.pos.y * multiplicator_height;
			this.game.ball.pos.x *= multiplicator_width;
			this.game.ball.pos.y *= multiplicator_height;
			this.game.player_one.racket.defineRacketSize();
			this.game.player_two.racket.defineRacketSize();
		};
		this.registerEvents = () =>
		{
			addEventListener("resize", this.updateSizeAfterResize);
		};
		this.init = () =>
		{
			let windowWidth = window.innerWidth;
			this.dim.width = windowWidth * 0.66;
			this.setHeight();
			this.canvas.style.border = this.borderStyle;
			this.canvas.width = this.dim.width;
			this.canvas.height = this.dim.height;
			this.game.initPlayers();
			this.game.ball.init();
			this.registerEvents();
		};
	}
}