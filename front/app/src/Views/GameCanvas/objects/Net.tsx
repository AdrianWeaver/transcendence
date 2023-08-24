/* eslint-disable max-statements */
import Position from "./Position";
import Dimension from "./Dimension";
import Game from "./Game";

class Net
{
	public pos: Position;
	public dim: Dimension;
	public game: Game | undefined;
	public defineNetRectSize: () => void;
	public render: () => void;

	// eslint-disable-next-line max-lines-per-function
	public constructor()
	{
		this.pos = new Position();
		this.dim = new Dimension();
		this.game = undefined;
		this.defineNetRectSize = () =>
		{
			const	ratioHeight = 0.1;
			const	ratioWidth = 0.001;

			let newNetHeight;
			let newNetWidth;
			if (this.game)
			{
				newNetHeight = this.game.board.dim.height * ratioHeight;
				newNetWidth = this.game.board.dim.width * ratioWidth;
			}

			if (newNetHeight && newNetWidth)
				this.dim.setDimension(newNetHeight, newNetWidth);
		};
		this.render = () =>
		{
			if (this.game && this.game.board.ctx)
			{
				this.pos.x = this.game.board.dim.width /2;
				this.defineNetRectSize();
				this.game.board.ctx.fillStyle = "#000";
				let delay;
				delay = 0;
				while (delay < this.game.board.dim.height + this.dim.height)
				{
					this.game.board.ctx.fillRect(this.pos.x,
						this.pos.y + delay, this.dim.width, this.dim.height);
					delay += this.dim.height + this.dim.height/2;
				}
			}
		};
	}

}

export default Net;
