import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import {store, persistor} from "./store/index";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import LoadingSession from "./components/LoadingSession.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
.render(
	<React.StrictMode>
		<Provider store={store}>
			<PersistGate
				loading={<LoadingSession />}
				persistor={persistor}>
				<App />
			</PersistGate>
		</Provider>
	</React.StrictMode>,
);
