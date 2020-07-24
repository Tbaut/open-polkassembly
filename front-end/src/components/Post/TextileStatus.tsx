// Copyright 2019-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Where } from '@textile/threads-client';
import styled from '@xstyled/styled-components';
import React, { useEffect, useState } from 'react';
import { Popup } from 'semantic-ui-react';
import { CommentFieldsFragment } from 'src/generated/graphql';
import { useTextileFindPost } from 'src/hooks';

interface Props{
	author?: string | null;
    className?: string;
    content?: string | null;
    id: number;
	comments? : CommentFieldsFragment[];
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

const TextileStatus = ({ author, className, content, id, title } : Props) => {
	const [isValid, setIsValid] = useState<boolean | null>(null);
	const [findPost, { data, error }] = useTextileFindPost();
	const [popupText, setPopupText] = useState('Verifying content on IPFS...');

	useEffect(() => {
		findPost(new Where('_id').eq(id.toString()));
	}, [findPost, id]);

	useEffect(() => {
		if(error){
			console.error('error', error);
		}
	}, [error]);

	useEffect(() => {
		console.log('data',data);

		if (data?.instancesList.length){
			const { content: textileContent, title: textileTitle, author: textileAuthor } = data.instancesList[0];

			if (content !== textileContent){
				setPopupText('Post content donot match between this page and what is stored on IPFS. This page should not be trusted.');
				console.error('Content donnot match!', content, textileContent);
				setIsValid(false);
			} else if (title !== textileTitle){
				setPopupText('Post title donot match between this page and what is stored on IPFS. This page should not be trusted.');
				console.error('Title donot match!', title, textileTitle);
				setIsValid(false);
			} else if (author !== textileAuthor){
				setPopupText('Post author donot match between this page and what is stored on IPFS. This page should not be trusted.');
				console.error('Author donot match!', author, textileAuthor);
				setIsValid(false);
			} else {
				setPopupText('The content on this page matches with the one stored on IPFS!');
				setIsValid(true);
			}
		}

		if (data?.instancesList.length === 0){
			setPopupText('No data corresponding to this id could be found on IPFS. This page should not be trusted.');
			setIsValid(false);
		}

	}, [author, data, content, title]);

	return (
		<div className={className}>
			<Popup
				className={className}
				trigger={<SpanContent
					className={
						isValid === null
							? 'grey'
							: isValid === true
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