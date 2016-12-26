#!/usr/bin/env node
const fetch = require('node-fetch');
const Matrix = require('matrix-js-sdk');

const lastFmAPIkey = require('./lastfm-key').lastFmAPIkey;
const matrixLogin = require('./matrix-key');

const artistRexEx = /^!artist (.*)/;

const matrixClient = Matrix.createClient('https://matrix.org');
matrixClient.loginWithPassword(matrixLogin.userId, matrixLogin.pass).then((credentials) => {
	console.log('login success');
	const client = Matrix.createClient({
		baseUrl: 'https://matrix.org',
		accessToken: credentials.access_token,
		userId: credentials.user_id,
	});
	client.on('Room.timeline', (event, room, toStartOfTimeline) => {
		const message = event.event.content.body;
		if (artistRexEx.test(message)) {
			const match = artistRexEx.exec(message);
			if (match) {
				fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${match[1]}&api_key=${lastFmAPIkey}&format=json`)
					.then(res => res.json())
					.then((data) => {
						console.log('info: ', data.artist.bio.summary);
					});
			}
		} else {
			console.log('message did not match: ', message);
		}
	});
	client.startClient(0);
});
