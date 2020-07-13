// Copyright 2019-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
/** Provides nodejs access to a global Websocket value, required by Hub API */
import { Client, ThreadID } from '@textile/hub';

import { getClientWithKeyInfo } from './getClientWithKeyInfo';
import { commentSchema, postSchema } from './schemas';
import { collection } from './types';
/** Provides nodejs access to a global Websocket value, required by Hub API */
(global as any).WebSocket = require('isomorphic-ws');

export const setupNewDB = async (threadName: string): Promise<void> => {
	const client = await getClientWithKeyInfo();
	const threadId = ThreadID.fromRandom();

	// this client and following token are useless, but required by the api
	// to create a new DB
	const user = await Client.randomIdentity();
	await client.getToken(user);

	const thread = await client.newDB(threadId, threadName);
	const threadString = thread.toString();

	await client.newCollection(thread, collection.POST, postSchema);
	await client.newCollection(thread, collection.COMMENT, commentSchema);

	console.log(`
###########################################################################
        Created DB ${threadName}.
        with collections ${collection.POST} and ${collection.COMMENT}
		--> Add the following to the env: TEXTILE_THREAD_ID="${threadString}"
###########################################################################
    `);

	process.exit();
};

