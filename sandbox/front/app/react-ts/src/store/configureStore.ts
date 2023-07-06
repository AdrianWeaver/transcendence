import { composeWithDevTools } from "redux-devtools-extension";
import { applyMiddleware, createStore} from "redux";
import thunk from "redux-thunk";
import reducer from "./reducer/index";
import {persistStore, persistReducer} from "redux-persist";
import storage from "redux-persist/lib/storage";

const	persistConfig = {
	key: "root",
	version: 1,
	storage,
};

const	persistedReducer = persistReducer(persistConfig, reducer);

export const store = createStore(persistedReducer,
	composeWithDevTools(applyMiddleware(thunk)));

export const persistor = persistStore(store);
