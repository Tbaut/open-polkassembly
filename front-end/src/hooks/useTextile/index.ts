
// Copyright 2019-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Client, ThreadID } from '@textile/hub';
import { Libp2pCryptoIdentity } from '@textile/threads-core';
import { useCallback,useEffect, useMemo,useState } from 'react';
import { useTextileAuthInfoLazyQuery } from 'src/generated/graphql';
import { textileCollection,TextileComment,TextilePost } from 'src/types';

export const useTextile = () => {
	// Todo Should be InstanceList<any>
	const [pendingComment, setPendingComment] = useState(false);
	const [valueComment, setValueComment] = useState<string[] | null>(null);
	const [errorComment, setErrorComment] = useState<Error | null>(null);

	const [pendingPost, setPendingPost] = useState(false);
	const [valuePost, setValuePost] = useState<string[] | null>(null);
	const [errorPost, setErrorPost] = useState<Error | null>(null);
	const [client, setClient] = useState<Client | null>(null);

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
			getAuthInfo();
			return;
		}

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

	return {
		client,
		createComment,
		createPost,
		errorComment,
		errorPost,
		pendingComment,
		pendingPost,
		thread,
		valueComment,
		valuePost
	};
};