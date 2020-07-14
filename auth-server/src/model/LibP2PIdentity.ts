// Copyright 2019-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Model } from 'objection';

import { JsonSchema } from '../types';
import connection from './connection';

Model.knex(connection);

export default class Address extends Model {
	readonly id!: number
	user_id!: number
	libp2p_identity!: string

	static get tableName (): string {
		return 'libp2pidentity';
	}

	static get jsonSchema (): JsonSchema {
		return {
			properties: {
				libp2p_identity: { type: 'string' },
				user_id: { type: 'integer' }
			},
			required: ['libp2p_identity', 'user_id'],
			type: 'object'
		};
	}
}

