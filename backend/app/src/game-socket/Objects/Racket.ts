/* eslint-disable max-statements */
import Game from "./GameServe";
import Dimension from "./Dimension";

class Racket
{
	public dim: Dimension;
	public game: Game | undefined;
	public defineRacketSize: () => void;

	public constructor()
	{
		this.dim = new Dimension();
		this.game = undefined;
		this.defineRacketSize = () =>
		{
			const	ratioHeight = 0.1276595745;
			const	ratioWidth = 0.01183899;
			let newRacketHeight;
			let	newRacketWidth;
			if (this.game)
			{
				newRacketHeight = this.game.board.dim.height
										* ratioHeight;
				newRacketWidth = this.game.board.dim.width
										* ratioWidth;
			}
			if (newRacketHeight && newRacketWidth)
				this.dim.setDimension(newRacketHeight, newRacketWidth);
		};
	}
}

export default Racket;
