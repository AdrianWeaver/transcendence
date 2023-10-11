/* eslint-disable curly */
/* eslint-disable max-statements */
/* eslint-disable semi */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
// eslint-disable-next-line max-len
// https://itnext.io/build-a-react-redux-with-typescript-using-redux-toolkit-package-d17337aa6e39
import controllerSlice from "./controller-slice";
import { AnyAction, ThunkAction } from "@reduxjs/toolkit";

import { RootState } from "./index";
import { CanvasModel, ChatUserModel, ControllerModel, MessageModelInterface, MessageRoomModel } from "../models/redux-models";

import UserServices from "../service/ft-api-service";
type MessageModel =
{
	sender: string,
	message: string,
	mode: string
}

export const	controllerActions = controllerSlice.actions;

export const	setActiveView = (activeView: string)
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	previousState = getState();
		const	reponse: ControllerModel = {
			...previousState.controller,
			activeView: activeView,
		};
		dispatch(controllerActions.setActiveView(reponse));
	});
};

export const	setThemeModeToLight = ()
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	previousState = getState();
		const	response: ControllerModel = {
			...previousState.controller,
			themeMode: "light"
		};
		dispatch(controllerActions.setThemeModeToLight(response));
	});
};

export const	setThemeModeToDark = ()
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	previousState = getState();
		const	response: ControllerModel = {
			...previousState.controller,
			themeMode: "dark"
		};
		dispatch(controllerActions.setThemeModeToDark(response));
	});
};

export const	setUserLoggedIn = ()
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	previousState = getState();
		const	response: ControllerModel = {
			...previousState.controller,
			user:
			{
				...previousState.controller.user,
				isLoggedIn: true,
			}
		};
		dispatch(controllerActions.setUserLoggedIn(response));
	});
};

export const	logOffUser = ()
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	previousState = getState();
		const	response: ControllerModel = {
			...previousState.controller,
			user:
			{
				...previousState.controller.user,
				isLoggedIn: false,
			}
		};
		dispatch(controllerActions.logOffUser(response));
	});
};

export const	userRequestRegistration = ()
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	previousState = getState();
		const	response: ControllerModel = {
			...previousState.controller,
			registration:
			{
				...previousState.controller.registration,
				startedRegister: true
			}
		};
		dispatch(controllerActions.userRequestRegistration(response));
	});
};

export const	userRegistrationStepTwo = ()
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	previousState = getState();
		const	response: ControllerModel = {
			...previousState.controller,
			registration:
			{
				...previousState.controller.registration,
				step: 1,
			}
		};
		dispatch(controllerActions.userRegistrationStepTwo(response));
	});
};


export const	userRegistrationStepThree = ()
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	previousState = getState();
		const	response: ControllerModel = {
			...previousState.controller,
			registration:
			{
				...previousState.controller.registration,
				step: 2,
			}
		};
		dispatch(controllerActions.userRegistrationStepThree(response));
	});
};

export const	setCanvasSize = (size: CanvasModel)
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prevState = getState();
		const	response: ControllerModel = {
			...prevState.controller,
			canvas: size
		};
		dispatch(controllerActions.setCanvasSize(response));
	});
};

export const	setAbortRequestedValue = (value: boolean)
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prevState = getState();
		const	reponse: ControllerModel = {
			...prevState.controller,
			registration:
			{
				...prevState.controller.registration,
				abortRequested: value
			}
		};
		dispatch(controllerActions.setAbortRequestedValue(reponse));
	});
};

export const	resetRegistration = ()
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prevState = getState();

		if (prevState.controller.registration.startedRegister === true)
			dispatch(controllerActions.resetRegistration());
	});
};

export const	setPreviousPage = (pageToSave : string)
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prevState = getState();
		let		response: ControllerModel;

		if (prevState.controller.previousPage === pageToSave)
			return ;
		else
			response = {
				...prevState.controller,
				previousPage: pageToSave,
			};
		dispatch(controllerActions.setPreviousPage(response));
	});
};

export const	setRequestHomeLink = (value: boolean)
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prevState = getState();
		const	response: ControllerModel = {
			...prevState.controller,
			registration:
			{
				...prevState.controller.registration,
				requestHomeLink: value
			}
		};
		dispatch(controllerActions.setRequestHomeLink(response));
	});
};

export const setBigWindow = ()
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prevState = getState();
		const	response: ControllerModel = {
			...prevState.controller,
			user:
			{
				...prevState.controller.user,
				chat:
				{
					...prevState.controller.user.chat,
					window:
					{
						bigWindow: true,
						hiddenWindow: false,
						miniWindow: false
					}
				}
			}
		};
		dispatch(controllerActions.setBigWindow(response));
	});
};

export const setMiniWindow = ()
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prevState = getState();
		const	response: ControllerModel = {
			...prevState.controller,
			user:
			{
				...prevState.controller.user,
				chat:
				{
					...prevState.controller.user.chat,
					window:
					{
						bigWindow: false,
						hiddenWindow: false,
						miniWindow: true
					}
				}
			}
		};
		dispatch(controllerActions.setMiniWindow(response));
	});
};

export const setHiddenWindow = ()
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prevState = getState();
		const	response: ControllerModel = {
			...prevState.controller,
			user:
			{
				...prevState.controller.user,
				chat:
				{
					...prevState.controller.user.chat,
					window:
					{
						bigWindow: false,
						hiddenWindow: true,
						miniWindow: false
					}
				}
			}
		};
		dispatch(controllerActions.setHiddenWindow(response));
	});
};

export const setPseudo = (name: string)
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const prevState = getState();
		const response: ControllerModel = {
			...prevState.controller,
			user:
			{
				...prevState.controller.user,
				username: name,
				chat:
				{
					...prevState.controller.user.chat,
					pseudo: name
				}
			}
		};
		dispatch(controllerActions.setPseudo(response));
	});
};

export const setChatConnected = (connected: boolean)
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const prevState = getState();
		const response: ControllerModel = {
			...prevState.controller,
			user:
			{
				...prevState.controller.user,
				chat:
				{
					...prevState.controller.user.chat,
					connected: connected
				}
			}
		};
		dispatch(controllerActions.setChatConnected(response));
	});
};

	export const setChatUsers = (users: ChatUserModel[])
	: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const prevState = getState();
		const response: ControllerModel = {
			...prevState.controller,
			user:
			{
				...prevState.controller.user,
				chat:
				{
					...prevState.controller.user.chat,
					users: users
				}
			}
		};
		dispatch(controllerActions.setChatUsers(response));
	});
};

export const setActiveConversationId = (activeConversationId: string)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const prevState = getState();
		const response: ControllerModel = {
			...prevState.controller,
			user:
			{
				...prevState.controller.user,
				chat:
				{
					...prevState.controller.user.chat,
					activeConversationId: activeConversationId
				}
			}
		};
		dispatch(controllerActions.setActiveConversationId(response));
	});
};

export const setCurrentChannel = (currentChannel: string)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const prevState = getState();
		const response: ControllerModel = {
			...prevState.controller,
			user:
			{
				...prevState.controller.user,
				chat:
				{
					...prevState.controller.user.chat,
					currentChannel: currentChannel
				}
			}
		};
		dispatch(controllerActions.setCurrentChannel(response));
	});
};

export const setKindOfConversation = (kindOfConversation: string)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const prevState = getState();
		const response: ControllerModel = {
			...prevState.controller,
			user:
			{
				...prevState.controller.user,
				chat:
				{
					...prevState.controller.user.chat,
					kindOfConversation: kindOfConversation
				}
			}
		};
		dispatch(controllerActions.setKindOfConversation(response));
	});
};

export const setNumberOfChannels = (numberOfChannels: number)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const prevState = getState();
		const response: ControllerModel = {
			...prevState.controller,
			user:
			{
				...prevState.controller.user,
				chat:
				{
					...prevState.controller.user.chat,
					numberOfChannels: numberOfChannels
				}
			}
		};
		dispatch(controllerActions.setNumberOfChannels(response));
	});
};

export const setMessageRoom = (room: MessageRoomModel[], clientId: string)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const prevState = getState();
		console.log(prevState);
		const	userIndex = prevState.controller.user.chat.users.findIndex((elem) =>
		{
			return (elem.id === clientId);
		});
		if (userIndex !== -1)
			prevState.controller.user.chat.users[userIndex].msgRoom = room;
		else
			console.log("Id not found");
		const response: ControllerModel = {
			...prevState.controller,
			user:
			{
				...prevState.controller.user,
				chat:
				{
					...prevState.controller.user.chat,
					users: prevState.controller.user.chat.users,
				}
			}
		};
		dispatch(controllerActions.setMessageRoom(response));
	});
};

export const setMessage = (message: MessageModelInterface[], clientId: string, msgIndex: number)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const prevState = getState();
		console.log(prevState);
		const	userIndex = prevState.controller.user.chat.users.findIndex((elem) =>
		{
			return (elem.id === clientId);
		});
		if (userIndex === -1)
			console.log("Id not found");
		else
		{
			const response: ControllerModel = {
				...prevState.controller,
				user:
				{
					...prevState.controller.user,
					chat:
					{
						...prevState.controller.user.chat,
						users: [
						{
							...prevState.controller.user.chat.users[userIndex],
							msgRoom: [
								{
									...prevState.controller.user.chat.users[userIndex].msgRoom[msgIndex],
									content: message,
								}
							]
						}
						]
					}
				}
			};
			dispatch(controllerActions.setMessage(response));
		}
	});
};

export const addMessage = (clientId: string, msgIndex: number, text: string, index: number)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const prevState = getState();
		console.log(prevState);
		const	userIndex = prevState.controller.user.chat.users.findIndex((elem) =>
		{
			return (elem.id === clientId);
		});
		if (userIndex === -1)
			console.log("Id not found");
		else
		{
			const response: ControllerModel = {
				...prevState.controller,
				user:
				{
					...prevState.controller.user,
					chat:
					{
						...prevState.controller.user.chat,
						users: [
						{
							...prevState.controller.user.chat.users[userIndex],
							msgRoom: [
								{
									...prevState.controller.user.chat.users[userIndex].msgRoom[msgIndex],
									content: [
									{
										...prevState.controller.user.chat.users[userIndex].msgRoom[msgIndex].content[index],
										message: text
									}
									]
								}
							]
						}
						]
					}
				}
			};
			dispatch(controllerActions.addMessage(response));
		}
	});
};

export const setRegistrationProcessStart = ()
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const prev = getState();

		const response: ControllerModel = {
			...prev.controller,
			user:
			{
				...prev.controller.user,
				registrationProcess: true,
				registrationError: "undefined"
			}
		};
		dispatch(controllerActions.setRegistrationProcessStart(response));
	})
}

export const setRegistrationProcessSuccess = ()
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const prev = getState();

		const response: ControllerModel = {
			...prev.controller,
			user:
			{
				...prev.controller.user,
				registrationProcess: false
			}
		};
		dispatch(controllerActions.setRegistrationProcessSuccess(response));
	})
}

export const setRegistrationProcessError = ()
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const prev = getState();

		const response: ControllerModel = {
			...prev.controller,
			user:
			{
				...prev.controller.user,
				registrationProcess: false,
				registrationError: "error",
			}
		};
		dispatch(controllerActions.setRegistrationProcessError(response));
	})
}

export const	setUserData = (data: any)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prev = getState();

		const	response: ControllerModel = {
			...prev.controller,
			user:
			{
				...prev.controller.user,
				id: data.id,
				email: data.email,
				bearerToken: data.token,
				firstName: data.firstName,
				lastName: data.lastName
			}
		}
		dispatch(controllerActions.setUserData(response));
	});
}

export const verifyToken = ()
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return (async (dispatch, getState) =>
	{
		const prev = getState();

		// console.log("Value of prevState");
		// console.log(prev);
		if (prev.controller.user.registrationError !== "undefined"
			|| prev.controller.user.bearerToken === "undefined")
			return ;
		console.log("Before await");
		const	data = await UserServices.verifyToken(prev.controller.user.bearerToken, prev.server.serverLocation);
		if (data === "ERROR")
		{
			dispatch(setRegistrationProcessError());
			dispatch(resetRegistration);
			return ;
		}

		// console.log("Data inside verify token ");
		// console.log(data);
		dispatch(setRegistrationProcessSuccess());
		dispatch(userRegistrationStepTwo());
	})
}

export const registerClientWithCode = (code : string)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return (async (dispatch, getState) =>
	{
		const 	prev = getState();
		let		response: ControllerModel;

		response = prev.controller;
		if (prev.controller.user.isLoggedIn
			|| prev.controller.user.registrationProcess
			|| prev.controller.user.registrationError !== "undefined")
		{
			// dispatch(controllerActions.registerClientWithCode(prev.controller));
			return ;
		}
		dispatch(setRegistrationProcessStart())
		// console.log("Code is equals to : ", code);
		const	data: any = await UserServices.register(code, "localhost");
		if (data === "ERROR")
		{
			dispatch(setRegistrationProcessError());
			return ;
		}
		else
		{
			response = {
				...prev.controller,
				user:
				{
					...prev.controller.user,
					id: data.id,
					email: data.email,
					// our token
					bearerToken: data.token,
					username: data.login,
					firstName: data.firstName,
					lastName: data.lastName,
					avatar: data.avatar
				}
			}
			console.log("controller action 745  ", data);
		}
		dispatch(controllerActions.registerClientWithCode(response));
		// dispatch(controllerActions.verifyToken());
		console.log("end of registration");
	});
};


export const	setDoubleAuth = (data: any)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prev = getState();

		const	response: ControllerModel = {
			...prev.controller,
			user:
			{
				...prev.controller.user,
				doubleAuth: data.doubleAuth,
			}
		}
		dispatch(controllerActions.setDoubleAuth(response));
	});
}

export const	setPhoneNumber = (data: any)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prev = getState();

		const	response: ControllerModel = {
			...prev.controller,
			user:
			{
				...prev.controller.user,
				phoneNumber: data.phoneNumber,
			}
		}
		dispatch(controllerActions.setPhoneNumber(response));
	});
}

export const	setRegistered = (data: any)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prev = getState();

		const	response: ControllerModel = {
			...prev.controller,
			user:
			{
				...prev.controller.user,
				registered: data.registered,
			}
		}
		dispatch(controllerActions.setRegistered(response));
	});
}

export const	reinitialiseUser = (data: any)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prev = getState();

		const	response: ControllerModel = {
			...prev.controller,
			registration:
			{
				startedRegister: false,
				step: 0,
				codeOauthFT: "undefined",
				abortRequested: false,
				requestHomeLink: false
			},
			user:
			{
				...prev.controller.user,
				isLoggedIn: false,
				id: -1,
				rememberMe: false,
				email: "undefined",
				bearerToken: "undefined",
				firstName: "undefined",
				lastName: "undefined",
				username: "undefined",
				registrationProcess: false,
				registrationError: "undefined",
				doubleAuth: false,
				phoneNumber: "undefined",
				registered: false,
				// ou thispersondoesntexist?
				avatar: "undefined"


			}
		}
		dispatch(controllerActions.reinitialiseUser(response));
	});
}

export const	setAvatar = (data: any)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prev = getState();

		const	response: ControllerModel = {
			...prev.controller,
			user:
			{
				...prev.controller.user,
				avatar: data.avatar,
			}
		}
		dispatch(controllerActions.setAvatar(response));
	});
}
