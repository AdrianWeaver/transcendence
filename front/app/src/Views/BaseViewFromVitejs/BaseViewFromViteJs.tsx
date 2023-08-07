
import LogoBase from "./components/LogoBase";
import TitleBase from "./components/TitleBase";
import CardBase from "./components/CardBase";
import DocInfoBase from "./components/DocInfoBase";
import TestComponent from "./components/TestComponent";

import "./styles/Base.css";

import { useSavePrevPage } from "../../Router/Hooks/useSavePrevPage";

const	BaseViewFromViteJs = () =>
{
	useSavePrevPage("/starter-pack");
	return (
		<>
			<LogoBase />
			<TitleBase />
			<CardBase />
			<DocInfoBase />
			<TestComponent />
		</>
	);
};

export default BaseViewFromViteJs;
