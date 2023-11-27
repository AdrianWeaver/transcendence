/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
import MenuBar from "../../Component/MenuBar/MenuBar";

import { useNavigate } from "react-router-dom";


// eslint-disable-next-line max-statements
const	GameSetup = () =>
{
    const	navigate = useNavigate();

    const	goToClassicGame = () =>
    {
        navigate("/test-ball");
    };

    const goToSpecialGame = () =>
    {
        navigate("/test-ball?mode=upside-down");
    };

	const	centerButtonsStyle = {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		// height: "100vh"
	};

	const buttonStyle = {
		margin: "0 10px"
	};

    return (
        <>
        < MenuBar />
		{/* <div style={{textAlign: 'center'}}>
			<div style={{padding: '1rem'}}>
			<div style={{marginTop: '.5rem'}}></div>
				<h1 style={{fontSize: '1.875rem'}}>Welcome to our version of PONG game!</h1>
				<p style={{fontSize: '0.875rem'}}>This game was realized in the framework of our project <em>ft_transcendance</em> at 42 school in Paris.<br/> It may have made us cry at times, but we are happy to present it to you today.</p>
				<div style={{marginTop: '1rem'}}></div>
				<h2 style={{fontSize: '1.25rem'}, {fontWeight: 'bold'}}>Some basic rules:</h2>
				<ol style={{fontSize: '0.875rem'}}>
					<li>There are two players. If you log in first, you will automatically become Player 1.<br/> Otherwise, you'll be Player 2.</li>
					<div style={{marginTop: '.5rem'}}></div>
					<li>Player 1 is always on the left side, and Player 2 is on the right side.</li>
					<div style={{marginTop: '.5rem'}}></div>
					<li>Whenever you miss the ball, your adversary earns one point. <br/>The player who is the first one to earn 13 points wins, and the game stops.</li>
					<div style={{marginTop: '.5rem'}}></div>
					<li>The ball will start moving in a random direction to avoid any discrimination.</li>
					<div style={{marginTop: '.5rem'}}></div>
					<li>Whenever a player misses the ball, the ball will start in his direction in the next round.</li>
				</ol>
				<div style={{marginTop: '1rem'}}></div>
				<h2 style={{fontSize: '1.25rem'}, {fontWeight: 'bold'}}>Nevertheless, if you choose the special mode, <br/>the game might get a little drunk ^^</h2>

				<div style={{marginTop: '.875rem'}}></div>
				<div>It is now time to choose your mode:</div>
				<div style={{marginTop: '1.875rem'}}></div>
				<div style={centerButtonsStyle}>
					<button style={{padding: '.2rem'}} onClick={goToClassicGame}>Classic mode</button>
					<div style={{marginLeft: '1rem'}}></div>
					<button style={{padding: '.2rem'}} onClick={goToSpecialGame}> Special mode</button>
				</div>
			</div>
		</div> */}
        {/* </body> */}
        </>
    );
};

export default GameSetup;
