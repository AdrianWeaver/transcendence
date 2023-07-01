class	Racket
{
	constructor()
	{
		this.dim = new Dimension();
		this.gameRef = undefined;
		this.pos = new Position();
		this.angleSelector = new SelectorAngle();
		this.update = () =>
		{
			
			this.angleSelector.origin =
			{
				x: this.pos.x,
				y: this.pos.y
			};
			this.angleSelector.update();
		};
		this.render = () =>
		{
			this.angleSelector.render();
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