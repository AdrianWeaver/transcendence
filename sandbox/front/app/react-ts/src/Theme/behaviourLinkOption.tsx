
import	{ LinkProps } from "@mui/material/Link";
import	LinkBehaviour from "./LinkBehaviour";

const	behaviourLinkOption = {
	components:
	{
		MuiLink:
		{
			defaultProps:
			{
				component: LinkBehaviour
			} as unknown as LinkProps,
		},
		MuiButtonBase:
		{
			defaultProps:
			{
				LinkComponent: LinkBehaviour
			},
		},
	}
};

export default behaviourLinkOption;
