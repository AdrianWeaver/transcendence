class	SelectorAngle
{
	constructor ()
	{
		this.origin = new Position();
		this.posEnd = new Position();
		this.isActive = true;
		this.gameRef = undefined;
		this.side = undefined;
		this.angle = 0;
		this.angleLimitTop = 270;
		this.angleLimitBottom = 90;
		this.angleDirection = "bottom";
		this.radius = 15;

		this.setActive = (side_string) =>
		{
			this.isActive = true;
			this.side = side_string;
			if (side_string === "left")
			{
				//angles limits
				this.angle = 0;
				
			}
			if (side_string === "right")
			{
				//angles limits
				this.angle = 180;
				
			}
		};
		this.lockAngle = () =>
		{
			this.setActive = false;
		}
		this.normalizeAngle = () =>
		{
			this.angle = this.angle % 360;

			// force to be a positive remainder
			this.angle = (this.angle + 360) % 360;
		}
		this.update = () =>
		{
			if (this.isActive)
			{
				let	center;
				let	paddle_height;
				let	paddle_width;
				let	ball_radius;
			
				paddle_height = this.gameRef.player_one.racket.dim.height;
				paddle_width = this.gameRef.player_two.racket.dim.width;
				center = this.origin.y + (paddle_height / 2);
				ball_radius = this.gameRef.ball.radius;
				this.origin.y = center;
				if (this.side === "left")
					this.origin.x = this.origin.x + paddle_width + ball_radius;
				if (this.side === "right")
					this.origin.x = this.origin.x - ball_radius;
				this.radius = paddle_height / 2;
				// this.radius = this.radius + (this.radius * 0.33);
				this.posEnd.x = this.origin.x + Math.cos(Math.PI * this.angle / 180) * this.radius;
				this.posEnd.y = this.origin.y + Math.sin(Math.PI * this.angle / 180) * this.radius;
				
				if (this.side === "left")
				{
					if (this.angleDirection === "bottom")
					{
						this.angle += 1;
						if (this.angle == 90)
						{
							this.angleDirection = "top";
						}
					}
					if (this.angleDirection === "top")
					{
						this.angle -= 1;
						if (this.angle === 270)
						{
							this.angleDirection = "bottom";
						}
					}
				}
				if (this.side === "right")
				{
					if (this.angleDirection === "bottom")
					{
						this.angle -= 1;
						if (this.angle == 90)
						{
							this.angleDirection = "top";
						}
					}
					if (this.angleDirection === "top")
					{
						this.angle += 1;
						if (this.angle === 270)
						{
							this.angleDirection = "bottom";
						}
					}
				}
				this.normalizeAngle();
			}
		};
		this.render = () =>
		{
			if (this.isActive)
			{
				let ctx;
				
				ctx = this.gameRef.board.ctx;
				ctx.fillStyle = 'red';
				ctx.beginPath();
				ctx.moveTo(this.origin.x, this.origin.y);
				ctx.lineTo(this.posEnd.x, this.posEnd.y);
				ctx.stroke();
			}
		};
	}
}
