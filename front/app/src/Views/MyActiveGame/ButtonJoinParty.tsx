/* eslint-disable curly */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import { Button } from "@mui/material";
import { useAppSelector } from "../../Redux/hooks/redux-hooks";

type ButtonJoinPartyProps = {
	playerOne: any;
	playerTwo: any;
};
const	ButtonJoinParty = (props: ButtonJoinPartyProps) =>
{
	const	myProfileId = useAppSelector((state) =>
	{
		return (state.controller.user.id);
	});
	let	amIConnected;
	let message;
	amIConnected = false;
	if (props.playerOne.profileId === myProfileId)
	{
		if (props.playerOne.socketId === "undefined")
		{
			message = "Commencer la partie";
		}
		else if (props.playerOne.socketId === "invited")
		{
			message = "Commencer la partie";
		}
		else if (props.playerOne.socketId === "disconnected")
		{
			message = "Votre adversaire vous attend";
		}
		else if (props.playerOne.socketId === "revoked")
		{
			message = "Fin de partie";
		}
		else
		{
			message = "Vous etes deja en partie";
			amIConnected = true;
		}
	}
	if (props.playerTwo.profileId === myProfileId)
	{
		if (props.playerTwo.socketId === "undefined") // must not be on friends
		{
			message = "Commencer la partie";
		}
		else if (props.playerTwo.socketId === "invited")
		{
			message = "Commencer la partie";
		}
		else if (props.playerTwo.socketId === "disconnected")
		{
			message = "Votre adversaire vous attend";
		}
		else if (props.playerTwo.socketId === "revoked")
		{
			message = "Fin de partie";
		}
		else
		{
			message = "Vous y jouez deja";
			amIConnected = true;
		}
	}
	let	render;
	if (amIConnected === true)
		render = <Button size="small" disabled={true}>{message}</Button>;
	else
		render = <Button size="small">Entrer en jeu</Button>;
	return (render);
};

export default ButtonJoinParty;
