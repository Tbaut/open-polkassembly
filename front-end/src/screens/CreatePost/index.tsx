// Copyright 2019-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React, { useCallback,useContext, useEffect,useState } from 'react';
import { Controller,useForm } from 'react-hook-form';
import { Checkbox, CheckboxProps, Grid } from 'semantic-ui-react';
import useCurrentBlock from 'src/hooks/useCurrentBlock';

import ContentForm from '../../components/ContentForm';
import TitleForm from '../../components/TitleForm';
import { NotificationContext } from '../../context/NotificationContext';
import { UserDetailsContext } from '../../context/UserDetailsContext';
import { CreatePostMutation,useCreatePollMutation, useCreatePostMutation, usePostSubscribeMutation } from '../../generated/graphql';
import { useBlockTime, useRouter, useTextile } from '../../hooks';
import { NotificationStatus, TextilePost } from '../../types';
import Button from '../../ui-components/Button';
import FilteredError from '../../ui-components/FilteredError';
import { Form } from '../../ui-components/Form';
import TopicsRadio from './TopicsRadio';

interface Props {
	className?: string
}

const TWO_WEEKS = 2 * 7 * 24 * 60 * 60 * 1000;

const CreatePost = ({ className }:Props): JSX.Element => {
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [hasPoll, setHasPoll] = useState(false);
	const { queueNotification } = useContext(NotificationContext);
	const [selectedTopic, setSetlectedTopic] = useState(1);
	const currentUser = useContext(UserDetailsContext);
	const { control, errors, handleSubmit } = useForm();
	const { blocktime } = useBlockTime();
	const [isIPFSSending, setIsIPFSSending] = useState(false);
	const [dataPostCreation, setDataPostCreation] = useState<CreatePostMutation | undefined>(undefined);

	const currenBlockNumber = useCurrentBlock()?.toNumber();
	const [createPostMutation, { loading, error }] = useCreatePostMutation();
	const [createPollMutation] = useCreatePollMutation();
	const [postSubscribeMutation] = usePostSubscribeMutation();
	const [isSending, setIsSending] = useState(false);
	const { history } = useRouter();
	const { createPost, errorPost, valuePost } = useTextile();

	const createSubscription = useCallback((postId: number | undefined) => {
		if (!currentUser.email_verified) {
			return;
		}

		if (!currentUser?.notification?.postCreated) {
			return;
		}

		if (postId !==0 && !postId){
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
			})
			.catch((e) => console.error('Error subscribing to post',e));
	}, [currentUser, postSubscribeMutation]);

	const createPoll = useCallback((postId: number | undefined) => {
		if (!hasPoll) {
			return;
		}

		if (postId !==0 && !postId){
			return;
		}

		if (!currenBlockNumber) {
			queueNotification({
				header: 'Failed to get current block number. Poll creation failed!',
				message: 'Failed',
				status: NotificationStatus.ERROR
			});
			return;
		}

		const blockEnd = currenBlockNumber + Math.floor(TWO_WEEKS / blocktime);

		createPollMutation({
			variables: {
				blockEnd,
				postId
			}
		})
			.catch((e) => console.error('Error subscribing to post', e));
	}, [hasPoll, currenBlockNumber, blocktime, createPollMutation, queueNotification]);

	const handleSend = () => {
		if (currentUser.id && title && content && selectedTopic){
			setIsSending(true);
			setIsIPFSSending(true);

			createPostMutation({ variables: {
				content,
				title,
				topicId: selectedTopic,
				userId: currentUser.id
			} }).then(({ data }) => {
				if (data?.insert_posts?.affected_rows && data?.insert_posts?.affected_rows > 0 && data?.insert_posts?.returning?.length && data?.insert_posts?.returning?.[0]?.id) {
					createPost([{
						_id: `${data.insert_posts.returning[0].id}`,
						author: currentUser.username,
						content,
						createdAt: Date.now().toString(),
						title,
						updatedAt: Date.now().toString()
					} as TextilePost]);
					setDataPostCreation(data);
				} else {
					throw Error('Error in post creation');
				}
			}).catch( e => console.error(e));
		} else {
			console.error('Current userid, title, content or selected topic missing',currentUser.id, title, content, selectedTopic);
		}
	};

	const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>[]) => {setTitle(event[0].currentTarget.value); return event[0].currentTarget.value;};
	const onContentChange = (data: Array<string>) => {setContent(data[0]); return data[0].length ? data[0] : null;};
	const onPollChanged = (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => { setHasPoll(data.checked || false);};

	useEffect(() => {
		if(!dataPostCreation){
			return;
		}

		if(!valuePost){
			return;
		}

		setIsIPFSSending(false);
		const postId = dataPostCreation.insert_posts?.returning?.[0]?.id;
		queueNotification({
			header: 'Thanks for sharing!',
			message: 'Post created successfully.',
			status: NotificationStatus.SUCCESS
		});

		createSubscription(postId);
		createPoll(postId);
		history.push(`/post/${postId}`);
	},[createPoll, createSubscription, dataPostCreation, history, isIPFSSending, queueNotification, valuePost]);

	useEffect(() => {
		if (errorPost){
			console.error('ErrorPost', errorPost);
		}
	},[errorPost]);

	return (
		<Grid>
			<Grid.Column mobile={16} tablet={16} computer={12} largeScreen={10} widescreen={10}>
				<Form className={className}>
					<h3>New post</h3>
					<Controller
						as={<TitleForm
							errorTitle={errors.title}
						/>}
						control={control}
						name='title'
						onChange={onTitleChange}
						rules={{ required: true }}
					/>
					<Controller
						as={<ContentForm
							errorContent={errors.content}
						/>}
						control={control}
						name='content'
						onChange={onContentChange}
						rules={{ required: true }}
					/>

					<Form.Group>
						<Form.Field>
							<Checkbox label='Add a poll to this discussion' checked={hasPoll} toggle onChange={onPollChanged} />
						</Form.Field>
					</Form.Group>

					<TopicsRadio
						onTopicSelection={(id: number) => setSetlectedTopic(id)}
					/>

					<div className={'mainButtonContainer'}>
						<Button
							primary
							onClick={handleSubmit(handleSend)}
							disabled={isSending || loading}
							type='submit'
						>
							{
								isSending || loading
									? 'Creating...'
									: isIPFSSending
										? 'Sending to IPFS...'
										: 'Create'
							}
						</Button>
					</div>
					{error?.message && <FilteredError text={error.message}/>}
				</Form>
			</Grid.Column>
			<Grid.Column only='computer' computer={4} largeScreen={6} widescreen={6}/>
		</Grid>
	);
};

export default styled(CreatePost)`
	.mainButtonContainer{
		align-items: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-top: 3rem;
	}
`;
