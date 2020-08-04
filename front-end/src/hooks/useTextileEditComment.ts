
// Copyright 2019-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { useCallback, useState } from 'react';
import { textileCollection } from 'src/types';

import { useTextile } from './useTextile';

export const useTextileEditComment = (): [(comment: Record<string, string>, id: string) => void, {
    error: Error | null;
    loading: boolean;
}] => {
	const { thread, client } = useTextile();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const editComment = useCallback((comment: Record<string, string>, id: string) => {
		if (!client){
			return;
		}

		setLoading(true);
		setError(null);

		client.findByID(thread, textileCollection.COMMENT, id).then((previousComment) => {
			client.save(thread, textileCollection.COMMENT, [{ ...previousComment.instance, ...comment }])
				.catch(error => setError(error))
				.finally(() => setLoading(false));
		}).catch(error => setError(error));
	},[client, thread]);

	return [
		editComment,
		{
			error,
			loading
		}
	];
};