const	clear = () =>
{
	game.board.ctx.fillStyle = "#fff";
	game.board.ctx.fillRect(0, 0, game.board.dim.width, game.board.dim.height);
}

const	update = () =>
{
	game.player_one.update();
	game.player_two.update();
	game.ball.update();
}

const	render = () =>
{
	clear();
	
	game.player_one.render();
	game.player_two.render();
	game.ball.render();
	game.net.render();
}

const gameEngine = () =>
{
	update();
	render();
	window.requestAnimationFrame(gameEngine);
};

window.requestAnimationFrame(gameEngine);

const	keyHookDown = (e) =>
{
	//console.log(e.keyCode);
	switch (e.keyCode)
	{
		case 38: // fleche up
			actionKeyPress = 38;
			break; 
		case 40: // fleche down
			actionKeyPress = 40;
			break;
		case 83: //S
			actionKeyPress = 83;
			break;
		case 87: //W
			actionKeyPress = 87;
			break;
		default:
			break;
	}
}

const	keyHookReleased = (e) =>
{
	//console.log(e.keyCode);
	actionKeyPress = -1;
}

let game = new Game();
game.board.game = game;

let actionKeyPress = -1;

game.ball.game = game;
game.net.game = game;

game.board.init();
game.player_one.init();
game.player_two.init();
game.player_one.score.gameRef = game;
game.player_two.score.gameRef = game;
console.log(game.player_one.score);

addEventListener("keydown", keyHookDown);
addEventListener("keyup", keyHookReleased);
document.getElementById('stopAnimating').addEventListener('click',function(){
	game.continueAnimating=false;
});
document.getElementById('keepAnimating').addEventListener('click',function(){
	game.continueAnimating=true;
	// window.requestAnimationFrame(render);
});

