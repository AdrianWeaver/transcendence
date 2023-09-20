/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
import MenuBar from "../../Component/MenuBar/MenuBar";

const   GameSetup = () =>
{
    const	displayStyle: React.CSSProperties = {
		textAlign: "center",
		fontSize: "8px"
	};

    return (
        <>
        < MenuBar />
        <head>
            <title>Welcome to Our PONG Game</title>
        </head>
        <body>
            <h1>Welcome to our version of PONG game!</h1>
            <p>This game was realized in the framework of our project <em>ft_transcendance</em> at 42 school in Paris. It may have made us cry at times, but we are happy to present it to you today.</p>

            <h2>Some basic rules:</h2>
            <ul>
                <li>There are two players. If you are the one to log in first, you will automatically become Player 1; otherwise, you'll be Player 2.</li>
                <li>Player 1 is always on the left side, and Player 2 is on the right side.</li>
                <li>Whenever you miss the ball, your adversary earns one point. The player who is the first one to earn 7 points wins, and the game stops.</li>
                <li>The ball will start moving in a random direction to avoid any discrimination.</li>
                <li>Whenever a player misses the ball, the ball will start in his direction in the next round.</li>
            </ul>

            <h2>If you choose the special mode, two particular rules will apply:</h2>
            <ul>
                <li>There will be two balls,</li>
                <li>Must think about it !</li>
            </ul>
            <br />
            <div>It is now time to choose your mode:</div>
        </body>
        </>
    );
};

export default GameSetup;
