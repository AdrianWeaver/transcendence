class	Player
{
	constructor()
	{
		this.pos = new Position();
		this.racket = new Racket();
		this.score = new Score();
		this.game = undefined;
		this.side = undefined;
		this.uuid = undefined;
		this.name = undefined;
		this.init = () =>
		{
			this.score.init(this.side);
			if (this.side === "left")
				this.updateSide = this.updateLeft;
			if (this.side === "right")
				this.updateSide = this.updateRight;
		};
		this.update = () =>
		{
			this.score.update();
			this.racket.update();
			this.updatePlayerPosition();
		};
		this.render = () =>
		{
			this.score.render();
			this.racket.render();
			this.game.board.ctx.fillStyle = "#000";
			this.game.board.ctx.fillRect(this.pos.x, this.pos.y, this.racket.dim.width, this.racket.dim.height);
		}
		this.updateSide = undefined;
		this.updateLeft = () =>
		{
			if (this.game.continueAnimating == true)
			{
				switch (actionKeyPress)
				{
					case 87:
						if (this.side === "left")
						{
							this.pos.y = this.pos.y - ((this.racket.dim.height / 2) * 0.5);
							if (this.pos.y < 0)
								this.pos.y = 0;
						}
						break;
					case 83:
						if (this.side === "left")
						{
							if (this.pos.y + this.racket.dim.height > this.game.board.dim.height)
								this.pos.y = this.game.board.dim.height - this.racket.dim.height;
							this.pos.y = this.pos.y + ((this.racket.dim.height / 2) * 0.5);
						}
						break;
					case 38:
						if (this.side === "right")
						{
							this.pos.y = this.pos.y - ((this.racket.dim.height / 2) * 0.5);
							if (this.pos.y < 0)
								this.pos.y = 0;
						}
						break;
					case 40:
						if (this.side === "right")
						{
							if (this.pos.y + this.racket.dim.height > this.game.board.dim.height)
								this.pos.y = this.game.board.dim.height - this.racket.dim.height;
							this.pos.y = this.pos.y + ((this.racket.dim.height / 2) * 0.5);
						}
						break;
					default:
						break;
				}
			}
			// FIX
			this.bindPlayerToRacketPos();
		};
		this.updateRight = () =>
		{
			if (this.game.continueAnimating == true)
			{
				switch (actionKeyPress)
				{
					case 87:
						if (this.side === "left")
						{
							this.pos.y = this.pos.y - ((this.racket.dim.height / 2) * 0.5);
							if (this.pos.y < 0)
								this.pos.y = 0;
						}
						break;
					case 83:
						if (this.side === "left")
						{
							if (this.pos.y + this.racket.dim.height > this.game.board.dim.height)
								this.pos.y = this.game.board.dim.height - this.racket.dim.height;
							this.pos.y = this.pos.y + ((this.racket.dim.height / 2) * 0.5);
						}
						break;
					case 38:
						if (this.side === "right")
						{
							this.pos.y = this.pos.y - ((this.racket.dim.height / 2) * 0.5);
							if (this.pos.y < 0)
								this.pos.y = 0;
						}
						break;
					case 40:
						if (this.side === "right")
						{
							if (this.pos.y + this.racket.dim.height > this.game.board.dim.height)
								this.pos.y = this.game.board.dim.height - this.racket.dim.height;
							this.pos.y = this.pos.y + ((this.racket.dim.height / 2) * 0.5);
						}
						break;
					default:
						break;
				}
			}
			// FIX
			this.bindPlayerToRacketPos();
		};
		// this.update = () =>
		// {
		// 	if ((this.updateSide === undefined)
		// 		&&!(this.updateSide instanceof Function))
		// 		return (console.error("Error : no updateSide function provided, please fix with init()"));
		// };

		this.updatePlayerPosition = () =>
		{
			if (this.game.continueAnimating == true)
			{
				switch (actionKeyPress)
				{
					case 87:
						if (this.side === "left")
						{
							this.pos.y = this.pos.y - ((this.racket.dim.height / 2) * 0.5);
							if (this.pos.y < 0)
								this.pos.y = 0;
						}
						break;
					case 83:
						if (this.side === "left")
						{
							if (this.pos.y + this.racket.dim.height > this.game.board.dim.height)
								this.pos.y = this.game.board.dim.height - this.racket.dim.height;
							this.pos.y = this.pos.y + ((this.racket.dim.height / 2) * 0.5);
						}
						break;
					case 38:
						if (this.side === "right")
						{
							this.pos.y = this.pos.y - ((this.racket.dim.height / 2) * 0.5);
							if (this.pos.y < 0)
								this.pos.y = 0;
						}
						break;
					case 40:
						if (this.side === "right")
						{
							if (this.pos.y + this.racket.dim.height > this.game.board.dim.height)
								this.pos.y = this.game.board.dim.height - this.racket.dim.height;
							this.pos.y = this.pos.y + ((this.racket.dim.height / 2) * 0.5);
						}
						break;
					default:
						break;
				}
			}
			// FIX
			this.bindPlayerToRacketPos();
		}
		this.bindPlayerToRacketPos = () =>
		{
			this.racket.pos = this.pos;
			this.racket.update();
		}
		this.isLeftPlayer = (p_pos_x, p_pos_y) =>
		{
			if (p_pos_x <= this.pos.x + this.racket.dim.width
				&& (p_pos_y >= this.pos.y
				&& p_pos_y <= this.pos.y + this.racket.dim.height))
				return (true);
			else
				return (false);
		}
		this.isRightPlayer = (p_pos_x, p_pos_y) =>
		{
			if (p_pos_x >= this.pos.x
				&& (p_pos_y >= this.pos.y
				&& p_pos_y <= this.pos.y + this.racket.dim.height))
				return (true);
			else
				return (false);
		}
	}
}
