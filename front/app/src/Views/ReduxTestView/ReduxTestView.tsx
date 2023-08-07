import { useSavePrevPage } from "../../Router/Hooks/useSavePrevPage";

const	ReduxTestView = () =>
{
	useSavePrevPage("/redux-test-view");
	return (<p>{"<ReduxViewTest>"}</p>);
};

export default ReduxTestView;
