
// Copyright 2019-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Client, ThreadID } from '@textile/hub';
import { Libp2pCryptoIdentity } from '@textile/threads-core';
import { useCallback,useEffect, useState } from 'react';
import { useTextileAuthInfoLazyQuery } from 'src/generated/graphql';
import { textileCollection,TextilePost } from 'src/types';

// const textileTokenInfo = {
// 	'key': 'brf3mvikosuht6syaqjmfaqtnxi',
// 	'libp2pIdentity': 'bbaareydwzseqsqvljvsb2h3ct2em7gz7t3edbux2fntas3u7tr7odlo4iml6bvcpfcfmf7lrhu6eadvwlwo4li4caqbts2peu577obgqxx3taf7a2rhsrcwc7vyt2pcab23f3hofuobaiazznhsko77xatil35zq',
// 	'msg': '2020-07-14T23:41:40.122Z',
// 	'sig': 'bvsapvqxdmst45dh4fm5tpozgckijzbfsc44ic62v4z54k7g5syna',
// 	'token': 'eyJhbGciOiJFZDI1NTE5IiwidHlwIjoiSldUIn0.eyJpYXQiOjE1OTQ3NjY1MDEsImlzcyI6ImJiYWFyZWlnd2pvYXd1ZWc1a3ZobWMzNjI3Z3Zja2htZTd6emZlbnVqYXVqcHRodGd6Y21odHRvYTZ1Iiwic3ViIjoiYmJhYXJlaWF4NGRrZTZrZWt5bDZ4Y3BqNGlhaGxteG01eXdyeWViYWRoZnU2amozNzY0Y25icHB4Z2EifQ.vlOinb41Rf5oLMz0QE0gFOra8xIxm7D291UJfj_583CVPYIqBt6ii5S-qEAxFMy9dyoWMkqS3x2NgW-_cxdwAg'
// };

export const useTextile = () => {
	// const [createPost, setCreatePost] = useState<(post: TextilePost[]) => Promise<string[]> | undefined>();
	// Todo Should be InstanceList<any>
	// const [findPost, setFindPost] = useState<(query: any) => Promise<any> | undefined>();
	const [pending, setPending] = useState(false);
	const [value, setValue] = useState<string[] | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const [client, setClient] = useState<Client | null>(null);
	const [pendingFind, setPendingFind] = useState(false);
	const [valueFind, setValueFind] = useState<any | null>(null);
	const [errorFind, setErrorFind] = useState<Error | null>(null);
	const threadId = process.env.REACT_APP_TEXTILE_THREAD_ID;
	const thread = ThreadID.fromString(threadId || '');
	const [getAuthInfo, { data }] = useTextileAuthInfoLazyQuery();
	const { textileAuthInfo } = data || {};

	useEffect(() => {
		if (!textileAuthInfo){
			console.log('--> no auth info, calling getAuthInfo');
			getAuthInfo();
			return;
		}

		console.log('textileAuthInfo', textileAuthInfo);
		setClient(Client.withUserAuth({ ...textileAuthInfo }));
	},[getAuthInfo, textileAuthInfo]);

	useEffect(() => {

		if (!client || !textileAuthInfo){
			return;
		}

		Libp2pCryptoIdentity.fromString(textileAuthInfo.libp2pIdentity).then(
			async (user) => {
				await client.getToken(user);
			}
		);

		// setCreatePost(async (post: TextilePost[]) => {
		// 	console.log('post',post);
		// 	return await client.create(thread, textileCollection.POST, post);
		// });
		//todo remove the any here, this will bite
		// setFindPost(async (query: any ) => {
		// 	console.log('query',query);
		// 	return await client.find(thread, textileCollection.POST, query);
		// });
	},[client, textileAuthInfo]);

	const createPost = useCallback((post: TextilePost[]) => {

		if (!client){
			return null;
		}

		setPending(true);
		setValue(null);
		setError(null);
		return client.create(thread, textileCollection.POST, post)
			.then(response => setValue(response))
			.catch(error => setError(error))
			.finally(() => setPending(false));
	}, [client, thread]);

	const findPost = useCallback((query: any) => {
		if (!client){
			return null;
		}

		setPendingFind(true);
		setValueFind(null);
		setErrorFind(null);

		client.find(thread, textileCollection.POST, query)
			.then(response => setValueFind(response))
			.catch(error => setErrorFind(error))
			.finally(() => setPendingFind(false));
	},[client, thread]);

	return { createPost, error, errorFind, findPost, pending, pendingFind, value, valueFind };
};