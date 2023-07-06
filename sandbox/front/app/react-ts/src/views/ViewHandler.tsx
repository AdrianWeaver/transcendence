/* eslint-disable react-refresh/only-export-components */
import React, { Component } from "react";

import { connect } from "react-redux";

import
{
	setView
} from "../store/action/controller";

interface Props
{
	_setView: (viewName: IController) => void;
	controller:
	{
		controller :IController;
	}
}

interface State
{
	controller: IController;
}

class ViewHandler extends Component <Props, State>
{
	constructor(props: Props)
	{
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick()
	{
		console.log("Switching view requested");
		const	newView : IController
		= {
			activeView: "Home"
		};
		this.props._setView(newView);
	}

	render(): React.ReactNode
	{
		let	componentRenderer;

		if (this.props.controller.controller.activeView === "Loading")
			componentRenderer = (
				<>
					<p>Loading View</p>
					<button type="button" onClick={this.handleClick}>
						Change active view
					</button>
				</>
			);
		else
			componentRenderer = (
				<>
					<p>Welcome on Board</p>
					<p>View is {this.props.controller.controller.activeView}</p>
				</>
			);
		return (
			componentRenderer
		);
	}
}

const	mapStateToProps = (state: ControllerState) =>
{
	return (
	{
		controller: state.controller,
	});
};

const	mapDispatchToProps = (dispatch: DispatchType) =>
{
	return (
	{
		_setView: (viewName:IController ) =>
		{
			dispatch(setView(viewName));
		}
	});
};


export default connect(mapStateToProps, mapDispatchToProps)(ViewHandler);
