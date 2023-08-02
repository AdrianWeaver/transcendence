/* eslint-disable max-lines-per-function */
import Game from "./Game";
import Dimension from "./Dimension";

import { useEffect, useRef } from "react";
import { useAppSelector } from "../../../hooks/redux-hooks";

class Board
{
    public borderStyle: string;
    public backgroundColor: string;
    public irlWidth: number;
    public irlHeight: number;
    public irlRatio: number;
	public canvasRef: React.RefObject<HTMLCanvasElement>;
	// public size: canvasModel;
    public canvas: HTMLCanvasElement | null;
	public ctx: CanvasRenderingContext2D | null | undefined;
    public dim: Dimension;
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
		this.canvasRef = useRef<HTMLCanvasElement>(null);
		// this.size = useAppSelector((state) =>
		// {
		// 	return (state.controller.canvas);
		// });
		// this.canvas = document.getElementById("board");
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
			let prevWidth = this.dim.width; // this.width 
			let	prevHeight = this.dim.height; // this.height obj Borad 
			let windowWidth = window.innerWidth;
			let canvasWidth = windowWidth * 0.66;
			let canvasHeight = this.setHeight();
			
			this.dim.width = canvasWidth;
			this.dim.height = canvasHeight;
			if (this.canvas)
			{
				this.canvas.width = this.dim.width;
				this.canvas.height = this.dim.height;
		
			}
			let multiplicator_width = this.dim.width / prevWidth;
			let multiplicator_height = this.dim.height / prevHeight;

			if (this.game && this.game.playerOne)
			{
				this.game.playerOne.pos.x = this.game.playerOne.pos.x * multiplicator_width;
				this.game.playerOne.pos.y = this.game.playerOne.pos.y * multiplicator_height;
				this.game.playerOne.racket.defineRacketSize();
			}
			if (this.game && this.game.playerTwo)
			{
				this.game.playerTwo.pos.x = this.game.playerTwo.pos.x * multiplicator_width;
				this.game.playerTwo.pos.y = this.game.playerTwo.pos.y * multiplicator_height;
				this.game.playerTwo.racket.defineRacketSize();
			}
			if (this.game && this.game.ball)
			{
				this.game.ball.pos.x *= multiplicator_width;
				this.game.ball.pos.y *= multiplicator_height;
			}
		};
		this.registerEvents = () =>
		{
			addEventListener("resize", this.updateSizeAfterResize);
		};
		// eslint-disable-next-line max-statements
		this.init = () =>
		{
			let windowWidth = window.innerWidth;
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
