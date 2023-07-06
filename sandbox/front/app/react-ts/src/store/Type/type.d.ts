// eslint-disable-next-line max-len
// https://www.freecodecamp.org/news/how-to-use-redux-in-your-react-typescript-app/
interface	IController
{
	activeView: string
}

type	ControllerState =
{
	controller: IController;
}

type	ControllerAction =
{
	type: string
	controller: IController
}

type	DispatchType = (args: ControllerAction) => ControllerAction;
