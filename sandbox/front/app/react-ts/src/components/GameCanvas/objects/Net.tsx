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

			const	newNetHeight = this.game.board.dim.height * ratioHeight;
			const	newNetWidth = this.game.board.dim.width * ratioWidth;

			this.dim.setDimension(newNetHeight, newNetWidth);
        };
        this.render = () =>
		{
			this.pos.x = this.game.board.dim.width /2;
			this.defineNetRectSize();
			this.game.board.ctx.fillStyle = "#000";
			let delay = 0;
			while (delay < this.game.board.dim.height + this.dim.height)
			{
				this.game.board.ctx.fillRect(this.pos.x,
                    this.pos.y + delay, this.dim.width, this.dim.height);
				delay += this.dim.height + this.dim.height/2;
			}
		};
    }

}

export default Net;
