// Copyright 2019-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Where } from '@textile/threads-client';
import styled from '@xstyled/styled-components';
import { ApolloQueryResult } from 'apollo-client';
import React, { useEffect } from 'react';
import { useTextile } from 'src/hooks';
import { textileCollection } from 'src/types';

import {
	CommentFieldsFragment,
	DiscussionPostAndCommentsQuery,
	DiscussionPostAndCommentsQueryVariables,
	MotionPostAndCommentsQuery,
	MotionPostAndCommentsQueryVariables,
	ProposalPostAndCommentsQuery,
	ProposalPostAndCommentsQueryVariables,
	ReferendumPostAndCommentsQuery,
	ReferendumPostAndCommentsQueryVariables,
	TipPostAndCommentsQuery,
	TipPostAndCommentsQueryVariables,
	TreasuryProposalPostAndCommentsQuery,
	TreasuryProposalPostAndCommentsQueryVariables
} from '../../generated/graphql';
import Comment from './Comment';

interface Props{
	className?: string
	comments: CommentFieldsFragment[]
	refetch: (variables?:
		ReferendumPostAndCommentsQueryVariables |
		DiscussionPostAndCommentsQueryVariables |
		ProposalPostAndCommentsQueryVariables |
		MotionPostAndCommentsQueryVariables |
		TipPostAndCommentsQueryVariables |
		TreasuryProposalPostAndCommentsQueryVariables |
		undefined) =>
		Promise<ApolloQueryResult<TipPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<TreasuryProposalPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<MotionPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<ReferendumPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<ProposalPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<DiscussionPostAndCommentsQuery>>
}

const Comments = ({ className, comments, refetch }: Props) => {
	const { client, thread } = useTextile();
	useEffect(() => {
		client?.find(thread, textileCollection.COMMENT, {}).then(all => console.log('all', JSON.stringify(all, null, 2)));
		const quer = new Where('postId').eq('53');
		client?.find(thread, textileCollection.COMMENT, quer).then(all => console.log('53', JSON.stringify(all, null, 2)));
		const quer2 = new Where('postId').eq('56');
		client?.find(thread, textileCollection.COMMENT, quer2).then(all => console.log('56', JSON.stringify(all, null, 2)));
	});
	return (
		<div className={className}>
			{comments.map((comment:CommentFieldsFragment) =>
				<Comment
					comment={comment}
					key={comment.id}
					refetch={refetch}
				/>
			)}
		</div>
	);
};

export default styled(Comments)`
	margin-top: 4rem;
`;
