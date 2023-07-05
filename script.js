const	clear = () =>
{
	game.board.ctx.fillStyle = "#fff";
	game.board.ctx.fillRect(0, 0, game.board.dim.width, game.board.dim.height);
}

const	update = () =>
{
	game.player_one.updatePlayerPosition();
	game.player_two.updatePlayerPosition();
	game.ball.update();
}

const	render = () =>
{
	clear();
	update();
	
	game.player_one.render();
	game.player_two.render();
	game.player_one.renderScore();
	game.player_two.renderScore();
	if (game.startDisplayed == true)
		game.displayStartMessage();
	game.ball.render();
	game.net.render();
	window.requestAnimationFrame(render);
}

const	keyHookDown = (e) =>
{
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
	actionKeyPress = -1;
}

let game = new Game();
game.board.game = game;

let actionKeyPress = -1;

game.ball.game = game;
game.net.game = game;

game.board.init();

addEventListener("keydown", keyHookDown);
addEventListener("keyup", keyHookReleased);
document.getElementById('start').addEventListener('click',function(){
	let startAudio = document.querySelector('#startSound');
	startAudio.play();
	game.continueAnimating = true;
	game.startDisplayed = false;
});
document.getElementById('stopAnimating').addEventListener('click',function(){
	game.continueAnimating = false;
});
document.getElementById('keepAnimating').addEventListener('click',function(){
	game.continueAnimating = true;
	// window.requestAnimationFrame(render);
});
window.requestAnimationFrame(render);