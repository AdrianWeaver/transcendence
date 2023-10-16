/* eslint-disable curly */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import { Avatar, Backdrop, Button, Card, CardContent, CardHeader, CardMedia, Grid, IconButton, Paper, Typography } from "@mui/material";
import {DropzoneAreaBase, FileObject} from "mui-file-dropzone";
import ReactCrop from "react-image-crop";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../Redux/hooks/redux-hooks";
import { UserModel } from "../../Redux/models/redux-models";

type	MyAvatarCardProps = {
	userInfo: UserModel
	remplacement?: FileObject[]
};

const	MyAvatarCard = (props: MyAvatarCardProps) =>
{
	const	style = {
		image: {
			borderRadius: "50%"
		}
	};

	const
	[
		bestSize,
		setBestSize
	] = useState(80);

	const [
		crop,
		setCrop
	] = useState(
		{
			aspect: 1,
			x: 10,
			y: 10,
			unit: "%",
			width: 50
		});

	const	subHeader = props.userInfo.username + " - "
		+ props.userInfo.firstName
		+ " " + props.userInfo.lastName ;

	let	srcImg;
	if (props.remplacement && props.remplacement.length)
		srcImg = props.remplacement[0].data as string;
	else
		srcImg = props.userInfo.avatar;

	let	contentText;
	if (srcImg === props.userInfo.avatar)
		contentText = "Vous pouvez changer cette image,\
		vous allez la remplacer par une nouvelle image";
	else
		contentText = <>Toggle zoom</>;

		const onImageLoaded = (image: any )=>
		{
			setCrop({
				unit: "%",
				width: 50,
				aspect: 1,
				x: (image.width - 50) / 2,
				y: (image.height - 50) / 2,
			});
		};
	return (
		<Card
			sx={{scale: "0.8", }}
		>
			<CardHeader
				title="Changement d'avatar"
				subheader={subHeader}
			/>
			<CardMedia
				component={ReactCrop}
				crop={crop}
				src={srcImg}

				onChange={(newCrop) =>
				{
					console.log(newCrop);
				}}
				// image={srcImg}
				// alt={props.userInfo.login}
				// sx={{
				// 	borderRadius: "50%",
				// 	objectFit: "cover"
				// }}
				// onLoad={(event) =>
				// {
				// 	const img = event.target as HTMLImageElement;
				// 	console.log("image cast");
				// 	console.log(img);
				// }}
			/>
			<CardContent>
				<Typography variant="body1" color="text.secondary">
					{contentText}
				</Typography>
			</CardContent>
		</Card>
	);
};

const DropZoneImage = () =>
{
	const	[
		files,
		setFiles
	] = useState([]);

	const	[
		open,
		setOpen
	] = useState(false);

	const	handleAddFile = (newFile: any) =>
	{
		console.log(newFile);
		setFiles(newFile);
	};

	const	handleDeleteFile = (deleted: any) =>
	{
		setFiles(files.filter((file) =>
		{
			return (file !== deleted);
		}));
	};

	const	userInfo = useAppSelector((state) =>
	{
		return (state.controller.user);
	});

	useEffect(() =>
	{
		// console.log(files);
		// console.log(userInfo);
	}, [files]);

	const	acceptedFiles = [
		"image/jpeg",
		"image/png"
	];

	let dropContent;

	if (open)
	{
		dropContent = (
			<>
				<Backdrop
					sx={
					{
						color: "#fff",
						zIndex: (theme) =>
						{
							return (theme.zIndex.drawer + 1);
						}
					}}
					open={open}
				>
					<Grid
						container
						component={Paper}
						sx={{
							width: "50%",
						}}
					>
						<Grid
							item
							xs={12}
							// sx={{ border: "1px solid #000" }}
						>
							<Grid
								container
								component={Paper}
								justifyContent="center"
								sx={{
									width: "100%",
								}}
							>
								<Grid
									item
									xs={1}
									// sx={{ border: "1px solid #000" }}
								></Grid>
								<Grid
									item
									xs={10}
									sx={
									{
										// border: "1px solid #000",
										textAlign: "center"
									}}
								>
									<MyAvatarCard
										userInfo={userInfo}
										remplacement={files}
									/>
								</Grid>
								<Grid
									item
									xs={1}
									// sx={{ border: "1px solid #000" }}
								></Grid>
							</Grid>
						</Grid>
						<Grid item xs={12} >
							<DropzoneAreaBase
								fileObjects={files}
								onAdd={handleAddFile}
								onDelete={handleDeleteFile}
								// filesLimit={}
								dropzoneText="Glissez-deposez votre image ici"
								acceptedFiles={acceptedFiles}
								// showPreviews={true}
								showFileNames={false}
								maxFileSize={10000000}
								clearOnUnmount={true}
							/>
						</Grid>
						<Grid item xs={12}>
							<Grid
								container
								component={Paper}
								justifyContent="center"
								sx={{
									width: "100%",
								}}
							>
								<Grid
									item
									xs={2}
									// sx={{ border: "1px solid #000" }}
								></Grid>
								<Grid
									item
									xs={3}
									// sx={{ border: "1px solid #000" }}
								>
									<Button
										onClick={() =>
										{
											setFiles([]);
											setOpen(false);
										}}
									>
										annuler
									</Button>
								</Grid>
								<Grid
									item
									xs={2}
									// sx={{ border: "1px solid #000" }}
								></Grid>
								<Grid
									item
									xs={3}
									// sx={{ border: "1px solid #000" }}
								>
									<Button
										onClick={() =>
										{
											window.alert("UnImplemented yet");
										}}
									>
										Valider
									</Button>
								</Grid>
								<Grid
									item
									xs={2}
									// sx={{ border: "1px solid #000" }}
								></Grid>
							</Grid>
						</Grid>
					</Grid>
				</Backdrop>
			</>
		);
	}
	else
	{
		dropContent = (
			<>
				<Button
					onClick={() =>
					{
						setOpen(true);
					}}
				>
					Changer mon avatar
				</Button>
			</>
		);
	}
	return (
		<>
			{dropContent}
			{/* {
			(open)
			? <Button >Valider</Button>
			: (<Button >Changer mon avatar</Button>
			(open)
			? dropContent
			: <></>
			} */}

		</>
	);
};

export default DropZoneImage;
