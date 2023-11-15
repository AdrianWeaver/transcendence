/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */

import	gameEngineSlice from "./gameEngine-slice";
import
{
	AnyAction,
	ThunkAction
}	from "@reduxjs/toolkit";

import { RootState } from "./index";

import { GameEngineModel as Model } from "../models/redux-models";
import ServerService from "../service/server-service";

export const	action = gameEngineSlice.actions;

export const	setServerDimension = (width: number, height: number)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const prevState = getState();

		const	res: Model = {
			...prevState.gameEngine,
			server:
			{
				...prevState.gameEngine.server,
				dimension:
				{
					height: height,
					width: width
				}
			}
		};
		dispatch(action.setServerDimension(res));
	});
};

export const	setScaleServer = (width: number, height: number)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prevState = getState();

		const	res: Model = {
			...prevState.gameEngine,
			server:
			{
				...prevState.gameEngine.server,
				scaleServer:
				{
					height: height,
					width: width,
				}
			}
		};
		dispatch(action.setScaleServer(res));
	});
};

export const	setBoardDimension = (width: number, height: number)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prevState = getState();

		const	res: Model = {
			...prevState.gameEngine,
			board:
			{
				...prevState.gameEngine.board,
				dimension:
				{
					height: height,
					width: width,
				}
			}
		};
		dispatch(action.setBoardDimension(res));
	});
};

export const	setSocketId = (width: number, height: number)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prevState = getState();

		const	res: Model = {
			...prevState.gameEngine,
			board:
			{
				...prevState.gameEngine.board,
				dimension:
				{
					height: height,
					width: width,
				}
			}
		};
		dispatch(action.setBoardDimension(res));
	});
};

export const	setReadyPlayerCount = (readyPlayerCounted: number)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prevState = getState();

		const	res: Model = {
			...prevState.gameEngine,
			server:
			{
				...prevState.gameEngine.server,
				readyPlayerCount: readyPlayerCounted
			}
		};
		dispatch(action.setReadyPlayerCount(res));
	});
};

export const	setPlayerOnePos = (x: number, y: number)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prevState = getState();

		const	res: Model = {
			...prevState.gameEngine,
			board:
			{
				...prevState.gameEngine.board,
				playerOne:
				{
					position:
					{
						x: x / prevState.gameEngine.server.scaleServer.width,
						y: y / prevState.gameEngine.server.scaleServer.width
					}
				}
			}
		};
		dispatch(action.setPlayerOnePos(res));
	});
};

export const	setPlayerTwoPos = (x: number, y: number)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prevState = getState();

		const	res: Model = {
			...prevState.gameEngine,
			board:
			{
				...prevState.gameEngine.board,
				playerTwo:
				{
					position:
					{
						x: x / prevState.gameEngine.server.scaleServer.width,
						y: y / prevState.gameEngine.server.scaleServer.width
					}
				}
			}
		};
		dispatch(action.setPlayerTwoPos(res));
	});
};

export const	setPlOneSocket = (plOneSocket: string)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prevState = getState();

		const	res: Model = {
			...prevState.gameEngine,
			board:
			{
				...prevState.gameEngine.board,
				plOneSocket: plOneSocket
			}
		};
		dispatch(action.setPlOneSocket(res));
	});
};

export const	setPlTwoSocket = (plTwoSocket: string)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prevState = getState();

		const	res: Model = {
			...prevState.gameEngine,
			board:
			{
				...prevState.gameEngine.board,
				plTwoSocket: plTwoSocket
			}
		};
		dispatch(action.setPlTwoSocket(res));
	});
};

export const	setPlOneScore = (plOneScore: number)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prevState = getState();

		const	res: Model = {
			...prevState.gameEngine,
			board:
			{
				...prevState.gameEngine.board,
				plOneScore: plOneScore
			}
		};
		dispatch(action.setPlOneScore(res));
	});
};

export const	setPlTwoScore = (plTwoScore: number)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prevState = getState();

		const	res: Model = {
			...prevState.gameEngine,
			board:
			{
				...prevState.gameEngine.board,
				plTwoScore: plTwoScore
			}
		};
		dispatch(action.setPlTwoScore(res));
	});
};

export const	setFrameNumber = (frameNumber: number)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prevState = getState();

		const	res: Model = {
			...prevState.gameEngine,
			server:
			{
				...prevState.gameEngine.server,
				frameNumber: frameNumber
			}
		};
		dispatch(action.setFrameNumber(res));
	});
};

export const	setBallPosition = (x: number, y: number)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prevState = getState();

		const	res: Model = {
			...prevState.gameEngine,
			board:
			{
				...prevState.gameEngine.board,
				ball:
				{
					position:
					{
						x: x / prevState.gameEngine.server.scaleServer.width,
						y: y / prevState.gameEngine.server.scaleServer.height
					}
				}
			}
		};
		dispatch(action.setBallPosition(res));
	});
};

export const	setNumberOfUsers = (usertCount: number)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prevState = getState();

		const	res: Model = {
			...prevState.gameEngine,
			server:
			{
				...prevState.gameEngine.server,
				numberOfUser: usertCount
			}
		};
		dispatch(action.setNumberOfUsers(res));
	});
};

export const	setPlayerOneProfileId = (playerOneId: number)
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const prev = getState();

		const response: Model = {
			...prev.gameEngine,
			server:
			{
				...prev.gameEngine.server,
				playerOneProfileId: playerOneId
			}
		};
		dispatch(action.setPlayerOneProfileId(response));
	});
};

export const	setPlayerTwoProfileId = (playerTwoId: number)
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const prev = getState();

		const response: Model = {
			...prev.gameEngine,
			server:
			{
				...prev.gameEngine.server,
				playerTwoProfileId: playerTwoId
			}
		};
		dispatch(action.setPlayerTwoProfileId(response));
	});
};

export const	setPlayerOnePicture = (playerOnePicture: string)
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const prev = getState();

		const response: Model = {
			...prev.gameEngine,
			server:
			{
				...prev.gameEngine.server,
				playerOnePicture: playerOnePicture
			}
		};
		dispatch(action.setPlayerOnePicture(response));
	});
};

export const	setPlayerTwoPicture = (playerTwoPicture: string)
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const prev = getState();

		const response: Model = {
			...prev.gameEngine,
			server:
			{
				...prev.gameEngine.server,
				playerTwoPicture: playerTwoPicture
			}
		};
		dispatch(action.setPlayerTwoPicture(response));
	});
};

export const	setConnectedStore = (value: boolean)
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prev = getState();

		const response: Model = {
			...prev.gameEngine,
			meConnected: value
		};
		dispatch(action.setConnectedStore(response));
	});
};

export const	getMyActiveGame = ()
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return (async (dispatch, getState) =>
	{
		const	prev = getState();
		const	token = prev.controller.user.bearerToken;

		const data = await ServerService
			.getMyActiveGame(token, prev.server.serverLocation);
		console.log(data);
		if (data.success === true)
		{
			console.log("getMyGameActive success called", data);
			const	response: Model = {
				...prev.gameEngine,
				myGameActive:
				{
					random: data.random,
					friend: data.friend
				}
			};
			dispatch(action.getMyActiveGame(response));
		}
		else
		{
			console.log("getMyGameActive Failure");
			dispatch(action.getMyActiveGame({...prev.gameEngine}));
		}
	});
};

export const	revokeGameWithUuid = (gameUuid: string)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return (async (dispatch, getState) =>
	{
		const	prev = getState();
		const	token = prev.controller.user.bearerToken;
		const	serverLoc = prev.server.serverLocation;
		const	data = await ServerService
			.revokeGameWithUuid(token, serverLoc, gameUuid);
		console.log("data");
		if (data.success === true)
		{
			console.log("revoke game success");
			// const newData = await ServerService
			// 	.getMyActiveGame(token, prev.server.serverLocation);
			// console.log(newData);
			// if (newData.success === true)
			// {
			// 	console.log("getMyGameActive success called", data);
			// 	const	response: Model = {
			// 		...prev.gameEngine,
			// 		myGameActive:
			// 		{
			// 			random: newData.random,
			// 			friend: data.friend
			// 		}
			// 	};
			// 	dispatch(action.revokeMyGame(response));
			// }
			// else
			// {
			// 	console.log("getMyGameActive Failure");
				dispatch(action.revokeMyGame({...prev.gameEngine}));
			// }
		}
		else
		{
			console.log("revoke game abort");
			dispatch(action.revokeMyGame({...prev.gameEngine}));
		}
	});
};

export const	setGameOver = (gameOver: boolean)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return (async (dispatch, getState) =>
	{
		const	prev = getState();

		const	response = {
			...prev.gameEngine,
			gameOver: gameOver
		};
		dispatch(action.setGameOver(response));
	});
};
