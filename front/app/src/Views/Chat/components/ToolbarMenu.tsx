/* eslint-disable max-statements */


import {
	Tab,
	Tabs,
	Toolbar,
	useTheme
} from "@mui/material";

import a11yProps from "../extras/allyProps";
import
{
	useAppDispatch,
	useAppSelector
} from "../../../Redux/hooks/redux-hooks";

import { setActiveViewToolbar } from "../../../Redux/store/chatAction";

// type ToolbarProps =
// {
// 	activeView?: number
// };

// eslint-disable-next-line max-lines-per-function
const ToolbarMenu = () =>
{
	const	style = useTheme();
	const	value = useAppSelector((state) =>
	{
		return (state.chat.toolbarActiveView);
	});
	const	dispatch = useAppDispatch();

	const handleChange = (event: React.SyntheticEvent, newValue: number) =>
	{
		dispatch(setActiveViewToolbar(newValue));
	};

	return (
		<Toolbar
			style={
				{
					backgroundColor: style.palette.primary.main,
				}}
		>
			<Tabs
				value={value}
				onChange={handleChange}
				indicatorColor="primary"
				textColor="secondary"
				variant="scrollable"
				aria-label="action tabs"
			>
				<Tab
					label="Channels"
					{...a11yProps(0)}
					style={{fontSize: "15px"}}
				/>
				<Tab
					label="Users"
					{...a11yProps(1)}
					style={{fontSize: "15px"}}
				/>
				<Tab
					label="Friends"
					{...a11yProps(2)}
					style={{fontSize: "15px"}}
				/>
			</Tabs>
		</Toolbar>
	);
};

export default ToolbarMenu;