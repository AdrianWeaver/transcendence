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
    public update: () => void;
    public render: () => void;
    public move: () => void;
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
		// this.failedAudio = document.querySelector('#fail');
		// this.touchAudio = document.querySelector('#touch');
		this.moveDirection = undefined;
		this.firstSetDirection = 1;
		// this.maxbounceAngle = 0;
		this.maxAngle = 0;
		this.maxSpeed = 0;
		this.init = () =>
		{
			this.pos.x = this.game.board.dim.width / 2;
			this.pos.y = this.game.board.dim.height / 2;
			this.radius = this.game.board.dim.width * 0.012;
			this.speedX = (this.radius / 2) * 0.5;
			// this.speedY = (this.radius / 2) * 0.5;
			this.maxAngle = this.degreesToRadians(75);
			if (this.firstSetDirection == 1)
			{
				let direction = Math.floor(Math.random() * 10);	
				if (direction % 2 == 0)
					this.angle = this.degreesToRadians(180);
				else
					this.angle = this.radiansToDegrees(0);
			}
			this.firstSetDirection = 0;
		}
        this.update = () =>
        {
			this.radius = this.game.board.dim.width * 0.012;
			this.move();
		}
		this.render = () =>
		{
			this.radius = this.game.board.dim.width * 0.012;
			this.game.board.ctx.beginPath();
			this.game.board.ctx.arc(this.pos.x, this.pos.y, this.radius, this.startAngle, this.endAngle);
			this.game.board.ctx.fill();
		}
		this.move = () =>
		{
			if (this.game.continueAnimating == true)
			{
				let newPosX = this.pos.x + Math.cos(this.angle) * this.speedX;
				let newPosY = this.pos.y + Math.sin ( this.angle ) * this.speedX;
				if (this.game.playerOne.isLeftPlayer(newPosX, newPosY) == true)
				{
     				this.angle = Math.PI - this.angle;
					this.angle = this.degreesToRadians(0);
					this.angle -= this.degreesToRadians(this.getBounceAngle());
				}
				else if (this.game.playerTwo.isRightPlayer(newPosX, newPosY) == true) 
				{
					this.pos.x = this.game.playerTwo.pos.x - this.radius;
     				this.angle = Math.PI - this.angle;
					this.angle += this.degreesToRadians(this.getBounceAngle());
				}
				else
				{
					this.pos.x += Math.cos (this.angle) * this.speedX;
					this.pos.y += Math.sin (this.angle) * this.speedX;
				}
				this.wasTopWallHit();
				this.wasBottomWallHit();
				if (this.pos.x <= 0)
				{
					this.game.playerTwo.score += 1;
					// this.failedAudio.play();
					this.angle = this.degrees_to_radians(180);
					this.init();
				}
				if (this.pos.x >= this.game.board.dim.width)
				{
					this.game.playerOne.score += 1;
					// this.failedAudio.play();
					this.angle = this.degreesToRadians(0);
					this.init();
				}
			}
		}
		this.wasTopWallHit = () =>
		{
			if ( this.pos.y < this.radius ) 
			{
				// this.touchAudio.play();
				this.pos.y = this.radius;
				this.angle = ( Math.PI * 2 ) - this.angle;
			}
		}
		this.wasBottomWallHit = () =>
		{
			if ( this.pos.y + this.radius > this.game.board.dim.height )
			{
				// this.touchAudio.play();
				this.pos.y = this.game.board.dim.height - this.radius;
				this.angle = ( Math.PI * 2 ) - this.angle;
			}
		}
		this.degreesToRadians = (degrees) =>
		{
			let pi = Math.PI;
			return (degrees * (pi/180));
		};
		this.radiansToDegrees = (radians) =>
		{
			let pi = Math.PI;
			return (radians * (180/pi));
		};
		this.getBounceAngle = () =>
		{
			let relativeIntersectY = 0;
			if (this.pos.x > this.game.board.dim.width / 2)
			{
				relativeIntersectY = (this.game.playerTwo.pos.y + (this.game.playerTwo.racket.dim.height / 2)) - this.pos.y;
			}
			else
				relativeIntersectY = (this.game.playerOne.pos.y + (this.game.playerTwo.racket.dim.height / 2)) - this.pos.y;
			//ball's interception relative to the middle of the paddle
			let normalizedRelativeIntersectionY = relativeIntersectY / (this.game.playerTwo.racket.dim.height / 2);
			let bounceAngle = normalizedRelativeIntersectionY * this.radians_to_degrees((Math.PI / 4));
			if (normalizedRelativeIntersectionY < 0)
				normalizedRelativeIntersectionY *= -1;
			if (normalizedRelativeIntersectionY <= 0.15)
				this.speedX = (this.radius / 2) * 0.5;
			else if (normalizedRelativeIntersectionY <= 0.4)
				this.speedX = ((this.radius / 2) * 0.5) * 1.5;
			else if (normalizedRelativeIntersectionY <= 0.7)
				this.speedX = ((this.radius / 2) * 0.5) * 2;
			else
				this.speedX = ((this.radius / 2) * 0.5) * 2.5;
			// let direction = this.pos.x + this.radius < this.game.board.dim.width / 2 ? 1 : -1;
			return (bounceAngle);
		}
    }
}

export default Ball;