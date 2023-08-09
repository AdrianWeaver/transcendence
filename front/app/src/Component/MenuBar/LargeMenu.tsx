/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { pages, pagesLinks } from "./config/PagesItem";
import displayStyle from "./config/DisplayStyle";
import { useNavigate } from "react-router-dom";

import strToPascalCase from "./extras/strToPascalCase";

const	LargeMenu = () =>
{
	const	navigate = useNavigate();
	const	sxDyn = {
		display: displayStyle.smallHidden,
		flexGrow: 1,
	};

	const handleClick = (event: React.MouseEvent<HTMLElement>) =>
	{
		const	elem = event.currentTarget as HTMLElement;
		const	text = strToPascalCase(elem.innerText);
		const	linkId = pages.findIndex((elem) =>
		{
			return (elem === text);
		});
		// console.log(pagesLinks[linkId]);
		navigate(pagesLinks[linkId]);
	};

	return (
		<Box sx={sxDyn}>
		{
			pages.map((page) =>
			{
				return(
					<Button
						key={page}
						onClick={handleClick}
						sx={
						{
							my: 2,
							color: "white",
							display: "block"
						}}
					>
					{page}
					</Button>
				);
			})
		}
		</Box>
	);
};

export default LargeMenu;
