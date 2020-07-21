// Copyright 2019-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Client } from '@textile/hub';
import { Libp2pCryptoIdentity } from '@textile/threads-core';

import LibP2PIdentity from '../../model/LibP2PIdentity';
import RefreshToken from '../../model/RefreshToken';
import { getApiSig } from '../../textileHandlers/getApiSig';
import { getClientWithKeyInfo } from '../../textileHandlers/getClientWithKeyInfo';
import { Context, TextileAuthInfo } from '../../types';

export default async (_: void, __: void, ctx: Context): Promise<TextileAuthInfo> => {
	// const refreshToken = ctx.req.cookies.refresh_token;

	// if (!refreshToken) {
	// 	throw new Error('Refresh token not found');
	// }

	// const refreshTokenModel = await RefreshToken
	// 	.query()
	// 	.where('token', refreshToken)
	// 	.first();

	// const userId = refreshTokenModel?.user_id;
	// CHANGE ME JUST FOR TESTING
	const userId = 1;

	if (!userId) {
		throw new Error('No user id found for this refresh token');
	}

	const LibP2PIdentityModel = await LibP2PIdentity
		.query()
		.where('user_id', userId)
		.first();

	let identityToUse = LibP2PIdentityModel?.libp2p_identity;
	if (!identityToUse) {
		// this user doesn't have any libp2p identity yet
		// let's create one for them
		identityToUse = (await Client.randomIdentity()).toString();

		await LibP2PIdentity
			.query()
			.allowInsert('[user_id, libp2p_identity]')
			.insert({
				libp2p_identity: identityToUse,
				user_id: userId
			});
	}

	const apiSig = await getApiSig();
	const client = await getClientWithKeyInfo();
	const libp2pId = await Libp2pCryptoIdentity.fromString(identityToUse);
	const token = await client.getToken(libp2pId);

	// the client side will call
	// const user = await Libp2pCryptoIdentity.fromString(identityToUse);
	// a new token needs to be created on the hub (otherwise it throws)
	// ? ----> But this token is never used
	// const textileAuthInfo = await client.getToken(user);
	// const client = Client.withUserAuth({ key, msg: apiSig.msg, sig: apiSig.sig, token });

	return { key: process.env.TEXTILE_HUB_KEY || '', libp2pIdentity: identityToUse, msg: apiSig.msg, sig: apiSig.sig, token };
};
