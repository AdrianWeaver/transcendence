/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */

import Canvas from "../Canvas/Canvas";
import MenuBar from "../MenuBar/MenuBar";
import "./customStyle.css";

type ColorsVariantsModel = {
	purple: string,
	yellow: string,
	blue: string,
	red: string,
	orange: string,
	green: string,
};

const	cssColors: ColorsVariantsModel = {
	purple: "#744EF2",
	yellow: "#F2DB29",
	blue: "#4C29F2",
	red: "#F22705",
	orange: "#f0932b",
	green: "#1DF297"
};

type	LetterProps = {
	color: string
	letter: string
};

const	Letter = (props: LetterProps) =>
{
	let	colorStyle;

	switch (props.color)
	{
		case "purple":
			colorStyle = cssColors.purple;
			break;
		case "yellow":
			colorStyle = cssColors.yellow;
			break;
		case "blue":
			colorStyle = cssColors.blue;
			break ;
		case "red":
			colorStyle = cssColors.red;
			break;
		case "orange":
			colorStyle = cssColors.orange;
			break;
		case "green":
			colorStyle = cssColors.green;
			break;
		default:
			colorStyle = cssColors.red;
			break;
	}
	return (
		<span style={{color: colorStyle }}>
			{props.letter}
		</span>
	);
};

const	Title = () =>
{
	return (
		<div style={{display: "normal"}} className="crt">
			<div className="game-element gamefont titlefont"
			>
				PONG
				<span id="dev">
				</span>
			</div>
			<div className="game-element gamefont titlefont title2font">
				<Letter color="yellow" letter="f" />
				<Letter color="green" letter="t" />
				<Letter color="purple" letter="_" />
				<Letter color="orange" letter="t" />
				<Letter color="blue" letter="r" />
				<Letter color="green" letter="a" />
				<Letter color="red" letter="n" />
				<Letter color="yellow" letter="s" />
				<Letter color="green" letter="c" />
				<Letter color="purple" letter="e" />
				<Letter color="orange" letter="n" />
				<Letter color="blue" letter="d" />
				<Letter color="green" letter="e" />
				<Letter color="yellow" letter="n" />
				<Letter color="red" letter="c" />
				<Letter color="purple" letter="e" />
			</div>
			<div
				id="startbutton"
				className="game-element gamefont startfont"
			>
				<a href="./indexPong.html">
					Play
				</a>
			</div>
		</div>
	);
};

import { useState, useEffect, useRef } from "react";

const	UseWindowsSize = () =>
{
	const
	[
		dimensions,
		setDimensions
	] = useState({
		height: window.innerHeight,
		width: window.innerWidth
	});

	useEffect(() =>
	{
		function handleResize()
		{
			setDimensions(
			{
				height: window.innerHeight,
				width: window.innerWidth
			});
		}

		window.addEventListener("resize", handleResize);
		return () =>
		{
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (dimensions);
};

const	Background = () =>
{
	const	size = UseWindowsSize();
	const	interval = (size.width / 10);
	const	cross = 0 - (interval * 8);

	const	draw = (context: CanvasRenderingContext2D) =>
	{
		const gradient = context.createLinearGradient(0, size.height, 0, 0);
		gradient.addColorStop(0, "rgba(0, 255, 0, 0.5)");
		gradient.addColorStop(0.55, "rgba(0, 255, 0, 0)");
		gradient.addColorStop(1.0, "rgba(0, 255, 0, 0)");

		context.clearRect(0, 0, size.width, size.height);
	};

	return (
			<Canvas
				draw={draw}
				width={size.width}
				height={size.height} />
	);
};

const	TheGame = () =>
{
	return (
		<>
			<MenuBar />
			<Title />
			<Background />
			<div
				className="game-element gamefont devfont"
			>
				by
				<a
					className="devlink"
					href="./index.html"
				>
					JEAAN
				</a>
				<br />
				<br />
				<span>
					&copy; 2023
				</span>&nbsp;
			</div>
		</>
	);
};

export default TheGame;
