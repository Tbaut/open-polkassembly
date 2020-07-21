
// Copyright 2019-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Client, ThreadID } from '@textile/hub';
import { Libp2pCryptoIdentity } from '@textile/threads-core';
import { useCallback,useEffect, useMemo,useState } from 'react';
import { useTextileAuthInfoLazyQuery } from 'src/generated/graphql';
import { textileCollection,TextileComment,TextilePost } from 'src/types';

// const textileTokenInfo = {
// 'key': 'brf3mvikosuht6syaqjmfaqtnxi',
// 'libp2pIdentity': 'bbaareydwzseqsqvljvsb2h3ct2em7gz7t3edbux2fntas3u7tr7odlo4iml6bvcpfcfmf7lrhu6eadvwlwo4li4caqbts2peu577obgqxx3taf7a2rhsrcwc7vyt2pcab23f3hofuobaiazznhsko77xatil35zq',
// 'msg': '2020-07-14T23:41:40.122Z',
// 'sig': 'bvsapvqxdmst45dh4fm5tpozgckijzbfsc44ic62v4z54k7g5syna',
// 'token': 'eyJhbGciOiJFZDI1NTE5IiwidHlwIjoiSldUIn0.eyJpYXQiOjE1OTQ3NjY1MDEsImlzcyI6ImJiYWFyZWlnd2pvYXd1ZWc1a3ZobWMzNjI3Z3Zja2htZTd6emZlbnVqYXVqcHRodGd6Y21odHRvYTZ1Iiwic3ViIjoiYmJhYXJlaWF4NGRrZTZrZWt5bDZ4Y3BqNGlhaGxteG01eXdyeWViYWRoZnU2amozNzY0Y25icHB4Z2EifQ.vlOinb41Rf5oLMz0QE0gFOra8xIxm7D291UJfj_583CVPYIqBt6ii5S-qEAxFMy9dyoWMkqS3x2NgW-_cxdwAg'
// };

export const useTextile = () => {
	// Todo Should be InstanceList<any>
	const [pendingComment, setPendingComment] = useState(false);
	const [valueComment, setValueComment] = useState<string[] | null>(null);
	const [errorComment, setErrorComment] = useState<Error | null>(null);

	const [pendingPost, setPendingPost] = useState(false);
	const [valuePost, setValuePost] = useState<string[] | null>(null);
	const [errorPost, setErrorPost] = useState<Error | null>(null);
	const [client, setClient] = useState<Client | null>(null);

	const [pendingFind, setPendingFind] = useState(false);
	const [valueFind, setValueFind] = useState<any | null>(null);
	const [errorFind, setErrorFind] = useState<Error | null>(null);

	const [pendingFindComment, setPendingFindComment] = useState(false);
	const [valueFindComment, setValueFindComment] = useState<any | null>(null);
	const [errorFindComment, setErrorFindComment] = useState<Error | null>(null);

	const threadId = process.env.REACT_APP_TEXTILE_THREAD_ID;
	const thread = useMemo(() => {
		return ThreadID.fromString(threadId || '');
	}
	,[threadId]
	);
	const [getAuthInfo, { data }] = useTextileAuthInfoLazyQuery();
	const { textileAuthInfo } = data || {};

	useEffect(() => {
		if (!textileAuthInfo){
			console.log('--> no auth info yet, calling getAuthInfo');
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

	},[client, textileAuthInfo]);

	const createPost = useCallback((post: TextilePost[]) => {

		if (!client){
			return null;
		}

		setPendingPost(true);
		setValuePost(null);
		setErrorPost(null);
		return client.create(thread, textileCollection.POST, post)
			.then(response => setValuePost(response))
			.catch(error => setErrorPost(error))
			.finally(() => setPendingPost(false));
	}, [client, thread]);

	const createComment = useCallback((comment: TextileComment[]) => {

		if (!client){
			return null;
		}

		setPendingComment(true);
		setValueComment(null);
		setErrorComment(null);

		return client.create(thread, textileCollection.COMMENT, comment)
			.then(response => setValueComment(response))
			.catch(error => setErrorComment(error))
			.finally(() => setPendingComment(false));
	}, [client, thread]);

	const findPost = useCallback((query: any) => {
		console.log('--> findPost');
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

	const findComment = useCallback((query: any) => {
		if (!client){
			return null;
		}

		setPendingFindComment(true);
		setValueFindComment(null);
		setErrorFindComment(null);

		client.find(thread, textileCollection.COMMENT, query)
			.then(response => setValueFindComment(response))
			.catch(error => setErrorFindComment(error))
			.finally(() => setPendingFindComment(false));
	},[client, thread]);

	return {
		client,
		createComment,
		createPost,
		errorComment,
		errorFind,
		errorFindComment,
		errorPost,
		findComment,
		findPost,
		pendingComment,
		pendingFind,
		pendingFindComment,
		pendingPost,
		threadId,
		valueComment,
		valueFind,
		valueFindComment,
		valuePost
	};
};