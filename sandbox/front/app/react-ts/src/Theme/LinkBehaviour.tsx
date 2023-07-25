import
{
	Link as RouterLink,
	LinkProps as RouterLinkProp
} from "react-router-dom";
import React from "react";

/**
 * This change the behaviour of link of Link and Button
 * It doesn't change page but only location
 *  Map href (Material UI) -> to (react-router)
 */
const	LinkBehaviour = React.forwardRef<
	HTMLAnchorElement,
	Omit<RouterLinkProp, "to"> & {href : RouterLinkProp["to"]}
>((props, ref) =>
{
	const	{ href, ...other} = props;

	return (<RouterLink ref={ref} to={href} {...other} />);
});

export default LinkBehaviour;
