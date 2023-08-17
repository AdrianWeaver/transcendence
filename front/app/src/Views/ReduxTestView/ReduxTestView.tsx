/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import MenuBar from "../../Component/MenuBar/MenuBar";
import
{
	setThemeModeToDark,
	setThemeModeToLight
}	from "../../Redux/store/controllerAction";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks/redux-hooks";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow
}	from "@mui/material";
import { ControllerModel, ServerModel } from "../../Redux/models/redux-models";
import { PersistPartial } from "redux-persist/lib/persistReducer";
import { useSavePrevPage } from "../../Router/Hooks/useSavePrevPage";
import { useEffect } from "react";

type	KeyValuePair = {
	key: string,
	value: string
};

type	TableVisualisationProps = {
	title: string,
	items: Array<KeyValuePair>
};

const	createData = (key: string, value: string) =>
{
	return (
	{
		key,
		value
	});
};

const	createControllerItems = (
	controller: ControllerModel & PersistPartial)
	: Array<KeyValuePair> =>
{
	const	array = [];

	array.push(createData("activeView", controller.activeView));
	array.push(createData("themeMode", controller.themeMode));
	array.push(createData("previousPage", controller.previousPage));
	array.push(createData("anonymousUser", "[Object] please see next table"));
	array.push(createData("user", "[Object] please see next table"));
	array.push(createData("registration", "[Object] please see next table"));
	array.push(createData("canvas", "[Object] please see next table"));
	return (array);
};

const	createAnonymousUserItems = (
	controller: ControllerModel & PersistPartial)
	: Array<KeyValuePair> =>
{
	const	array = [];

	array.push(createData("uuid", controller.anonymousUser.uuid));
	return (array);
};

const	createUserItems = (
	controller: ControllerModel & PersistPartial)
	: Array<KeyValuePair> =>
{
	const	array = [];

	array.push(createData("isLoggedIn", "" + controller.user.isLoggedIn));
	array.push(createData("username", "" + controller.user.username));
	array.push(createData("bearerToken", "" + controller.user.bearerToken));
	array.push(createData("rememberMe", "" + controller.user.rememberMe));

	return (array);
};

const	createRegistrationItems = (
	controller: ControllerModel & PersistPartial)
	: Array<KeyValuePair> =>
{
	const	array = [];

	array
	.push(
		createData(
			"startedRegister",
			"" + controller.registration.startedRegister
		)
	);
	array
	.push(
		createData(
			"step",
			"" + controller.registration.step
		)
	);
	array
	.push(
		createData(
			"codeOauthFT",
			"" + controller.registration.codeOauthFT
		)
	);
	array
	.push(
		createData(
			"abortRequested",
			"" + controller.registration.abortRequested
		)
	);
	array
	.push(
		createData(
			"requestHomeLink",
			"" + controller.registration.requestHomeLink
		)
	);
	return (array);
};

const	createCanvasItems = (
	controller: ControllerModel & PersistPartial)
	: Array<KeyValuePair> =>
{
	const	array = [];

	array.push(createData("height", "" + controller.canvas.height));
	array.push(createData("width", "" + controller.canvas.width));
	return (array);
};

const	createServerItems = (
	server: ServerModel)
	: Array<KeyValuePair> =>
{
	const	array = [];

	array.push(createData("isFetching", "" + server.isFetching));
	array.push(createData("connexionEnabled", "" + server.connexionEnabled));
	array.push(createData("connexionAttempt", "" + server.connexionAttempt));
	array.push(createData("error", "" + server.error));
	array.push(createData("message", "" + server.message));
	return (array);
};


const	TableVisualisation = (props: TableVisualisationProps) =>
{
	return (
		<>
			<TableContainer
					sx={{ maxHeigh: 440}}
					// component={Paper}
				>
				<Table
					sx={{minWidth: 700}}
					aria-label="Redux state"
				>
					<TableHead>
						<TableRow sx={{backgroundColor: "#4242ff"}}>
							<TableCell align="left">
								{props.title}
							</TableCell>
							<TableCell />
						</TableRow>
						<TableRow sx={{backgroundColor: "#4242ff"}}>
							<TableCell align="left">
								KEY
							</TableCell>
							<TableCell align="left" >
								VALUE
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{
							props.items.map((row, index) =>
							{
								if (index % 2 !== 0)
									return (
										<TableRow key={props.title + row.key}
										sx={{backgroundColor: "#121212"}}
										>
											<TableCell >{row.key}</TableCell>
											<TableCell>{row.value}</TableCell>
										</TableRow>
									);
								else
									return (
										<TableRow
											key={props.title + row.key}
											sx={{backgroundColor: "#424242"}} >
											<TableCell >{row.key}</TableCell>
											<TableCell>{row.value}</TableCell>
										</TableRow>
									);
							})
						}
					</TableBody>
				</Table>

			</TableContainer>
		</>
	);
};

const	ReduxTestView = () =>
{
	const	savePrevPage = useSavePrevPage();

	useEffect(() =>
	{
		savePrevPage("/redux-test-view");
	});

	const	dispatch = useAppDispatch();
	const	controller = useAppSelector((state) =>
	{
		return (state.controller);
	});
	const	server = useAppSelector((state) =>
	{
		return (state.server);
	});
	const	setDarkMode = () =>
	{
		if (controller.themeMode === "light")
			dispatch(setThemeModeToDark());
	};

	const	setLightMode = () =>
	{
		if (controller.themeMode === "dark")
			dispatch(setThemeModeToLight());
	};

	return (
		<>
			<MenuBar />
			<div>
				<h1>Redux Test View</h1>
			</div>
			<div>
				<ToggleButtonGroup
					color="primary"
					value={controller.themeMode}
					exclusive
					aria-label="change-theme-mode"
				>
					<ToggleButton
						value="light"
						onClick={setLightMode}
					>
						Light mode
					</ToggleButton>
					<ToggleButton
						value="dark"
						onClick={setDarkMode}
					>
						Dark mode
					</ToggleButton>
				</ToggleButtonGroup>
			</div>
			<TableVisualisation
				title="CONTROLLER"
				items={createControllerItems(controller)}
			/>
			<TableVisualisation
				title="ANONYMOUS USER"
				items={createAnonymousUserItems(controller)}
			/>
			<TableVisualisation
				title="USER"
				items={createUserItems(controller)}
			/>
			<TableVisualisation
				title="REGISTRATION"
				items={createRegistrationItems(controller)}
			/>
			<TableVisualisation
				title="CANVAS"
				items={createCanvasItems(controller)}
			/>
			<TableVisualisation
				title="SERVER"
				items={createServerItems(server)}
			/>
		</>
	);
};

export default ReduxTestView;
