// Copyright 2019-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Where } from '@textile/threads-client';
import styled from '@xstyled/styled-components';
import React, { useEffect } from 'react';
import { CommentFieldsFragment } from 'src/generated/graphql';
import { useTextile } from 'src/hooks';

interface Props{
    className?: string;
    content?: string | null;
    id: number;
    comments? : CommentFieldsFragment[];
}
const TextileStatus = ({ className, comments, content, id } : Props) => {
	const { errorFind, errorFindComment, findPost, findComment, valueFindComment, valueFind } = useTextile();

	useEffect(() => {
		findPost(new Where('_id').eq(id.toString()));
	}, [findPost, id]);

	// useEffect(() => {
	// 	findComment(new Where('postId').eq(id.toString()));
	// }, [findComment, id]);

	// useEffect(() => {
	// 	console.log('valueFindComment',valueFindComment);
	// }, [valueFindComment]);

	useEffect(() => {
		console.log('valueFind',valueFind);
	},[valueFind]);

	return <div className={className}>status</div>;
};

export default styled(TextileStatus)`
`;