/* eslint-disable curly */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import { Button } from "@mui/material";
import { useAppDispatch } from "../../Redux/hooks/redux-hooks";
import {
    revokeGameWithUuid,
    getMyActiveGame
} from "../../Redux/store/gameEngineAction";

type ButtonRemoveGameProps = {
	uuid: string;
	revoked: boolean
};

const	ButtonRemoveGame = (props: ButtonRemoveGameProps) =>
{
	const	dispatch = useAppDispatch();

	let	render;

	if (props.revoked)
	{
		render = (
			<Button
				size="small"
				onClick={() =>
				{
					// dispatch()
				}}
				disabled={props.revoked}
			>
				En cours de suppression
			</Button>
		);
	}
	else
	{
		render = (
			<Button
				size="small"
				onClick={() =>
				{
					dispatch(revokeGameWithUuid(props.uuid));
					dispatch(getMyActiveGame());
				}}
			>
				Supprimer
			</Button>
		);
	}

	return (
		render
	);
};

export default ButtonRemoveGame;
