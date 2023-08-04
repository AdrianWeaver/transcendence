import {
	BrowserRouter,
	Route,
	Routes,
}	from "react-router-dom";

/**
 * The registration router redirect always on signup until esc
 * or locatioon storage cleaned
 */
const	RegistrationRouter = () =>
{
	return (
		<BrowserRouter >
			<Routes>
				<Route
					path="*"
					element={<p>{"<Signup />"}</p>}
				/>
			</Routes>
		</BrowserRouter>
	);
};

export default RegistrationRouter;
