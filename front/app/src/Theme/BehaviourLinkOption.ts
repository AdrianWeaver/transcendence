
import	{ LinkProps } from "@mui/material/Link";
import	LinkBehaviour from "./LinkBehaviour";

const	BehaviourLinkOption = {
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

export default BehaviourLinkOption;
