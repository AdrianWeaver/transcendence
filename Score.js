class	Score
{
	/** left or right */
	constructor()
	{
		this.pos = new Position();
		this.gameRef = undefined;
		this.value = 0;
		this.side = undefined;
		this.fillStyle = "#000";
		this.size = 1;
		this.fontFamily = "bald Arial";
		this.updateSide = undefined;
		this.updateLeft = () =>
		{
			this.pos.x = (this.gameRef.board.dim.width / 2) - (this.gameRef.board.dim.width * 0.06) - (this.size / 2);
			this.pos.y = this.gameRef.board.dim.height * 0.15;
		};
		this.updateRight = () =>
		{
			this.pos.x = (this.gameRef.board.dim.width / 2) + (this.gameRef.board.dim.width * 0.06);
			this.pos.y = (this.gameRef.board.dim.height * 0.15);
		};
		this.updateSize = () =>
		{
			this.size = this.gameRef.board.dim.width * 0.07;
		};
		this.setCtx = () =>
		{
			this.gameRef.board.ctx.fillStyle = this.fillStyle;
			this.gameRef.board.ctx.font = this.size + "px " + this.fontFamily;
		};
		this.init = (p_side) =>
		{
			if (p_side === undefined)
				console.error("Side undefined into score");
			this.side = p_side;
			if (this.side === "left")
				this.updateSide = this.updateLeft;
			if (this.side === "right")
				this.updateSide = this.updateRight;
		};
		this.update = () =>
		{
			if ((this.updateSide === undefined)
				&&!(this.updateSide instanceof Function))
				return (console.error("Error : no updateSide function provided, please fix with init()"));
			this.updateSize();
			this.updateSide();
		};
		this.render = () =>
		{
			this.setCtx();
			this.gameRef.board.ctx.strokeText(this.value, this.pos.x, this.pos.y);
		};
	}
}
