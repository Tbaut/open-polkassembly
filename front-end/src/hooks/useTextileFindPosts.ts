
// Copyright 2019-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { useCallback, useState } from 'react';
import { textileCollection } from 'src/types';

import { useTextile } from './useTextile';

export const useTextileFindPosts = (): [(query: any) => void, {
    data: any;
    error: Error | null;
    loading: boolean;
}] => {
	const { thread, client } = useTextile();

	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<any | null>(null);
	const [error, setError] = useState<Error | null>(null);

	const findPosts = useCallback((query: any) => {
		if (!client){
			return;
		}

		setLoading(true);
		setData(null);
		setError(null);

		client.find(thread, textileCollection.POST, query)
			.then(response => setData(response))
			.catch(error => setError(error))
			.finally(() => setLoading(false));
	},[client, thread]);

	return [
		findPosts,
		{
			data,
			error,
			loading
		}
	];
};