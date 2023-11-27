/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */

import GameServe from "./Objects/GameServe";

export class	NodeAnimationFrame
{
	public frameRate: number;
	public frameNumber: number;
	public gameActive: boolean;
	public game: GameServe | undefined;
	public requestFrame: (callbackFunction: any) => void;
	public callbackFunction:
		((timestamp: number, frame: number, game: GameServe) => void) | null;
	public update: (timestamp: number) => void;

	public	getSerializable: () => any;
	constructor()
	{
		this.frameRate = 60;
		this.frameNumber = 0;
		this.gameActive = false;
		this.game = undefined;
		this.requestFrame = (callbackFunction) =>
		{
			if (this.frameNumber === (Number.MAX_VALUE - 1))
				this.frameNumber = 0;
			setTimeout(() =>
			{
				callbackFunction(performance.now());
			}, 1000 / (this.frameRate));
		};
		this.callbackFunction = null;
		this.update = (timestamp) =>
		{
			if (this.callbackFunction === null)
			{
				return ;
			}
			if (this.game)
				this.callbackFunction(timestamp, this.frameNumber, this.game);
			if (this.gameActive === true)
				this.frameNumber++;
			this.requestFrame(this.update);
		};
		this.getSerializable = () =>
		{
			return ({
				frameRate: this.frameRate,
				frameNumber: this.frameNumber,
				gameActive: this.gameActive,
				// game: this.game
			});
		};
	}
}
