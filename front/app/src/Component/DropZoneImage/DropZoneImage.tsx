/* eslint-disable max-len */
/* eslint-disable curly */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import {
	Backdrop,
	Button,
	Card,
	CardContent,
	CardHeader,
	CardMedia,
	Grid,
	Paper,
	Slider,
	Typography
} from "@mui/material";
import {DropzoneAreaBase, FileObject, readFile} from "mui-file-dropzone";
import { useAppSelector } from "../../Redux/hooks/redux-hooks";
import { UserModel } from "../../Redux/models/redux-models";
import { useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import axios from "axios";

type	MyAvatarCardProps = {
	userInfo: UserModel,
	remplacement?: FileObject[],
	// readyExport: boolean
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
		isImageSquare,
		setIsImageSquare
	] = useState(false);
	const
	[
		bestSize,
		setBestSize
	] = useState(80);

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
	let displayedCard;
	if (isImageSquare === false)
		displayedCard = (
			<>
			</>
		);
	else
		displayedCard = (<>Need  to crop image</>);
	return (
		<Card
			sx={{scale: "0.8", }}
		>
			<CardHeader
				title="Changement d'avatar"
				subheader={subHeader}
			/>
				<CardMedia
					component="img"
					image={srcImg}
					height="50%"
					alt={props.userInfo.login}
					sx={{
						borderRadius: "50%",
						objectFit: "cover"
					}}
					onLoad={(event) =>
						{
							const img = event.target as HTMLImageElement;
							console.log("image cast");
							console.log(img);
							console.log(img.naturalHeight, img.naturalWidth);
							if (img.naturalHeight !== img.naturalWidth)
							{
								setIsImageSquare(false);
							}
							else
								setIsImageSquare(true);
						}}
					/>
			<CardContent>
				<Typography variant="body1" color="text.secondary">
					{contentText}
				</Typography>
			</CardContent>
		</Card>
	);
};

type	CropMyImageProps = {
	userInfo: UserModel,
	remplacement: FileObject[],
	setFiles: React.Dispatch<React.SetStateAction<FileObject[]>>
	readyExport: boolean,
	setReadyExport: any
};

const	CropMyImage = (props: CropMyImageProps) =>
{
	const [
		zoom,
		setZoom
	] = useState(1);

	const	editor: React.RefObject<AvatarEditor> | null = useRef(null);

	if (props.remplacement?.length === 0 || props.readyExport)
	{
		// return (<>Please import file</>); // can display here
		return (
			<MyAvatarCard
				userInfo={props.userInfo}
				remplacement={props.remplacement}
			/>
		);
	}
	else
	{
		const borderColor = [
			255,
			50,
			50,
			0.3
		];
		// console.log(props.remplacement[0]);

		const	dataURLtoFile = (
			dataURL: string,
			filename: string,
			mimeType : string) =>
		{
			const	array = dataURL.split(",");
			const	bstr = atob(array[array.length - 1]);
			let		n;
			n = bstr.length;
			const	u8array = new Uint8Array(n);
			while (n--)
				u8array[n] = bstr.charCodeAt(n);
			return (new File([u8array], filename, {type: mimeType}));
		};

		return (
			<>
				<Card
					sx={{scale: "1", }}
				>
					<CardHeader
						title="Changement d'avatar"
						subheader="redimensionnement et "
					/>
					<AvatarEditor
						ref={editor}
						image={props.remplacement[0].file}
						width={300}
						height={300}
						border={10}
						color={borderColor}
						scale={zoom}
						rotate={0}
					/>
					<CardContent>
						<Slider
							size="small"
							defaultValue={zoom}
							valueLabelDisplay="auto"
							min={1}
							max={4}
							step={0.01}
							onChange={(event: any) =>
							{
								// console.log(event.target.value);
								setZoom(event.target.value);
							}}
						/>
						<Typography variant="body2" color="text.secondary">
							"faites glisser puis validez"
						</Typography>
						<Button
							onClick={() =>
							{
								if (editor.current !== null)
								{
									const	oldImage = props.remplacement[0];
									// console.log("next value is old images");
									// console.log(oldImage);

									const dataURL = editor
										.current?.getImageScaledToCanvas()
										.toDataURL(oldImage.file.type);
									// props.setFiles([scaled]);
									// console.log("Next value is scalled ");
									// console.log(dataURL);
									const	fileData = dataURLtoFile(
										dataURL,
										oldImage.file.name,
										oldImage.file.type
									);
									const file : FileObject = {
										data: dataURL,
										file: fileData
									};
									console.log("New file created: ");
									console.log(file);
									props.setFiles([file]);
									// dataURLtgoFile
									// console.log(props.remplaceement[0]);
									props.setReadyExport(true);
								}
							}}
						>
							Valider le redimensionnement
						</Button>
					</CardContent>
				</Card>
			</>
		);
	}
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

	const [
		readyExport,
		setReadyExport
	] = useState(false);

	const	token = useAppSelector((state) =>
	{
		return (state.controller.user.bearerToken);
	});
	const	uri = useAppSelector((state) =>
	{
		return (state.server.uri);
	});
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

	const	acceptedFiles = [
		"image/jpeg",
		"image/png"
	];

	let	dropArea;

	// const test = userInfo.

	if (files.length > 0)
	{
		dropArea = <>Element is updated</>;
	}
	else
	{
		dropArea = (
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
				clearOnUnmount={false}
			/>);
	}

	let dropContent;

	const	sendImage = () =>
	{
		if (files.length === 0)
			return ;
		const	formData = new FormData();
		formData.append("image", files[0]);
// localhost
		axios.post(uri + ":3000/user/update-photo", formData, {
			headers: {
				// "Content-Type": "multipart/form-data",
				"Authorization": token
			}
		})
		.then((response) =>
		{
			console.log(response.data);
		})
		.catch((error) =>
		{
			console.error(error);
		});
	};

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
									{/* <MyAvatarCard
										userInfo={userInfo}
										remplacement={files}
										// readyExport={readyExport}
									/> */}
									<CropMyImage
										userInfo={userInfo}
										remplacement={files}
										setFiles = {setFiles}
										readyExport={readyExport}
										setReadyExport={setReadyExport}
										// readyExport={readyExport}
									/>
								</Grid>
								<Grid
									item
									xs={1}
								></Grid>
							</Grid>
						</Grid>
						<Grid item xs={12} >
							{dropArea}
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
								></Grid>
								<Grid
									item
									xs={3}
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
								></Grid>
								<Grid
									item
									xs={3}
								>
									<Button
										onClick={sendImage}
									>
										Valider
									</Button>
								</Grid>
								<Grid
									item
									xs={2}
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
