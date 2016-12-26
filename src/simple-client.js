var sdk = require("matrix-js-sdk");

var matrixClient = sdk.createClient('https://matrix.org');

let joinedRoom = false;

matrixClient.registerGuest().then((creds) => {
	const client = sdk.createClient({
		baseUrl: 'https://matrix.org',
		accessToken: creds.access_token,
		userId: creds.user_id,
		deviceId: creds.device_id,
		guest: true,
		timelineSupport: true,
	});
	client.on("Room.timeline", (event, room, toStartOfTimeline) => {
		console.log('event: ',event)
	});
	client.on("sync", (event, data1, data2) => {
		if (!joinedRoom) {
			client.joinRoom('#dev-test-room:matrix.org').done((room) => {
				console.log('joined Room: ', room);
				joinedRoom = true;
			});
		}
	});
	client.setGuest(true);
	// client.startClient({initialSyncLimit: 20});
	client.startClient(0);
});
