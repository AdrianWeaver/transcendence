
import LogoBase from "./components/LogoBase";
import TitleBase from "./components/TitleBase";
import CardBase from "./components/CardBase";
import DocInfoBase from "./components/DocInfoBase";
import TestComponent from "./components/TestComponent";

import "./styles/Base.css";

import { useSavePrevPage } from "../../Router/Hooks/useSavePrevPage";
import MenuBar from "../../Component/MenuBar/MenuBar";

const	BaseViewFromViteJs = () =>
{
	useSavePrevPage("/starter-pack");
	return (
		<>
			<MenuBar />
			<LogoBase />
			<TitleBase />
			<CardBase />
			<DocInfoBase />
			<TestComponent />
		</>
	);
};

export default BaseViewFromViteJs;
