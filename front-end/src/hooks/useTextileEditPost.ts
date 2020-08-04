
// Copyright 2019-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { useCallback, useState } from 'react';
import { textileCollection, TextilePost } from 'src/types';

import { useTextile } from './useTextile';

export const useTextileEditPost = (): [(post: TextilePost[]) => void, {
    error: Error | null;
    loading: boolean;
}] => {
	const { thread, client } = useTextile();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const editPost = useCallback((post: TextilePost[]) => {
		if (!client){
			return;
		}

		setLoading(true);
		setError(null);

		client.save(thread, textileCollection.POST, post)
			.catch(error => setError(error))
			.finally(() => setLoading(false));
	},[client, thread]);

	return [
		editPost,
		{
			error,
			loading
		}
	];
};