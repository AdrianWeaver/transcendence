
import
{
	PayloadAction,
	createSlice
}	from "@reduxjs/toolkit";

import { GameEngineModel as Model } from "../models/redux-models";
// import { setReadyPlayerCount } from "./gameEngineAction";

export const	initialGameEngineState: Model = {
	server:
	{
		dimension:
		{
			height: 0,
			width: 0,
		},
		scaleServer:
		{
			height: 0,
			width: 0
		},
		frameNumber: 0,
		numberOfUser: 0,
		readyPlayerCount: 0,
		playerOneProfileId: 0,
		playerTwoProfileId: 0,
		playerOnePicture: "",
		playerTwoPicture: "",
	},
	board:
	{
		dimension:
		{
			height: 0,
			width: 0
		},
		ball:
		{
			position:
			{
				x: 200,
				y: 200,
			}
		},
		playerOne:
		{
			position:
			{
				x: 1,
				y: 1,
			}
		},
		playerTwo:
		{
			position:
			{
				x: 1,
				y: 1,
			}
		},
		plOneScore: 0,
		plTwoScore: 0,
		plOneSocket: "undefined",
		plTwoSocket: "undefined",
		gameFace: 0,
	},
	meConnected: false,
	myGameActive:
	{
		classical: {
			connected: [],
			disconnected: [],
			invited: [],
			revoked: [],
			undefined: []
		},
		upsideDown: {
			connected: [],
			disconnected: [],
			invited: [],
			revoked: [],
			undefined: []
		},
		friend: {
			connected: [],
			disconnected: [],
			invited: [],
			revoked: [],
			undefined: []
		}
	},
	gameOver: false
};

const	gameEngineSlice = createSlice(
{
	name: "gameEngine",
	initialState: initialGameEngineState,
	reducers:
	{
		setServerDimension(state, action: PayloadAction<Model>)
		{
			state.server.dimension = action.payload.server.dimension;
		},
		setScaleServer(state, action: PayloadAction<Model>)
		{
			state.server.scaleServer = action.payload.server.scaleServer;
		},
		setBoardDimension(state, action: PayloadAction<Model>)
		{
			state.board.dimension = action.payload.board.dimension;
		},
		setReadyPlayerCount(state, action: PayloadAction<Model>)
		{
			state.server.readyPlayerCount
				= action.payload.server.readyPlayerCount;
		},
		setPlayerOnePos(state, action: PayloadAction<Model>)
		{
			state.board.playerOne.position
				= action.payload.board.playerOne.position;
		},
		setPlayerTwoPos(state, action: PayloadAction<Model>)
		{
			state.board.playerTwo.position
				= action.payload.board.playerTwo.position;
		},
		setPlOneSocket(state, action: PayloadAction<Model>)
		{
			state.board.plOneSocket
				= action.payload.board.plOneSocket;
		},
		setPlTwoSocket(state, action: PayloadAction<Model>)
		{
			state.board.plTwoSocket
				= action.payload.board.plTwoSocket;
		},
		setPlOneScore(state, action: PayloadAction<Model>)
		{
			state.board.plOneScore
				= action.payload.board.plOneScore;
		},
		setPlTwoScore(state, action: PayloadAction<Model>)
		{
			state.board.plTwoScore
				= action.payload.board.plTwoScore;
		},
		setFrameNumber(state, action: PayloadAction<Model>)
		{
			state.server.frameNumber
				= action.payload.server.frameNumber;
		},
		setBallPosition(state, action: PayloadAction<Model>)
		{
			state.board.ball.position = action.payload.board.ball.position;
		},
		setNumberOfUsers(state, action: PayloadAction<Model>)
		{
			state.server.numberOfUser = action.payload.server.numberOfUser;
		},
		setPlayerOneProfileId(state, action: PayloadAction<Model>)
		{
			state.server.playerOneProfileId
			= action.payload.server.playerOneProfileId;
		},
		setPlayerTwoProfileId(state, action: PayloadAction<Model>)
		{
			state.server.playerTwoProfileId
			= action.payload.server.playerTwoProfileId;
		},
		setPlayerOnePicture(state, action: PayloadAction<Model>)
		{
			state.server.playerOnePicture
			= action.payload.server.playerOnePicture;
		},
		setPlayerTwoPicture(state, action: PayloadAction<Model>)
		{
			state.server.playerTwoPicture
			= action.payload.server.playerTwoPicture;
		},
		setConnectedStore(state, action: PayloadAction<Model>)
		{
			state.meConnected = action.payload.meConnected;
		},
		getMyActiveGame(state, action: PayloadAction<Model>)
		{
			state.myGameActive.classical
				= action.payload.myGameActive.classical;
			state.myGameActive.friend
				= action.payload.myGameActive.friend;
			state.myGameActive.upsideDown
				= action.payload.myGameActive.upsideDown;
		},
		revokeMyGame(state, action: PayloadAction<Model>)
		{
			state.myGameActive = action.payload.myGameActive;
		},
		setGameOver(state, action: PayloadAction<Model>)
		{
			state.gameOver = action.payload.gameOver;
		},
		setGameFace(state, action: PayloadAction<Model>)
		{
			state.board.gameFace = action.payload.board.gameFace;
		},
		resetGameEngine(state, action: PayloadAction<Model>)
		{
			state = action.payload;
		}
	}
});

export default gameEngineSlice;
