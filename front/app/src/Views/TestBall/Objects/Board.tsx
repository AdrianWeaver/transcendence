/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import Game from "./Game";
import Dimension from "./Dimension";

import { createRef } from "react";

class Board
{
	public borderStyle: string;
	public backgroundColor: string;
	public irlWidth: number;
	public irlHeight: number;
	public irlRatio: number;
	public canvasRef: React.RefObject<HTMLCanvasElement> | null;
	public canvas: HTMLCanvasElement | null;
	public ctx: CanvasRenderingContext2D | null | undefined;
	public dim: Dimension;
	public socket: React.MutableRefObject<any> | null;
	public game: Game | undefined;
	public setHeight: () => number;
	public updateSizeAfterResize: () => void;
	public registerEvents: () => void;
	public init: () => void;

	public constructor()
	{
		this.borderStyle = "1px solid";
		this.backgroundColor = "#FFF";
		this.irlWidth = 274;
		this.irlHeight = 152.5;
		this.irlRatio = this.irlHeight / this.irlWidth;
		this.socket = null;
		this.canvasRef = createRef<HTMLCanvasElement>();
		this.canvas = this.canvasRef.current;
		this.ctx = this.canvas?.getContext("2d");
		if (this.ctx)
		{
			this.ctx.font = "30px Arial";
			this.ctx.fillStyle = "#000";
			this.ctx.textAlign = "center";
		}
		this.dim = new Dimension();
		this.game = undefined;
		this.setHeight = () =>
		{
			this.dim.height = this.irlRatio * this.dim.width;
			return (this.dim.height);
		};
		this.updateSizeAfterResize = () =>
		{
			const	prevWidth = this.dim.width;
			const	prevHeight = this.dim.height;
			const	windowWidth = window.innerWidth;
			const	canvasWidth = windowWidth * 0.66;
			const	canvasHeight = this.setHeight();

			this.dim.width = canvasWidth;
			this.dim.height = canvasHeight;
			if (this.canvas)
			{
				this.canvas.width = this.dim.width;
				this.canvas.height = this.dim.height;
			}
			const	multiplicatorWidth = this.dim.width / prevWidth;
			const	multiplicatorHeight = this.dim.height / prevHeight;

			if (this.game && this.game.playerOne)
			{
				this.game.playerOne.pos.x = this.game.playerOne.pos.x
											* multiplicatorWidth;
				this.game.playerOne.pos.y = this.game.playerOne.pos.y
											* multiplicatorHeight;
				this.game.playerOne.racket.defineRacketSize();
			}
			if (this.game && this.game.playerTwo)
			{
				this.game.playerTwo.pos.x = this.game.playerTwo.pos.x
											* multiplicatorWidth;
				this.game.playerTwo.pos.y = this.game.playerTwo.pos.y
											* multiplicatorHeight;
				this.game.playerTwo.racket.defineRacketSize();
			}
			if (this.game && this.game.ball)
			{
				this.game.ball.pos.x *= multiplicatorWidth;
				this.game.ball.pos.y *= multiplicatorHeight;
			}
			const	action = {
				type: "resize",
			};
			if (this.socket)
				this.socket.emit("info", action);
		};
		this.registerEvents = () =>
		{
			addEventListener("resize", this.updateSizeAfterResize);
		};
		// eslint-disable-next-line max-statements
		this.init = () =>
		{
			const windowWidth = window.innerWidth;
			this.dim.width = windowWidth * 0.66;
			this.setHeight();
			if (this.canvas)
			{
				this.canvas.style.border = this.borderStyle;
				this.canvas.width = this.dim.width;
				this.canvas.height = this.dim.height;
			}
			if (this.game)
			{
				this.game.initPlayers();
				this.game.ball.init();
			}
			this.registerEvents();
		};
	}
}

export default Board;
