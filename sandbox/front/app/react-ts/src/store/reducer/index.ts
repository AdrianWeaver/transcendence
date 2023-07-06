
import { combineReducers } from "redux";
import { controllerReducer } from "./controllerReducer";

const	rootReducer = combineReducers({
	controller: controllerReducer
});

export default rootReducer;
