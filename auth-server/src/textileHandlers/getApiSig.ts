// Copyright 2019-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { APISig, createAPISig } from '@textile/hub';

const secret = process.env.TEXTILE_HUB_SECRET || '';

export const getApiSig = async (): Promise<APISig> => {
	// for our front-end user to be able to create a token
	// CHANGE ME 1h IS FOR TEST
	const secondsExpiration = 3600;
	const expiration = new Date(Date.now() + 1000 * secondsExpiration);
	const apiSig = await createAPISig(secret, expiration);

	return apiSig;
};
