/* eslint-disable max-statements */
import { useAppDispatch } from "../../Redux/hooks/redux-hooks";
import { setPreviousPage } from "../../Redux/store/controllerAction";

export const	useSavePrevPage = (pageToSave: string) =>
{
	const	dispatch = useAppDispatch();

	dispatch(setPreviousPage(pageToSave));
};
