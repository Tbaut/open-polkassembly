// Copyright 2019-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
/* eslint-disable sort-keys */

export const postSchema = {
	$schema: 'http://json-schema.org/draft-07/schema#',
	title: 'Post',
	type: 'object',
	required: ['_id'],
	properties: {
		_id: {
			type: 'string',
			description: 'The post id.'
		},
		title: {
			type: 'string',
			description: 'This post title.'
		},
		content: {
			type: 'string',
			description: 'This post content.'
		},
		author: {
			type: 'string',
			description: 'The author id.'
		},
		createdAt: {
			type: 'string',
			description: 'The creation date of the post'
		},
		updatedAt: {
			type: 'string',
			description: 'The update date of the post'
		}
	}
};

export const commentSchema = {
	$schema: 'http://json-schema.org/draft-07/schema#',
	title: 'Comment',
	properties: {
		_id: {
			type: 'string',
			description: "The instance's (comment) id."
		},
		postId: {
			type: 'string',
			description: "The forum post's id to which the comment is linked to."
		},
		content: {
			type: 'string',
			description: 'This post content.'
		},
		author: {
			type: 'string',
			description: 'The author id.'
		},
		createdAt: {
			type: 'string',
			description: 'The creation date of the post'
		},
		updatedAt: {
			type: 'string',
			description: 'The update date of the post'
		}
	}
};
