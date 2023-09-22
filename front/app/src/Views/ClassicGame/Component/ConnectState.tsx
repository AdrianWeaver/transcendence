
type	ConnectStateProps =
{
	connected?: boolean;
}

const	ConnectState = (props: ConnectStateProps) =>
{
	if (props.connected)
		return (
			<>
				ws_status: online
			</>
		);
	else
		return (
			<>
				ws_status: offline
			</>
		);
};

export default ConnectState;
