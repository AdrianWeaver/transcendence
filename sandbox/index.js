
class	ServerConfig
{
	constructor()
	{
		this.protocol = "http";
		this.domainName = "localhost";
		this.port = "3000";
		this.getUrl = () =>
		{
			return (
				this.protocol + "://" + this.domainName + ":" +
				this.port
			);
		};
		this.errorPage = () =>
		{
			return (this.getUrl() + "/error.html");
		}
	}
}

const	serverConfig = new ServerConfig();
let		connectedToServer;
let		connectionAttempt;
const	connectionStatus = document.getElementById("connection-status");

connectedToServer = false;
connectionAttempt = 0;
redirectTimer = 3;

const	redirectToErrorPage = () =>
{
	if (redirectTimer <= 0)
	{
		window.location.replace(serverConfig.errorPage());
	}
	else
	{

		connectionStatus.innerText = "Connection Error !" ;
		connectionStatus.innerText += "\nPlease verify your connection" ;
		connectionStatus.innerText += "\nYou'll be redirected in " 
			+ redirectTimer + " seconds";
		redirectTimer--;
		setTimeout(redirectToErrorPage, 1000);
	}
	
};

const	hideLoader = () =>
{
	document.getElementsByClassName("loader")[0].style.visibility = "hidden";
}

const	hideMatchmaking = () =>
{
	document.getElementsByClassName("matchmaking")[0].style.visibility = "hidden";
}

const	showMatchmakking = () =>
{
	document.getElementsByClassName("matchmaking")[0].style.visibility = "visible";
	console.log (document.getElementsByClassName("matchmaking")[0])
}

const	connectWebSocket = () =>
{
	connectionStatus.innerText = "Server is alive" ;
	connectionStatus.innerText = "\nNow checking websocket" ;

	const	socket = io(serverConfig.getUrl());
	
	socket.on('connect_error', () =>
	{
		connectionStatus.innerText = "Connection Error !" ;
		connectionStatus.innerText += "\nPlease verify your connection" ;
		connectionStatus.innerText += "\nYou'll be redirected in "
			+ redirectTimer + " seconds";
		setTimeout(redirectToErrorPage, 1000);
	});

	socket.on("connect", () =>
	{
		connectionStatus.innerText = "Loading Success !";
		setTimeout(hideLoader, 1000);
	});
};

const	checkServerAvailability = () =>
{
	connectionStatus.innerText = "Checking Server...\n " ;
	connectionStatus.innerText += "Attempt number " + connectionAttempt
		+ " of 10";
	console.log(serverConfig.getUrl());
	axios.get(serverConfig.getUrl())
	.then((data) =>
	{
		console.log(data);
		connectedToServer = true;
		connectionAttempt = 0;
		connectWebSocket();
	})
	.catch((error) =>
	{
		console.error("Server error", error);
		if (connectionAttempt >= 10)
		{
			// switch to another page
			connectionStatus.innerText = "Server is unavailable,\n"
				+ " please check your connection" ;
			return ;
		}
		connectionAttempt += 1;
		setTimeout(checkServerAvailability, 1000);
	});
};

hideMatchmaking();
connectionStatus.innerText = "Checking Server...\n " ;
setTimeout(checkServerAvailability, 1000);