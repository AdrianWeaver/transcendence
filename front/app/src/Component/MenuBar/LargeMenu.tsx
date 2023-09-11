/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { pagesVisitor, pagesLinksVisitor } from "./config/PagesItemVisitors";
import displayStyle from "./config/DisplayStyle";
import { useNavigate } from "react-router-dom";

import strToPascalCase from "./extras/strToPascalCase";
import { useAppSelector } from "../../Redux/hooks/redux-hooks";
import { pagesLinksLogged, pagesLogged } from "./config/PagesItemLogged";

const	LargeMenu = () =>
{
	const	navigate = useNavigate();
	const	isLogged = useAppSelector((state) =>
	{
		return (state.controller.user.isLoggedIn);
	});
	const	sxDyn = {
		display: displayStyle.smallHidden,
		flexGrow: 1,
	};

	const handleClickVisitor = (event: React.MouseEvent<HTMLElement>) =>
	{
		const	elem = event.currentTarget as HTMLElement;
		const	text = strToPascalCase(elem.innerText);
		const	linkId = pagesVisitor.findIndex((elem) =>
		{
			return (elem === text);
		});
		// console.log(pagesLinks[linkId]);
		navigate(pagesLinksVisitor[linkId]);
	};

	const handleClickLogged = (event: React.MouseEvent<HTMLElement>) =>
	{
		const	elem = event.currentTarget as HTMLElement;
		const	text = strToPascalCase(elem.innerText);
		const	linkId = pagesLogged.findIndex((elem) =>
		{
			return (elem === text);
		});
		// console.log(pagesLinks[linkId]);
		navigate(pagesLinksLogged[linkId]);
	};

	const	Visitors = pagesVisitor.map((page) =>
	{
		return(
			<Button
				key={page}
				onClick={handleClickVisitor}
				sx={
				{
					my: 2,
					color: "black",
					display: "block"
				}}
			>
			{page}
			</Button>
		);
	});

	const	LoggedUsers = pagesLogged.map((page) =>
	{
		return(
			<Button
				key={page}
				onClick={handleClickLogged}
				sx={
				{
					my: 2,
					color: "black",
					display: "block"
				}}
			>
			{page}
			</Button>
		);
	});

	return (
		<Box sx={sxDyn}>
		{
			(isLogged)
			? LoggedUsers
			: Visitors
		}
		</Box>
	);
};

export default LargeMenu;
