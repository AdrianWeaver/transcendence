/* eslint-disable curly */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */

import Game from "./Game";
import Position from "./Position";

class Ball
{
	public pos: Position;
	public radius: number;
	public startAngle: number;
	public endAngle: number;
	public game: Game | undefined;
	public speedX: number;
	public speedY: number;
	public angle: number;
	public moveDirection: number | undefined;
	public firstSetDirection: number;
	public maxAngle: number;
	public maxSpeed: number;
	public init: () => void;
	public render: () => void;
	public move: (x: number, y: number) => void;
	public wasTopWallHit: () => void;
	public wasBottomWallHit: () => void;
	public degreesToRadians: (degrees: number) => number;
	public radiansToDegrees: (radians: number) => number;
	public getBounceAngle: () => number;

	public constructor()
	{
		this.pos = new Position();
		this.radius = 0;
		this.startAngle = 0;
		this.endAngle = 2 * Math.PI;
		this.game = undefined;
		this.speedX = 0;
		this.speedY = 0;
		this.angle = 0;
		this.moveDirection = undefined;
		this.firstSetDirection = 1;
		// this.maxbounceAngle = 0;
		this.maxAngle = 0;
		this.maxSpeed = 0;
		this.init = () =>
		{
			if (this.game)
			{
				this.pos.x = this.game.board.dim.width / 2;
				this.pos.y = this.game.board.dim.height / 2;
				this.radius = this.game.board.dim.width * 0.012;
				this.speedX = (this.radius / 2) * 0.5;
			}
			this.maxAngle = this.degreesToRadians(75);
			if (this.firstSetDirection === 1)
			{
				const direction = Math.floor(Math.random() * 10);
				if (direction % 2 === 0)
					this.angle = this.degreesToRadians(180);
				else
					this.angle = this.radiansToDegrees(0);
			}
			this.firstSetDirection = 0;
		};
		this.render = () =>
		{
			if (this.game && this.game.board && this.game.board.ctx)
			{
				this.radius = this.game.board.dim.width * 0.012;
				this.game.board.ctx.beginPath();
				this.game.board.ctx.arc(this.pos.x, this.pos.y, this.radius,
										this.startAngle, this.endAngle);
				this.game.board.ctx.fill();
			}
			if (this.game === undefined)
				console.error("this.game is undefined");
			if (this.game && this.game.board === undefined)
				console.error("this.game.board is undefined");
			if (this.game && this.game.board
				&& this.game.board.ctx === undefined)
				console.error("this.game.board.ctx is undefined");
		};
		this.move = (x: number, y: number) =>
		{
			this.pos.x = x;
			this.pos.y = y;
		};
		this.wasTopWallHit = () =>
		{
			if ( this.pos.y < this.radius )
			{
				// this.touchAudio.play();
				this.pos.y = this.radius;
				this.angle = ( Math.PI * 2 ) - this.angle;
			}
		};
		this.wasBottomWallHit = () =>
		{
			if (this.game)
			{
				if (this.pos.y + this.radius > this.game.board.dim.height)
				{
					// this.touchAudio.play();
					this.pos.y = this.game.board.dim.height - this.radius;
					this.angle = ( Math.PI * 2 ) - this.angle;
				}
			}
		};
		this.degreesToRadians = (degrees) =>
		{
			const pi = Math.PI;
			return (degrees * (pi/180));
		};
		this.radiansToDegrees = (radians) =>
		{
			const pi = Math.PI;
			return (radians * (180/pi));
		};
		this.getBounceAngle = () =>
		{
			let relativeIntersectY;
			relativeIntersectY = 0;
			if (this.game)
			{
				if (this.pos.x > this.game.board.dim.width / 2)
					relativeIntersectY = (this.game.playerTwo.pos.y
						+ (this.game.playerTwo.racket.dim.height / 2))
						- this.pos.y;
				else
					relativeIntersectY = (this.game.playerOne.pos.y
						+ (this.game.playerTwo.racket.dim.height / 2))
						- this.pos.y;
			}
			// ball's interception relative to the middle of the paddle
			let normalizedRelativeIntersectionY;
			if (this.game)
				normalizedRelativeIntersectionY = relativeIntersectY
					/ (this.game.playerTwo.racket.dim.height / 2);
			let bounceAngle;
			bounceAngle = 0;
			if (normalizedRelativeIntersectionY)
			{
				bounceAngle = normalizedRelativeIntersectionY
					* this.radiansToDegrees((Math.PI / 4));
				if (normalizedRelativeIntersectionY < 0)
					normalizedRelativeIntersectionY *= -1;
				if (normalizedRelativeIntersectionY <= 0.15)
					this.speedX = (this.radius / 2) * 0.5;
				else if (normalizedRelativeIntersectionY <= 0.2)
					this.speedX = ((this.radius / 2) * 0.5) * 1.5;
				else if (normalizedRelativeIntersectionY <= 0.35)
					this.speedX = ((this.radius / 2) * 0.5) * 2;
				else
					this.speedX = ((this.radius / 2) * 0.5) * 2.5;
			}
			return (bounceAngle);
		};
	}
}

export default Ball;
