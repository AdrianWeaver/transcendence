
import { useAppDispatch } from "../../Redux/hooks/redux-hooks";
import { setPreviousPage } from "../../Redux/store/controllerAction";

export const	useSavePrevPage = () =>
{
	const	dispatch = useAppDispatch();

	const	savePrevPage = (pageToSave: string) =>
	{
		dispatch(setPreviousPage(pageToSave));
	};

	return (savePrevPage);
};
