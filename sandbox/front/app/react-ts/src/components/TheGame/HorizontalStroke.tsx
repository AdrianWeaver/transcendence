/* eslint-disable max-classes-per-file */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */

class	Position
{
	public	x: number;
	public	y: number;

	public	constructor(x: number, y: number)
	{
		this.x = x;
		this.y = y;
	}
}

class	HorizontalStroke
{
	public	id: number;
	public	startPos: Position;
	public	endPos: Position;
	public	dy: number;
	public	opacity: number;
	public	draw: (ctx: CanvasRenderingContext2D) => void;
	public	update: () => void;
	public	firstPass: boolean;
	public	percentage: number;
	public	limit: number;
	public	limitReached: boolean;

	// eslint-disable-next-line max-params
	public	constructor(
		startX: number,
		startY: number,
		endX: number,
		endY: number,
		limit: number
	)
	{
		this.id = -1;
		this.startPos = new Position(startX, startY);
		this.endPos = new Position(endX, endY);
		this.dy = 0.5;
		this.opacity = 0;
		this.firstPass = false;
		this.percentage = 0.1;
		this.limit = limit;
		this.limitReached = false;
		this.draw = (ctx: CanvasRenderingContext2D) =>
		{
			ctx.lineWidth = 1;
			ctx.strokeStyle = "rgba(0, 255, 0, " + this.opacity + ")";
			ctx.beginPath();
			ctx.moveTo(this.startPos.x, this.startPos.y);
			ctx.lineTo(this.endPos.x, this.endPos.y);
			ctx.stroke();
		};
		this.update = () =>
		{
			// console.log("update function");
			this.dy += 0.05;
			this.startPos.y += this.dy;
			this.endPos.y += this.dy;
			this.opacity += 0.003;
			if (this.startPos.y > this.limit)
				this.limitReached = true;
		};
	}
}

export default HorizontalStroke;
