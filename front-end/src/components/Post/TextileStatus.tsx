// Copyright 2019-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ThreadID } from '@textile/hub';
import { Where } from '@textile/threads-client';
import styled from '@xstyled/styled-components';
import React, { useEffect, useMemo, useState } from 'react';
import { CommentFieldsFragment } from 'src/generated/graphql';
import { useTextile } from 'src/hooks';
import { textileCollection } from 'src/types';

interface Props{
    className?: string;
    content?: string | null;
    id: number;
    comments? : CommentFieldsFragment[];
}
// const query = useMemo(() => new Where('_id').eq(id.toString()), [id]);
// const query = new Where('_id').eq('44');

const TextileStatus = ({ className, comments, content, id } : Props) => {
	// errorFindComment, findPost, findComment, valueFindComment,
	const { client, pendingFind, errorFind, threadId } = useTextile();
	const [valueFind, setValueFind] = useState<any>(undefined);
	console.log('pendingFind', pendingFind);
	console.log('errorFind',errorFind);

	useEffect(() => {
		if (!client || !threadId) {
			return;
		}

		const query = new Where('_id').eq(id.toString());
		const thread = ThreadID.fromString(threadId);
		client.find(thread, textileCollection.POST, query)
			.then(response => setValueFind(response))
			.catch(error => console.log('Error', error));
	},[client, id, threadId]);

	// useEffect(() => {
	// 	console.log('check');
	// 	console.log('findPost',findPost);
	// 	// findPost(new Where('_id').eq(id.toString()));
	// }, [findPost, id]);

	// useEffect(() => {
	// 	findComment(new Where('postId').eq(id.toString()));
	// }, [findComment, id]);

	useEffect(() => {
		console.log('valueFind',valueFind);
	}, [valueFind]);

	return <div className={className}>status</div>;
};

export default styled(TextileStatus)`
`;