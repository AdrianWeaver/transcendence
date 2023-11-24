/* eslint-disable no-await-in-loop */
/* eslint-disable init-declarations */
/* eslint-disable prefer-const */
/* eslint-disable curly */
/* eslint-disable max-statements */
/* eslint-disable semi */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
// eslint-disable-next-line max-len
import controllerSlice, { initialControllerState } from "./controller-slice";
import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { RootState } from "./index";
import { BackUserModel, CanvasModel, ChatUserModel, ControllerModel, FriendsDataModel, UserModel } from "../models/redux-models";
import UserServices from "../service/ft-api-service";
import ServerService from "../service/server-service";
import ConnectionState from "../../Component/ConnectionState";

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
				startedRegister: true,
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

export const	userRegistrationStepFour = ()
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
				step: 3,
			}
		};
		dispatch(controllerActions.userRegistrationStepFour(response));
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

export const	reinitialiseUser = (logout: boolean)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return (async (dispatch, getState) =>
	{
		const	prev = getState();

		if (prev.controller.user.bearerToken === "undefined")
			return ;
		if (logout)
		{
			await UserServices.revokeToken(prev.controller.user.bearerToken, prev.server.uri);
			dispatch(logOffUser());
			// dispatch(resetRegistration());
		}
		dispatch(controllerActions.reinitialiseUser());
	});
}

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
		const prev = getState();
		const index = prev.controller.allUsers.findIndex((elem) =>
		{
			return (elem.id === prev.controller.user.id);
		});
		const updatedChatUsers = prev.controller.user.chat.users.map((user, i) =>
		{
			if (i === index)
			{
				return ({
					...user,
					username: name
				});
			}
			else
				return (user);
		});
		const response: ControllerModel = {
			...prev.controller,
			user:
			{
				...prev.controller.user,
				username: name,
				chat:
				{
					...prev.controller.user.chat,
					// ca ca n'a pas de sens xD TEST
					pseudo: name,
					users: updatedChatUsers
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
				registrationProcess: false,
				registered: true,
			}
		};
		dispatch(controllerActions.setRegistrationProcessSuccess(response));
	})
}

export const setRegistrationProcessError = (message?: string)
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

		const	array: BackUserModel[] = prev.controller.allUsers.map((elem) =>
		{
			return (Object.assign(elem));
		});
		array.forEach((elem) =>
		{
			if (elem.id === data.id)
			{
				elem.id = data.id;
				elem.firstName = data.firstName;
				elem.lastName = data.lastName;
				elem.username = data.username;
				elem.location = data.location;
				elem.avatar = data.avatar;
			}
		});
		const	response: ControllerModel = {
			...prev.controller,
			allUsers: [...array],
			user:
			{
				...prev.controller.user,
				id: data.id,
				bearerToken: data.token,
				firstName: data.firstName,
				lastName: data.lastName,
				username: data.username,
			}
		}
		dispatch(controllerActions.setUserData(response));
	});
}

export const	verifyTokenAtRefresh = ()
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return (async (dispatch, getState) =>
	{
		const prevState = getState();

		const user = prevState.controller.user;
		const	data = await UserServices
			.verifyToken(
				user.bearerToken,
				prevState.server.uri
			);
		if (data === "ERROR")
		{
			dispatch(controllerActions.reinitialiseUser());
		}
	});
}

export const verifyToken = ()
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return (async (dispatch, getState) =>
	{
		const prev = getState();

		if (prev.controller.user.registrationError !== "undefined"
			|| prev.controller.user.bearerToken === "undefined")
			return ;
		const	data = await UserServices.verifyToken(prev.controller.user.bearerToken, prev.server.uri);
		if (data === "ERROR")
		{
			dispatch(setRegistrationProcessError());
			dispatch(resetRegistration);
			dispatch(reinitialiseUser(false));
			return ;
		}

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
			return ;
		}
		dispatch(setRegistrationProcessStart())
		const	data: any = await UserServices.register(
			code, prev.server.uri);
		if (data === "already registered")
		{
			const	alreadyResponse: ControllerModel = {
				...prev.controller,
				registration:
				{
					...prev.controller.registration,
					abortRequested: true,
				}
			}
			dispatch(controllerActions.setAbortRequestedValue(alreadyResponse));
			// return ;
		}
		else if (data.msg === "ERROR" || data === "ERROR")
		{
			return ;
		}
		else
		{
			response = {
				...prev.controller,
				registration: {
					...prev.controller.registration,
					step: 1
				},
				user:
				{
					...prev.controller.user,
					id: data.id,
					email: data.email,
					// our token
					bearerToken: data.token,
					username: data.username,
					firstName: data.firstName,
					lastName: data.lastName,
					avatar: data.avatar,
					profile:
					{
						editView: false,
						friendView: false,
						publicView: false,
						myView: true
					}
				}
			}
			dispatch(controllerActions.registerClientWithCode(response));
			// dispatch(controllerActions.verifyToken());
		}
	});
};

export const registerNumberForDoubleAuth = (numero : string, token: string)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return (async (dispatch, getState) =>
	{
		const 	prev = getState();
		let		response: ControllerModel;

		response = prev.controller;
		if (prev.controller.user.isLoggedIn
			|| prev.controller.user.registrationError !== "undefined")
			return ;
		const	data: any = await
			UserServices.getNumberForDoubleAuth(
				numero, token, prev.server.uri);
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
					phoneNumber: numero
				}
			}
		}
		dispatch(controllerActions.registerNumberForDoubleAuth(response));
	});
};

export const receiveValidationCode = (numero : string, token: string)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return (async (dispatch, getState) =>
	{
		const 	prev = getState();
		let		response: ControllerModel;

		response = prev.controller;
		if (prev.controller.user.isLoggedIn
			|| prev.controller.user.registrationError !== "undefined")
			return ;
		const	data: any = await
			UserServices.receiveValidationCodeFromTwilio(
				numero, token, prev.server.uri);
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
					phoneNumber: numero
				}
			}
		}
		dispatch(controllerActions.receiveValidationCode(response));
	});
};

export const GetValidationCode = (otpCode : string, token: string)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return (async (dispatch, getState) =>
	{
		const 	prev = getState();
		let		response: ControllerModel;
		response = prev.controller;
		if (prev.controller.user.isLoggedIn
			|| prev.controller.user.registrationError !== "undefined")
			return ;
		const	data: any = await UserServices.getValidationCodeFromTwilio(
			prev.controller.user.phoneNumber, otpCode, token, prev.server.uri);
		if (data === "error")
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
					otpCode: otpCode,
					codeValidated: data.data
				}
			}
		}
		dispatch(controllerActions.getValidationCode(response));
	});
};

// when logging in
export const receiveCode = (token: string)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return (async (dispatch, getState) =>
	{
		const 	prev = getState();
		let		response: ControllerModel;

		response = prev.controller;
		if (prev.controller.user.isLoggedIn
			|| prev.controller.user.registrationError !== "undefined")
			return ;
		const	data: any = await
			UserServices.receiveCode(
				prev.controller.user.id.toString(), token, prev.server.uri);
		if (data === "ERROR")
		{
			dispatch(setRegistrationProcessError());
			return ;
		}
	});
};

// when loggin in
export const GetCode = (otpCode : string, token: string)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return (async (dispatch, getState) =>
	{
		const 	prev = getState();
		let		response: ControllerModel;
		response = prev.controller;
		if (response.user.doubleAuth === true)
		{
			if (prev.controller.user.isLoggedIn
				|| prev.controller.user.registrationError !== "undefined")
				return ;
			const	data: any = await UserServices.getValidationCode(
				prev.controller.user.id.toString(), otpCode, token, prev.server.uri);
			if (data === "error")
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
						otpCode: otpCode,
						codeValidated: data.data
					}
				}
			}
		}
		dispatch(controllerActions.getValidationCode(response));
	});
};

export const	setCodeValidated = (data: boolean)
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
				codeValidated: data,
			}
		}
		dispatch(controllerActions.setCodeValidated(response));
	});
}

export const	setDoubleAuth = (data: boolean)
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
				doubleAuth: data,
			}
		}
		dispatch(controllerActions.setDoubleAuth(response));
	});
}

export const	setPhoneNumber = (data: string)
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
				phoneNumber: data,
			}
		}
		dispatch(controllerActions.setPhoneNumber(response));
	});
}

export const	setAlreadyExists = (exists: boolean)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return (async (dispatch, getState) =>
	{
		const	prev = getState();
		const	response: ControllerModel = {
			...prev.controller,
			user:
			{
				...prev.controller.user,
				alreadyExists: exists
			}
		}
		dispatch(controllerActions.setAlreadyExists(response));
	});
}

export const	setRegistered = ()
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prev = getState();
		const	data: any = UserServices.registrationValidation(prev.controller.user.bearerToken, prev.server.uri);
		if (data === "error")
		{
			setAlreadyExists(true);
			return ;
		}
		const	response: ControllerModel = {
			...prev.controller,
			user:
			{
				...prev.controller.user,
				registered: true,
				alreadyExists: true
			}
		}
		dispatch(controllerActions.setRegistered(response));
	});
}

export const	setAvatar = (data: string)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prev = getState();
		const	array: BackUserModel[] = prev.controller.allUsers.map((elem) =>
		{
			return (Object.assign(elem));
		});
		array.forEach((elem) =>
		{
			if (elem.id === prev.controller.user.id)
				elem.avatar = data;
		});
		const	response: ControllerModel = {
			...prev.controller,
			allUsers: [...array],
			user:
			{
				...prev.controller.user,
				avatar: data,
			}
		}
		dispatch(controllerActions.setAvatar(response));
	});
}

export const	setProfileEditView = ()
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
				profile:
				{
					editView: true,
					friendView: false,
					publicView: false,
					myView: false
				},
			}
		}
		dispatch(controllerActions.setProfileEditView(response));
	});
}

export const	setProfileFriendView = ()
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
				profile:
				{
					editView: false,
					friendView: true,
					publicView: false,
					myView: false
				},
			}
		}
		dispatch(controllerActions.setProfileFriendView(response));
	});
}

export const	setProfilePublicView = ()
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
				profile:
				{
					editView: false,
					friendView: false,
					publicView: true,
					myView: false
				},
			}
		}
		dispatch(controllerActions.setProfilePublicView(response));
	});
}

export const	setProfileMyView = ()
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
				profile:
				{
					editView: false,
					friendView: false,
					publicView: false,
					myView: true
				},
			}
		}
		dispatch(controllerActions.setProfileMyView(response));
	});
}

export const	setPassword = (password: string)
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
				password: password
			}
		}
		dispatch(controllerActions.setPassword(response));
	});
}

export const	setEmail = (email: string)
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
				email: email
			},
		}
		dispatch(controllerActions.setEmail(response));
	});
}

export const	setLogin = (login: string)
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
				login: login
			}
		}
		dispatch(controllerActions.setLogin(response));
	});
}

export const	setAllUsers = ()
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return (async (dispatch, getState) =>
	{
		const	prev = getState();

		const	theUsers: any = await UserServices.getAllTheUsers(prev.server.uri);
		if (theUsers === "error")
		{
			console.error("Error to get users");
			return ;
		}
		const array: BackUserModel[] = theUsers;

		const	response: ControllerModel = {
			...prev.controller,
			allUsers: [...array]
		}
		dispatch(controllerActions.setAllUsers(response));
	});
}

export const	setProfileId = (name: string, profileId: string)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return (async (dispatch, getState) =>
	{
		const	prev = getState();

		const	array = prev.controller.user.chat.users.map((elem) =>
		{
			return (Object.assign(elem));
		});
		array.map((elem) =>
		{
			if (elem.name === name)
			{
				elem.profileId = profileId;
				return ;
			}
		});

		const	response: ControllerModel = {
			...prev.controller,
			user:
			{
				...prev.controller.user,
				chat:
				{
					...prev.controller.user.chat,
					users: [...array]
				}
			}
		}
		dispatch(controllerActions.setProfileId(response));
	});
}
export const	registerInfosInBack = (info: string, doubleAuth: boolean, field: string)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return (async (dispatch, getState) =>
	{
		const	prev = getState();
		await UserServices.registerInfosInBack(prev.controller.user.bearerToken, info, field, doubleAuth, prev.server.uri)
		.then(() =>
		{
		})
		.catch((error) =>
		{
			console.error(error);
		});
		if (field === "username")
			dispatch(setPseudo(info as string));
		else if (field === "email")
			dispatch(setEmail(info as string));
		else if (field === "phoneNumber" && info !== undefined)
			dispatch(setPhoneNumber(info as string));
		if (doubleAuth !== undefined)
			dispatch(setDoubleAuth(doubleAuth));
		dispatch(setAllUsers());
	});
}

export const	hashPassword = (password: string)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return (async (dispatch, getState) =>
	{
		const	prev = getState();
		await UserServices.hashPassword(prev.controller.user.bearerToken,
			password, prev.server.serverLocation, prev.controller.user.id)
		.then((_data) =>
		{
		})
		.catch((error) =>
		{
			console.error(error);
		});
	});
}

export const	setNewToken = (newToken: string)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch, getState) =>
	{
		const	prev = getState();
		const	response: ControllerModel =	{
			...prev.controller,
			user:
			{
				...prev.controller.user,
				bearerToken: newToken
			}
		}
		dispatch(controllerActions.setNewToken(response));
	});
}

// export const	decodePassword = (username: string, password: string)
// : ThunkAction<void, RootState, unknown, AnyAction> =>
// {
// 	return (async (dispatch, getState) =>
// 	{
// 		const	prev = getState();
// 		try
// 		{
// 			const	data = await UserServices.decodePassword(
// 				prev.controller.user.bearerToken,
// 				password, username,
// 				prev.server.uri
// 			);
// 			const	newUser = {...prev.controller.allFrontUsers[data.index]};

// 			newUser.bearerToken = data.token;
// 			// newUser.isLoggedIn = true;

// 			const	response: ControllerModel =	{
// 				...prev.controller,
// 				user: newUser
// 			}
// 			dispatch(controllerActions.setUserData(response));
// 			// dispatch(controllerActions.setNewToken(response));
// 		}
// 		catch (error)
// 		{
// 			dispatch(controllerActions.setUserData({...prev.controller}))
// 			return ;
// 		}
// 	});
// }

export const	addUserAsFriend = (friendId: string)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return (async (dispatch, getState) =>
	{
		const	prev = getState();
		const	data = await UserServices.addUserAsFriend(prev.controller.user.bearerToken,
			friendId, prev.server.uri)
		if (data === "ERROR")
			return ;
		console.log("DATA ", data);
		if (data === "success")
		{
			const	newFriend = {
				profileIdOwner: prev.controller.user.id.toString(),
				profileIdFriend: friendId.toString()
			}
			const	newFriends = prev.controller.user.chat.friends.map((elem) =>
			{
				return (elem);
			});
			newFriends.push(newFriend);
			const	response: ControllerModel = {
				...prev.controller,
				user:
				{
					...prev.controller.user,
					chat:
					{
						...prev.controller.user.chat,
						friends: newFriends
					}
				}
			}
			dispatch(controllerActions.setChatUsers(response));
		}
	});
}

// export const	addFrontUser = (user: UserModel)
// : ThunkAction<void, RootState, unknown, AnyAction> =>
// {
// 	return (async (dispatch, getState) =>
// 	{
// 		const	prev = getState();

// 		const	array = prev.controller.allFrontUsers.map((elem) =>
// 		{
// 			return (Object.assign(elem));
// 		});
// 		const	index = array.findIndex((elem) =>
// 		{
// 			return (elem.id === user.id);
// 		});
// 		if (index === -1)
// 			array.push(user);
// 		else
// 			array[index] = user;
// 		const	response: ControllerModel = {
// 			...prev.controller,
// 			allFrontUsers: array
// 		}
// 		dispatch(controllerActions.addFrontUser(response));
// 	});
// }

export const	setOnline = (online: boolean, user: UserModel)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return (async (dispatch, getState) =>
	{
		const	prev = getState();

		const	array = prev.controller.user.chat.users.map((elem) =>
		{
			return (Object.assign(elem));
		});
		const	index = array.findIndex((elem) =>
		{
			return (elem.name === user.username);
		});
		if (index === -1)
			return ;
		// else
		// 	array[index].online = online;
		let nextIndex = index + 1;
		const newUsers = [
			// Items before the insertion point:
			...array.slice(0, index),
			// New item:
			{ id: nextIndex++, online: online },
			// Items after the insertion point:
			...array.slice(index)
		];
		console.log("NEW USERS", newUsers);
		const	response: ControllerModel = {
			...prev.controller,
			user:
			{
				...prev.controller.user,
				chat:
				{
					...prev.controller.user.chat,
					users: newUsers
				}
			}
		}
		dispatch(controllerActions.setOnline(response));
	});
}

export const	setStatus = (status: string, user: UserModel)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return (async (dispatch, getState) =>
	{
		const	prev = getState();
		const	array = prev.controller.user.chat.users.map((elem) =>
		{
			return (Object.assign(elem));
		});;
		const	index = array.findIndex((elem) =>
		{
			return (elem.name === user.username);
		});
		if (index === -1)
			return ;
		else
		{
			array[index].status = status;
		}
		const	response: ControllerModel = {
			...prev.controller,
			user:
			{
				...prev.controller.user,
				chat:
				{
					...prev.controller.user.chat,
					users: array
				}
			}
		}
		dispatch(controllerActions.setStatus(response));
	});
}

export const	addChatUser = (user: ChatUserModel)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return (async (dispatch, getState) =>
	{
		const	prev = getState();
		const	searchChatUser = prev.controller.user.chat.users.find((elem) =>
		{
			return (elem.name === user.name);
		});
		// useless protection but just in case
		if (searchChatUser === undefined)
			return ;
		const	newUser: ChatUserModel[] = [...prev.controller.user.chat.users];
		newUser.push(user);
		const	response: ControllerModel = {
			...prev.controller,
			user:
			{
				...prev.controller.user,
				chat:
				{
					...prev.controller.user.chat,
					users: newUser
				}
			}
		}
		dispatch(controllerActions.updateChatUsers(response));
	});
}

export const	connectChatUser = (user: ChatUserModel, online: boolean)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return (async (dispatch, getState) =>
	{
		const	prev = getState();

		const	connected = prev.controller.user.chat.connectedUsers.map((elem) =>
		{
			return (Object.assign(elem));
		});
		const	disconnected = prev.controller.user.chat.disconnectedUsers.map((elem) =>
		{
			return (Object.assign(elem));
		});
		const	indexConnect = connected.findIndex((elem) =>
		{
			return (elem.name === user.name);
		});
		const	indexDisconnect = disconnected.findIndex((elem) =>
		{
			return (elem.name === user.name);
		});
		const	newUser: ChatUserModel = {
			name: user.name,
			avatar: user.avatar,
			id: user.id,
			profileId: user.profileId,
			online: online,
			status: online ? "online" : "offline",
		}
		if (online)
		{
			if (indexConnect === -1)
			{
				connected.push(newUser);
			}
			if (indexDisconnect !== -1)
			{
				disconnected.splice(indexDisconnect, 1);
			}
		}
		else
		{
			if (indexDisconnect === -1)
			{
				disconnected.push(newUser);
			}
			if (indexConnect !== -1)
			{
				connected.splice(indexConnect, 1);
			}
		}
		const	response: ControllerModel = {
			...prev.controller,
			user:
			{
				...prev.controller.user,
				chat:
				{
					...prev.controller.user.chat,
					disconnectedUsers: disconnected,
					connectedUsers: connected
				}
			}
		}
		dispatch(controllerActions.connectChatUser(response));
	});
}

export const	setFt = (isFromFortyTwo: boolean)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return (async (dispatch, getState) =>
	{
		const	prev = getState();
		const	response: ControllerModel = {
			...prev.controller,
			user:
			{
				...prev.controller.user,
				ft: isFromFortyTwo
			}
		}
		dispatch(controllerActions.setFt(response));
	});
}

export const	setCurrentProfile = (profileId: string)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return (async (dispatch, getState) =>
	{
		const	prev = getState();
		const	searchUser = prev.controller.user.chat.users.find((elem) =>
		{
			return (elem.profileId === profileId);
		});
		if (searchUser === undefined)
			return ;
		const	response: ControllerModel = {
			...prev.controller,
			user:
			{
				...prev.controller.user,
				chat:
				{
					...prev.controller.user.chat,
					currentProfile: profileId
				}
			}
		}
		dispatch(controllerActions.setCurrentProfile(response));
	});
}

export const	setCurrentProfileIsFriend = (isFriend: boolean)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return (async (dispatch, getState) =>
	{
		const	prev = getState();
		const	response: ControllerModel = {
			...prev.controller,
			user:
			{
				...prev.controller.user,
				chat:
				{
					...prev.controller.user.chat,
					currentProfileIsFriend: isFriend
				}
			}
		}
		dispatch(controllerActions.setCurrentProfileIsFriend(response));
	});
}

export const	updateChatUsers = (profileId: string, newPseudo: string)
  : ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return (async (dispatch, getState) =>
	{
		const	prev = getState();
		const	index = prev.controller.user.chat.users.findIndex((elem: ChatUserModel) =>
		{
		return (elem.profileId === profileId);
		});
		const	updatedUsers = [...prev.controller.user.chat.users];
		if (index !== -1)
		updatedUsers[index].name = newPseudo;
		const	response: ControllerModel = {
			...prev.controller,
			user:
			{
				...prev.controller.user,
				chat:
				{
					...prev.controller.user.chat,
					users: updatedUsers
				}
			}
		}
		dispatch(controllerActions.updateChatUsers(response));
	});
}

export const	getMyStats = ()
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return (async (dispatch, getState) =>
	{
		const	prev = getState();
		const	token = prev.controller.user.bearerToken;
		const	uri = prev.server.uri;
		const	data = await ServerService.getMyStats(token, uri);
		if (data.success)
		{
			const	response: ControllerModel = {
				...prev.controller,
				myStats: data.data
			}
			dispatch(controllerActions.setMyStats(response));
		}
		else
			dispatch(controllerActions.setMyStats(prev.controller));
	})
}

export const	getStats = (userProfileId: string)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return (async (dispatch, getState) =>
	{
		const	prev = getState();
		const	token = prev.controller.user.bearerToken;
		const	uri = prev.server.uri;
		const	searchUser = prev.controller.user.chat.users.find((elem) =>
		{
			return (elem.profileId === userProfileId);
		});
		if (searchUser === undefined)
			return ;
		const	data = await ServerService.getStats(token, userProfileId, searchUser.avatar, uri);
		if (data.success)
		{
			if (data.data.length)
			{
				const	response: ControllerModel = {
					...prev.controller,
					stats: data.data
				}
				dispatch(controllerActions.setStats(response));
			}
			else
			{
				const	response: ControllerModel = {
					...prev.controller,
					stats: []
				}
				dispatch(controllerActions.setStats(response));
			}
		}
		else
			dispatch(controllerActions.setStats(prev.controller));
	})
}

export const	getAllStats = ()
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return (async (dispatch, getState) =>
	{
		const	prev = getState();
		const	token = prev.controller.user.bearerToken;
		const	uri = prev.server.uri;
		const	data = await ServerService.getAllStats(token, uri);
		if (data.success)
		{
			if (data.data.length)
			{
				const	response: ControllerModel = {
					...prev.controller,
					stats: data.data
				}
				dispatch(controllerActions.setStats(response));
			}
			else
			{
				const	response: ControllerModel = {
					...prev.controller,
					stats: []
				}
				dispatch(controllerActions.setStats(response));
			}
		}
		else
			dispatch(controllerActions.setStats(prev.controller));
	})
}

export const	getAchievements = (profileId: string)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return (async (dispatch, getState) =>
	{
		const	prev = getState();
		const	token = prev.controller.user.bearerToken;
		const	uri = prev.server.uri;
		const	data = await UserServices.getAchievements(token, uri, profileId);
		if (data.length)
		{
			const	response: ControllerModel = {
				...prev.controller,
				user: {
					...prev.controller.user,
					achievements: data.achievements
				}
			}
			dispatch(controllerActions.setAchievements(response));
		}
	})
}

export const	setUserBackFromDB = (token: string)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return (async (dispatch, getState) =>
	{
		const	prev = getState();

		const	data = await UserServices.getUserBackFromDB(token, prev.server.uri);
		if (data === "ERROR")
		{
			dispatch(controllerActions.setUserBackFromDB(prev.controller));
			return ;
		}
		let	loggin: boolean, doubleAuth: boolean;
		loggin = false;
		doubleAuth = false;
		if (data.doubleAuth === false || data.doubleAuth === "false")
			loggin = true;
		else
			doubleAuth = true;
		const	response: ControllerModel = {
			...prev.controller,
			user:
			{
				...prev.controller.user,
				id: data.id,
				email: data.email,
				date: data.date,
				login: data.login,
				firstName: data.firstName,
				lastName: data.lastName,
				username: data.username,
				avatar: data.avatar,
				doubleAuth: doubleAuth as boolean,
				location: data.location,
				isLoggedIn: loggin as boolean,
				ftAvatar: data.ftAvatar,
				bearerToken: token,
				registered: true
			}
		}
		dispatch(controllerActions.setUserBackFromDB(response));
	});
}

export const	userSignIn = (username: string, password: string)
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return (async (dispatch, getState) =>
	{
		const	prev = getState();

		const	data = await UserServices.UserSignin(username, password, prev.server.uri);
		if (data === "ERROR")
			return ;
		else
		{
			dispatch(setUserBackFromDB(data.token));
			const	response: ControllerModel = {
				...prev.controller,
				user:
				{
					...prev.controller.user,
					bearerToken: data.token,
				}
			}
			dispatch(controllerActions.setNewToken(response));
		}
	});
}

export const	getPlayingStatus = ()
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return (async (dispatch, getState) =>
	{
		const	prev = getState();
		const	data = await UserServices.getPlayingStatus(prev.controller.user.bearerToken, prev.server.uri);
		if (data === "ERROR")
			dispatch(controllerActions.setStatus(prev.controller));
		else if (data.length)
		{
			const	response: ControllerModel = {
				...prev.controller,
				user:
				{
					...prev.controller.user,
					chat:
					{
						...prev.controller.user.chat,
						users: data
					}
				}
			}
			dispatch(controllerActions.setStatus(response));
		}
	});
}

export const	resetController = ()
: ThunkAction<void, RootState, unknown, AnyAction> =>
{
	return ((dispatch) =>
	{
		dispatch(controllerActions.resetController(initialControllerState));
	});
}

