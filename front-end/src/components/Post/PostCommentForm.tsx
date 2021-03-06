// Copyright 2019-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import { ApolloQueryResult } from 'apollo-client';
import React, { useCallback,useContext,useEffect, useState } from 'react';
import { Controller,useForm } from 'react-hook-form';
import { GoReply } from 'react-icons/go';
import { useTextile } from 'src/hooks';
import { TextileComment } from 'src/types';

import { UserDetailsContext } from '../../context/UserDetailsContext';
import {
	AddPostCommentMutation,
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
	TreasuryProposalPostAndCommentsQueryVariables,
	useAddPostCommentMutation,
	usePostSubscribeMutation } from '../../generated/graphql';
import Avatar from '../../ui-components/Avatar';
import Button from '../../ui-components/Button';
import FilteredError from '../../ui-components/FilteredError';
import ContentForm from '../ContentForm';

interface Props {
	className?: string
	postId: number
	refetch: (variables?:
		DiscussionPostAndCommentsQueryVariables |
		ProposalPostAndCommentsQueryVariables |
		ReferendumPostAndCommentsQueryVariables |
		MotionPostAndCommentsQueryVariables |
		TreasuryProposalPostAndCommentsQueryVariables |
		TipPostAndCommentsQueryVariables |
		undefined
	) =>
		Promise<ApolloQueryResult<TipPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<TreasuryProposalPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<MotionPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<ReferendumPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<ProposalPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<DiscussionPostAndCommentsQuery>>
}

const PostCommentForm = ({ className, postId, refetch }: Props) => {
	const { id, notification, username } = useContext(UserDetailsContext);
	const postParticipated = notification?.postParticipated;
	const [content, setContent] = useState('');
	const { control, errors, handleSubmit, setValue } = useForm();

	const onContentChange = (data: Array<string>) => {setContent(data[0]); return data[0].length ? data[0] : null;};
	const [addPostCommentMutation, { error }] = useAddPostCommentMutation();
	const [postSubscribeMutation] = usePostSubscribeMutation();
	const { createComment, errorComment, valueComment } = useTextile();
	const [data, setDataComment] = useState<AddPostCommentMutation | undefined>(undefined);

	const createSubscription = useCallback((postId: number) => {
		if (!postParticipated) {
			return;
		}

		postSubscribeMutation({
			variables: {
				postId
			}
		})
			.then(({ data }) => {
				if (data && data.postSubscribe && data.postSubscribe.message) {
					console.log(data.postSubscribe.message);
				}
			}).catch(() => {
				//do nothing
			});
	}, [postParticipated, postSubscribeMutation]);

	useEffect(() => {
		if (errorComment){
			console.error('errorComment', errorComment);
		}
	},[errorComment]);

	useEffect(() => {
		if (data && valueComment){
			console.log('valueComment',valueComment[0]);
			setContent('');
			setValue('content', '');
			refetch();
			createSubscription(postId);
		}
	},[createSubscription, data, postId, refetch, setValue, valueComment]);

	const handleSave = () => {
		if (!id) return;

		addPostCommentMutation( {
			variables: {
				authorId: id,
				content,
				postId
			} }
		)
			.then(({ data }) => {
				if (data && data.insert_comments && data.insert_comments.affected_rows > 0 && data.insert_comments.returning.length) {
					createComment([{
						_id: `${data.insert_comments.returning[0].id}`,
						author: username,
						content,
						createdAt: Date.now().toString(),
						postId: postId.toString(),
						updatedAt: Date.now().toString()
					} as TextileComment]);
					setDataComment(data);
				} else {
					throw new Error('No data returned from the saving comment query');
				}
			})
			.catch((e) => console.error('Error saving comment',e));
	};

	if (!id) return <div>You must log in to comment.</div>;

	return (
		<div className={className}>
			{error?.message && <FilteredError text={error.message}/>}
			<Avatar
				className='avatar'
				username={username || ''}
				size={'lg'}
			/>

			<div className='comment-box'>
				<Controller
					as={<ContentForm
						height={100}
						errorContent={errors.content}
					/>}
					name='content'
					control={control}
					onChange={onContentChange}
					rules={{ required: true }}
				/>
				<div className='button-container'>
					<Button primary size='small' onClick={handleSubmit(handleSave)}><GoReply className='icon'/>Reply</Button>
				</div>
			</div>
		</div>
	);
};

export default styled(PostCommentForm)`
	display: flex;
	margin: 2rem 0;

	.avatar {
		display: inline-block;
		flex: 0 0 4rem;
		margin-right: 2rem;
		@media only screen and (max-width: 576px) {
			display: none;
		}
	}

	.comment-box {
		background-color: white;
		padding: 1rem;
		border-radius: 3px;
		box-shadow: box_shadow_card;
		width: calc(100% - 60px);
	}

	.button-container {
		width: 100%;
		display: flex;
		justify-content: flex-end;
	}
`;
