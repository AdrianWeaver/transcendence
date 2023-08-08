/* eslint-disable max-lines-per-function */

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import pages from "./config/PagesItem";
import displayStyle from "./config/DisplayStyle";

const	LargeMenu = () =>
{
	const	sxDyn = {
		display: displayStyle.smallHidden,
		flexGrow: 1,
	};

	return (
		<Box sx={sxDyn}>
		{
			pages.map((page) =>
			{
				return(
					<Button
						key={page}
						// onClick={close nav menu}
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
