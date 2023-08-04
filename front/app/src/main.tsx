import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { store, persistor } from "./Redux/store/index.ts";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<Provider store={store}>
			<PersistGate
				loading={<p>recover data from local storage...</p>}
				persistor={persistor}
				>
					<App />
			</PersistGate>
		</Provider>
	</React.StrictMode>,
);
