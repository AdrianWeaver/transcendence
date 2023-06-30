//https://maththebeautiful.com/ball-bounce/

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
		// this.bounce = 0;
		this.moveDirection = undefined;
		this.firstSetDirection = 1;
		// this.maxbounceAngle = 0;
		this.maxAngle = 0;
		this.maxSpeed = 0;
		this.init = () =>
		{
			this.pos.x = this.game.board.dim.width / 2;
			this.pos.y = this.game.board.dim.height / 2;
			this.radius = this.game.board.dim.width * 0.012;
			this.speed = (this.radius / 2) * 0.5;
			this.maxAngle = this.degrees_to_radians(75);
			if (this.firstSetDirection == 1)
			{
				let direction = Math.floor(Math.random() * 10);	
				if (direction % 2 == 0)
				{
					this.moveDirection = "left";
					this.angle = this.degrees_to_radians(180);
				}
				else
				{
					this.moveDirection = "right";
					this.angle = this.radians_to_degrees(0);
				}
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
			if (this.angle > this.degrees_to_radians(90)
				&& this.angle <= this.degrees_to_radians(270))
				this.moveLeft();
			else
				this.moveRight();
		}
		this.moveLeft = () =>
		{
			if (this.game.continueAnimating == true)
			{
				let newPosX = this.pos.x + Math.cos ( this.angle ) * this.speed;
				let newPosY = this.pos.y + Math.sin ( this.angle ) * this.speed;
				if (this.game.player_one.isLeftPlayer(newPosX, newPosY) == true)
				{
     				this.angle = Math.PI - this.angle;
					this.angle = this.degrees_to_radians(0);
					this.angle -= this.degrees_to_radians(this.getBounceAngle());
				}
				else
				{
					this.pos.x += Math.cos (this.angle) * this.speed;
					this.pos.y += Math.sin (this.angle) * this.speed;
				}
				this.wasTopWallHit();
				this.wasBottomWallHit();
				if (this.pos.x <= 0)
				{
					this.game.player_two.score.value += 1;
					this.angle = this.degrees_to_radians(180);
					this.init();
				}
			}
		}
		this.moveRight = () =>
		{
			if (this.game.continueAnimating == true)
			{
				let newPosX = this.pos.x + Math.cos ( this.angle ) * this.speed;
				let newPosY = this.pos.y + Math.sin ( this.angle ) * this.speed;
				if (this.game.player_two.isRightPlayer(newPosX, newPosY) == true) 
				{
					this.pos.x = this.game.board.dim.width - this.radius;
     				this.angle = Math.PI - this.angle;
					this.angle += this.degrees_to_radians(this.getBounceAngle());
				}
				else
				{
					this.pos.x += Math.cos ( this.angle ) * this.speed;
					this.pos.y += Math.sin ( this.angle ) * this.speed;
				}
				this.wasTopWallHit();
				this.wasBottomWallHit();
				if (this.pos.x >= this.game.board.dim.width)
				{
					this.game.player_one.score.value += 1;
					this.angle = this.degrees_to_radians(0);
					this.init();
				}
			}
		}
		this.wasTopWallHit = () =>
		{
			if ( this.pos.y < this.radius ) 
			{
				this.pos.y = this.radius;
				this.angle = ( Math.PI * 2 ) - this.angle;
			}
		}
		this.wasBottomWallHit = () =>
		{
			if ( this.pos.y + this.radius > this.game.board.dim.height )
			{
				this.pos.y = this.game.board.dim.height - this.radius;
				this.angle = ( Math.PI * 2 ) - this.angle;
			}
		}
		this.degrees_to_radians = (degrees) =>
		{
			let pi = Math.PI;
			return (degrees * (pi/180));
		};
		this.radians_to_degrees = (radians) =>
		{
			let pi = Math.PI;
			return (radians * (180/pi));
		};
		this.getBounceAngle = () =>
		{
			let relativeIntersectY = 0;
			if (this.pos.x > this.game.board.dim.width / 2)
			{
				relativeIntersectY = (this.game.player_two.pos.y + (this.game.player_two.racket.dim.height / 2)) - this.pos.y;
			}
			else
				relativeIntersectY = (this.game.player_one.pos.y + (this.game.player_two.racket.dim.height / 2)) - this.pos.y;
			//ball's interception relative to the middle of the paddle
			let normalizedRelativeIntersectionY = relativeIntersectY / (this.game.player_two.racket.dim.height / 2);
			let bounceAngle = normalizedRelativeIntersectionY * this.radians_to_degrees(this.maxAngle);
			return (bounceAngle);
		}
	}
}