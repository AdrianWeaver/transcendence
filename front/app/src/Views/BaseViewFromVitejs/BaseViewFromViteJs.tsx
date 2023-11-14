/* eslint-disable max-statements */

import LogoBase from "./components/LogoBase";
import TitleBase from "./components/TitleBase";
import CardBase from "./components/CardBase";
import DocInfoBase from "./components/DocInfoBase";
import TestComponent from "./components/TestComponent";

import "./styles/Base.css";

import { useSavePrevPage } from "../../Router/Hooks/useSavePrevPage";
import MenuBar from "../../Component/MenuBar/MenuBar";
import { useEffect } from "react";
// import { useDispatch } from "react-redux";

const	BaseViewFromViteJs = () =>
{
	const	savePrevPage = useSavePrevPage();

	useEffect(() =>
	{
		savePrevPage("/starter-pack");
	});

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
