// Copyright 2019-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { ThreadID } from '@textile/hub';

import { getClientWithKeyInfo } from './getClientWithKeyInfo';
import { commentSchema, postSchema } from './schemas';
import { collection } from './types';

export const setupNewDB = async (threadName: string): Promise<void> => {
	const client = await getClientWithKeyInfo();
	const threadId = ThreadID.fromRandom();
	const thread = await client.newDB(threadId, threadName);
	const threadString = thread.toString();

	await client.newCollection(thread, collection.POST, postSchema);
	await client.newCollection(thread, collection.COMMENT, commentSchema);

	console.log(`
        Created DB ${threadName}.
        with collections ${collection.POST} and ${collection.COMMENT}
        --> Add the following to the env: TEXTILE_THREAD_ID="${threadString}" 
    `);

	process.exit();
};

