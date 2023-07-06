
import React, { Component} from "react";
import ViewHandler from "./views/ViewHandler";


export default class App extends Component
{
	constructor(props: object)
	{
		super(props);
	}

	render(): React.ReactNode
	{
		return (
			<ViewHandler></ViewHandler>
		);
	}
}
