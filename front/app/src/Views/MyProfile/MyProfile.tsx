/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import { useEffect } from "react";
import MenuBar from "../../Component/MenuBar/MenuBar";
import { useSavePrevPage } from "../../Router/Hooks/useSavePrevPage";

import data from "./realFakeData.json";
import { ConstructionSharp } from "@mui/icons-material";

const	MyProfile = () =>
{
	const	savePrevPage = useSavePrevPage();

	console.log(data);
	let	ft, pseudo, online;
	let	id, lastName, firstName, login, email, url, active, avatar;

	ft = true;
	pseudo = "Guest";
	if (data !== undefined)
	{
		id = data.id;
		lastName = data.last_name;
		firstName = data.first_name;
		login = data.login;
		email = data.email;
		url = data.url;
		active = data["active?"];
		avatar = data.image;
	}
	else
	{
		id = "undefined";
		lastName = "undefined";
		firstName = "undefined";
		login = "undefined";
		email = "undefined";
		url = "undefined";
		active = undefined;
		avatar = "https://thispersondoesnotexist.com/";
	}

	if (active !== undefined)
		online = "🟢";
	else
		online = "🔴";
	useEffect(() =>
	{
		savePrevPage("/me/profile");
	});

	return (
		<>
			<MenuBar />
			<p>{"<MyProfile>"}</p>
			<p>ACTIVE : {online}</p>
			<p> <img src={avatar.link} width="90" height="90" /></p>
			<p>Last Name : {lastName}</p>
			<p>First Name : {firstName}</p>
			<p>pseudo : {pseudo}</p>
			<p>login : {login} (id:{id})</p>
			<p>email : {email}</p>
			<a href= {url}>URL</a>

			{/* <p><Button onClick={addAsFriend}>Add as friend</Button></p> */}
		</>
	);
};

export default MyProfile;
