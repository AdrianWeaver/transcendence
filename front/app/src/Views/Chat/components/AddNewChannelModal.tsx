/* eslint-disable max-lines-per-function */
import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions
} from "@mui/material";
import { setKindOfConversation } from "../../../Redux/store/controllerAction";

type AddNewChannelModalProps = {
	handleClickOpen: () => void;
	handleClose: () => void;
	handleSave: () => void;
	open: boolean;
	channelName: string;
	selectedMode: string;
	setChannelName: React.Dispatch<React.SetStateAction<string>>;
	setSelectedMode: React.Dispatch<React.SetStateAction<string>>;
	setChanPassword: React.Dispatch<React.SetStateAction<string>>;
	chanPassword: string;
};

const AddNewChannelModal = (props: AddNewChannelModalProps) =>
{
	return (
		<>
			<Button
				onClick={props.handleClickOpen}
				variant="contained"
				color="success"
			>
				NEW
			</Button>
			<Dialog open={props.open} onClose={props.handleClose}>
				<DialogTitle>Enter Information</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Please enter the following information:
					</DialogContentText>
					<input
						type="text"
						placeholder="User name"
						value={props.channelName}
						onChange={(e) =>
						{
							setKindOfConversation("channel");
							const inputValue = e.target.value;
							if (inputValue.length <= 8)
								props.setChannelName(inputValue);
							else
								props.setChannelName(inputValue.slice(0, 8));
						}}
					/>
					<br />
					<div>
						<input
						type="radio"
						id="option1"
						name="answerOption"
						value="public"
						checked={props.selectedMode === "public"}
						onChange={() =>
						{
							props.setSelectedMode("public");
						}}
						/>
						<label htmlFor="option1">Public</label>
					</div>
					<div>
						<input
						type="radio"
						id="option2"
						name="answerOption"
						value="protected"
						checked={props.selectedMode === "protected"}
						onChange={() =>
						{
							props.setSelectedMode("protected");
						}}
						/>
						<label htmlFor="option2">Protected</label>
					</div>
					<div>
						<input
						type="radio"
						id="option3"
						name="answerOption"
						value="private"
						checked={props.selectedMode === "private"}
						onChange={() =>
						{
							props.setSelectedMode("private");
						}}
						/>
						<label htmlFor="option3">Private</label>
					</div>
					<input
						type="text"
						placeholder="Password (if protected)"
						value={props.chanPassword}
						onChange={(e) =>
						{
							props.setChanPassword(e.target.value);
						}}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={props.handleClose} color="primary">
						Cancel
					</Button>
					<Button onClick={props.handleSave} color="primary">
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default AddNewChannelModal;
