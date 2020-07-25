// Copyright 2019-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Where } from '@textile/threads-client';
import styled from '@xstyled/styled-components';
import React, { useEffect, useState } from 'react';
import { Popup } from 'semantic-ui-react';
import { CommentFieldsFragment } from 'src/generated/graphql';
import { useTextileFindComments, useTextileFindPosts } from 'src/hooks';

interface Props{
	author?: string | null;
    className?: string;
	comments? : CommentFieldsFragment[];
    content?: string | null;
    id: number;
	title? : string | null;
}

const SpanContent = styled.span`
		cursor: pointer;
		font-size: 2rem;
		transition-duration: 1s;

		&.grey {
			color: grey_primary;
		}

		&.green {
			color: green_primary;
		}

		&.red {
			color: red_primary;
		}
`;

const DivContent = styled.div`
	font-size: xs;
	color: black_text;
`;

const TextileStatus = ({ author, className, comments, content, id, title } : Props) => {
	const [isValidPost, setIsValidPost] = useState<boolean | null>(null);
	const [findPosts, { data: dataPosts, error: errorPosts }] = useTextileFindPosts();
	const [isValiComments, setIsValidComments] = useState<boolean | null>(null);
	const [findComments, { data: dataComments, error: errorComments }] = useTextileFindComments();
	const [popupText, setPopupText] = useState('Verifying content on IPFS...');

	useEffect(() => {
		setIsValidPost(null);
		findPosts(new Where('_id').eq(id.toString()));
	}, [findPosts, id, content]);

	useEffect(() => {
		setIsValidComments(null);
		findComments(new Where('postId').eq(id.toString()));
	}, [findComments, id, comments]);

	useEffect(() => {
		if(errorPosts){
			console.error('errorPosts', errorPosts);
		}

		if(errorComments){
			console.error('errorComments', errorComments);
		}
	}, [errorPosts, errorComments]);

	useEffect(() => {
		console.log('dataPosts',dataPosts);

		if (dataPosts?.instancesList.length){
			const { content: textileContent, title: textileTitle, author: textileAuthor } = dataPosts.instancesList[0];

			if (content !== textileContent){
				setPopupText('Post content donot match between this page and what is stored on IPFS. This page should not be trusted.');
				console.error(`Post content doesnot match! ${content} !== ${textileContent}`);
				setIsValidPost(false);
			} else if (title !== textileTitle){
				setPopupText('Post title donot match between this page and what is stored on IPFS. This page should not be trusted.');
				console.error(`Title doesnot match! ${title} !== ${textileTitle}`);
				setIsValidPost(false);
			} else if (author !== textileAuthor){
				setPopupText('Post author donot match between this page and what is stored on IPFS. This page should not be trusted.');
				console.error(`Post author doesnot match! ${author} !== ${textileAuthor}`);
				setIsValidPost(false);
			} else {
				setPopupText('The content on this page matches with the one stored on IPFS!');
				setIsValidPost(true);
			}
		}

		if (dataPosts?.instancesList.length === 0){
			setPopupText('No data corresponding to this id could be found on IPFS. This page should not be trusted.');
			setIsValidPost(false);
		}

	}, [author, dataPosts, content, title]);

	useEffect(() => {
		console.log('dataComments',dataComments);

		if (dataComments?.instancesList.length && comments?.length){
			comments.forEach(({ author, content }, index) => {
				const { author: IPFSAuthor, content: IPFSContent } = dataComments?.instancesList[index] || {};
				const username = author?.username;

				if(username !== IPFSAuthor){
					setPopupText('Author in comments donot match between this page and what is stored on IPFS. This page should not be trusted.');
					console.error(`Comment author donnot match! ${IPFSAuthor} !== ${username}`);
					setIsValidComments(false);
				} else if(content !== IPFSContent){
					setPopupText('Content in comments donot match between this page and what is stored on IPFS. This page should not be trusted.');
					console.error(`Comment content donnot match! ${content} !== ${IPFSContent}`);
					setIsValidComments(false);
				} else {
					setPopupText('The content on this page matches with the one stored on IPFS!');
					setIsValidComments(true);
				}
			});
		}

		if (dataComments?.instancesList.length === 0 && comments?.length === 0){
			setPopupText('The content on this page matches with the one stored on IPFS!');
			setIsValidComments(true);
		// in case there's no comment found on IPFS
		} else if (dataComments?.instancesList.length === 0){
			setPopupText('No data corresponding to this id could be found on IPFS. This page should not be trusted.');
			setIsValidComments(false);
		}

	}, [dataComments, comments]);

	return (
		<div className={className}>
			<Popup
				className={className}
				trigger={<SpanContent
					className={
						(isValidPost === null || isValiComments === null)
							? 'grey'
							: (isValidPost === true && isValiComments === true)
								? 'green'
								: 'red'
					}>●</SpanContent>}
				content={<DivContent>{popupText}</DivContent>}
				hoverable={true}
				position='top center'
			/>
		</div>
	);
};

export default styled(TextileStatus)`
	position: absolute;
	right: 3rem;
	z-index: 1;
	top: 3rem;
`;