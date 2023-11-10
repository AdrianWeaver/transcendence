import MenuBar from "../../Component/MenuBar/MenuBar";
import { useSavePrevPage } from "../../Router/Hooks/useSavePrevPage";

const	HistoryTable = () =>
{
	return ();
};

const	MyStats = () =>
{
	const	savePrevPage = useSavePrevPage();

	savePrevPage("/my-stays");
	return (
		<>
			<MenuBar />
			<></>
		</>
	);
};

export default MyStats;
