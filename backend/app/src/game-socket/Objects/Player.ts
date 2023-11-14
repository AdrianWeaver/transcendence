/* eslint-disable curly */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import Game from "./GameServe";
import Position from "./Position";
import Racket from "./Racket";

class Player
{
	public	pos: Position;
	public	racket: Racket;
	public	score: number;
	public	game: Game | undefined;
	public	side: string | undefined;
	public	uuid: number | undefined;
	public	socketId: string | undefined;
	public	name: string | undefined;
	public	profileId: string | undefined;
	public	render: () => void;
	public	renderScore: () => void;
	public	updatePlayerPosition: () => void;
	public	isLeftPlayer: (posX: number, posY: number) => boolean;
	public	isRightPlayer: (posX: number, posY: number) => boolean;

	public	getPlayerSocketId: () => string;
	public	getSerializable: () => any;

	public constructor()
	{
		this.pos = new Position();
		this.racket = new Racket();
		this.score = 0;
		this.game = undefined;
		this.side = undefined;
		this.uuid = undefined;
		this.socketId = "undefined";
		this.name = undefined;
		this.profileId = "undefined";
		this.render = () =>
		{
			if (this.game && this.game.board.ctx)
			{
				this.game.board.ctx.fillStyle = "#000";
				this.game.board.ctx.fillRect(this.pos.x,
					this.pos.y, this.racket.dim.width, this.racket.dim.height);
			}
		};
		this.renderScore = () =>
		{
			if (this.game && this.game.board && this.game.board.ctx)
			{
			this.game.board.ctx.fillStyle = "#000";
			const pixels = this.game.board.dim.width * 0.07;
			this.game.board.ctx.font = pixels + "px bald Arial";
			if (this.side === "left")
				this.game.board.ctx.strokeText(this.score.toString(),
					(this.game.board.dim.width / 2)
					- (this.game.board.dim.width * 0.06)
					- (pixels / 2), this.game.board.dim.height * 0.15);
			else
				this.game.board.ctx.strokeText(this.score.toString(),
					(this.game.board.dim.width / 2)
					+ (this.game.board.dim.width * 0.06),
					this.game.board.dim.height * 0.15);
			}
		};
		this.updatePlayerPosition = () =>
		{
			if (this.game && this.game.continueAnimating === true)
			{
				switch (this.game.actionKeyPress)
				{
					case 87:
						if (this.side === "right")
						{
							this.pos.y = this.pos.y
								- ((this.racket.dim.height / 2) * 0.5);
							if (this.pos.y < 0)
								this.pos.y = 0;
						}
						break;
					case 83:
						if (this.side === "right")
						{
							if (this.pos.y + this.racket.dim.height
								>= this.game.board.dim.height)
								this.pos.y = this.game.board.dim.height
												- this.racket.dim.height;
							else
								this.pos.y = this.pos.y
									+ ((this.racket.dim.height / 2) * 0.5);
						}
						break;
					case 38:
						if (this.side === "left")
						{
							this.pos.y = this.pos.y
										- ((this.racket.dim.height / 2) * 0.5);
							if (this.pos.y < 0)
								this.pos.y = 0;
						}
						break;
						case 40:
							if (this.side === "left")
							{
								if (this.pos.y + this.racket.dim.height
									>= this.game.board.dim.height)
									this.pos.y = this.game.board.dim.height
										- this.racket.dim.height;
								else
									this.pos.y = this.pos.y
										+ ((this.racket.dim.height / 2) * 0.5);
							}
							break;
					default:
						break;
				}
			}
		};
		this.isLeftPlayer = (posX, posY) =>
		{
			if (posX <= this.pos.x + this.racket.dim.width
				&& (posY >= this.pos.y
				&& posY <= this.pos.y + this.racket.dim.height))
					return (true);
			else
				return (false);
		};
		this.isRightPlayer = (posX, posY) =>
		{
			if (posX >= this.pos.x
				&& (posY >= this.pos.y
				&& posY <= this.pos.y + this.racket.dim.height))
				return (true);
			else
				return (false);
		};
		this.getSerializable = () =>
		{
			return ({
				pos: this.pos,
				racket: this.racket.getSerializable(),
				score: this.score,
				// game: this.game,
				side: this.side,
				uuid: this.uuid,
				socketId: this.socketId,
				profileId: this.profileId,
				name: this.name
			});
		};
		this.getPlayerSocketId = () =>
		{
			return (this.socketId as string);
		};
	}
}

export default Player;
