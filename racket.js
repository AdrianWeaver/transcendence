class	Racket
{
	constructor()
	{
		this.dim = new Dimension();
		this.game = undefined;
		this.pos = new Position();
		this.update = () =>
		{
			if (game === undefined)
				console.error("Game is undefined in Racket obj");
			console.log("Racket updated");
		};
		this.render = () =>
		{
			
		};
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