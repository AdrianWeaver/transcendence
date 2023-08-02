import Game from "./Game";
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

			const	newRacketHeight = this.game.board.dim.height * ratioHeight;
			const	newRacketWidth = this.game.board.dim.width * ratioWidth;

			this.dim.setDimension(newRacketHeight, newRacketWidth);
		}
    }
}

export default Racket;