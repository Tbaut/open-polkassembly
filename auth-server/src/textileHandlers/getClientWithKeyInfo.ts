// Copyright 2019-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Client, KeyInfo } from '@textile/hub';

const key = process.env.TEXTILE_HUB_KEY || '';
const secret = process.env.TEXTILE_HUB_SECRET || '';

export async function getClientWithKeyInfo (): Promise<Client> {
	const keyInfo: KeyInfo = {
		key,
		secret
	};

	const client = await Client.withKeyInfo(keyInfo);
	return client;
}
