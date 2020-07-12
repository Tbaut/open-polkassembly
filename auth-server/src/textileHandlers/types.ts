// Copyright 2019-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export enum collection {
    POST = 'post',
    COMMENT = 'comment',
  }

export type Collection = collection;

export interface Post {
    _id: string;
    title: string;
    content: string;
    author: string;
    createdAd: string;
  }

export interface Comment {
    _id: string;
    postId: string;
    title: string;
    content: string;
    author: string;
    createdAd: string;
  }
