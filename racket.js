class	Racket
{
	constructor()
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