class Ball
{
	constructor()
	{
		this.pos = new Position();
		this.radius = 0;
		this.startAngle = 0;
		this.endAngle = 2 * Math.PI;
		this.game = undefined;
		this.speed = 0;
		this.angle = 0;
		this.bounce = 0;
		this.moveDirection = undefined;
		this.firstSetDirection = 1;
		this.maxbounceAngle = 0;
		this.init = () =>
		{
			this.pos.x = this.game.board.dim.width / 2;
			this.pos.y = this.game.board.dim.height / 2;
			this.radius = this.game.board.dim.width * 0.012;
			this.speed = (this.radius / 2) * 0.5;
			this.maxbounceAngle = (5 * Math.PI) / 12;
			if (this.firstSetDirection == 1)
			{
				let direction = Math.floor(Math.random() * 10);	
				if (direction % 2 == 0)
					this.moveDirection = "left";
				else
					this.moveDirection = "right";
			}
			this.firstSetDirection = 0;
		}
        this.update = () =>
        {
			this.radius = this.game.board.dim.width * 0.012;
		}
		this.render = () =>
		{
			this.radius = this.game.board.dim.width * 0.012;
			this.move();
			this.game.board.ctx.beginPath();
			this.game.board.ctx.arc(this.pos.x, this.pos.y, this.radius, this.startAngle, this.endAngle);
			this.game.board.ctx.fill();
		}
		this.move = () =>
		{
			if (this.moveDirection == "left")
				this.moveLeft();
			if (this.moveDirection == "right")
				this.moveRight();
		}
		this.moveLeft = () =>
		{
			if (this.game.continueAnimating == true)
			{
				let newPos = this.pos.x - this.speed;
				if (this.game.player_one.isLeftPlayer(newPos, this.pos.y) == true)
				{
					this.moveDirection = "right";
					// this.leftPlayerBounceAngle();
				}
				else
				{
					this.pos.x = this.pos.x - this.speed;
					// if (this.pos.y - this.radius < 0 
					// 	|| this.pos.y + this.radius > this.game.board.dim.height)
					// 	this.bounce *= -1;
					// this.pos.y += this.bounce;
				}
				if (this.pos.x <= 0)
				{
					this.game.player_two.score += 1;
					this.moveDirection = "left";
					this.init();
				}
			}
		}
		this.moveRight = () =>
		{
			if (this.game.continueAnimating == true)
			{
				let newPos = this.pos.x + this.speed;
				if (this.game.player_two.isRightPlayer(newPos, this.pos.y) == true)
					this.moveDirection = "left";
				else
				{
					this.pos.x = this.pos.x + this.speed;
					// if (this.pos.y - this.radius < 0
					// 	|| this.pos.y + this.radius > this.game.board.height)
					// 	this.bounce *= -1;
				}
				if (this.pos.x >= this.game.board.dim.width)
				{
					this.game.player_one.score += 1;
					this.moveDirection = "right";
					this.init();
				}
			}
		}
		// this.leftPlayerBounceAngle = () =>
		// {
		// 	let relativeIntersectY = (this.game.player_one.pos.y + (this.game.player_one.racket.dim.height / 2)) - this.pos.y;
		// 	//ball's interception relative to the middle of the paddle
		// 	let normalizedRelativeIntersectionY = relativeIntersectY / (this.game.player_one.racket.dim.height / 2);
		// 	let bounceAngle = normalizedRelativeIntersectionY * this.maxBounceAngle;
		// 	this.bounce = bounceAngle;
		// }
	}
}