import	{ TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import type { RootState, AppDispatch } from "../store";

export const	useAppDispatch = () =>
{
	return (useDispatch<AppDispatch>());
};
export const	useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
