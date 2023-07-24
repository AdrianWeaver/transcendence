/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
class	VerticalStroke
{
	public	x: number;
	public	ctx: CanvasRenderingContext2D;
	public	grad: CanvasGradient;
	public	size: SizeModel;
	public	draw: () => void;
	public	update: () => void;

	public	constructor
	(
		x: number,
		ctx: CanvasRenderingContext2D,
		grad: CanvasGradient,
		size: SizeModel
	)
	{
		this.x = x;
		this.ctx = ctx;
		this.grad = grad;
		this.size = size;
		this.draw = () =>
		{
			this.ctx.beginPath();
			this.ctx.lineWidth = 1;
			this.ctx.strokeStyle = this.grad;
			this.ctx.moveTo(this.size.width / 2, 200);
			this.ctx.lineTo(this.x, this.size.height);
			this.ctx.stroke();
		};
		this.update = () =>
		{
			this.draw();
		};
	}
}

export default VerticalStroke;
