// Copyright 2019-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApolloServer } from 'apollo-server-express';
import bodyParser from 'body-parser';
import chalk from 'chalk';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import expressValidator from 'express-validator';

import resolvers from './resolvers';
import routes from './routes';
import schema from './schema';
import { setupNewDB } from './textileHandlers/setupNewDB';
import { Context } from './types';
import verifyEnvVariables from './utils/verifyEnvVariables';

dotenv.config();

if (process.env.NODE_ENV === 'test') {
	if (!process.env.JWT_PRIVATE_KEY_TEST) {
		throw new Error('JWT_PRIVATE_KEY_TEST private key required');
	}

	if (!process.env.JWT_PUBLIC_KEY_TEST) {
		throw new Error('JWT_PUBLIC_KEY_TEST public key required');
	}

	if (!process.env.JWT_KEY_PASSPHRASE_TEST) {
		throw new Error('JWT_KEY_PASSPHRASE_TEST private key passphrase required');
	}
} else {
	if (!process.env.JWT_PRIVATE_KEY) {
		throw new Error('JWT_PRIVATE_KEY private key required');
	}

	if (!process.env.JWT_PUBLIC_KEY) {
		throw new Error('JWT_PUBLIC_KEY public key required');
	}

	if (!process.env.JWT_KEY_PASSPHRASE) {
		throw new Error('JWT_KEY_PASSPHRASE private key passphrase required');
	}

	if (!process.env.TEXTILE_HUB_KEY || !process.env.TEXTILE_HUB_SECRET) {
		throw new Error('TEXTILE_HUB_KEY and TEXTILE_HUB_SECRET need to be set as env variable');
	}

	if (!process.env.TEXTILE_THREAD_NAME) {
		throw new Error('TEXTILE_THREAD_NAME needs to be set as env variable');
	}

	if (!process.env.TEXTILE_THREAD_ID && process.env.TEXTILE_THREAD_NAME) {
		console.log(chalk.red('TEXTILE_THREAD_ID not set, a new DB will be created...'));
		// This exits after we created the thread (DB) and the collections
		// the newly created threadId is prnted to the console and should be used as env variable
		setupNewDB(process.env.TEXTILE_THREAD_NAME);
	}
}

/**
 * Controllers (route handlers).
 */

/**
 * Create Express server.
 */
const app = express();
const server = new ApolloServer({
	context: ({ req, res }): Context => ({ req, res }),
	resolvers,
	typeDefs: schema
});

/**
 * Express configuration.
 */
app.use(cors());
app.set('host', '0.0.0.0');
app.set('port', process.env.PORT || 8080);
app.set('json spaces', 2); // number of spaces for indentation
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());

server.applyMiddleware({ app, path: '/auth/graphql' });

app.use(routes);

verifyEnvVariables();

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
	console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
	console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
