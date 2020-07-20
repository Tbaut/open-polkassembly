// Copyright 2019-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { gql } from 'apollo-server-express';

import addressLinkConfirm from './mutation/addressLinkConfirm';
import addressLinkStart from './mutation/addressLinkStart';
import addressLogin from './mutation/addressLogin';
import addressLoginStart from './mutation/addressLoginStart';
import addressSignupConfirm from './mutation/addressSignupConfirm';
import addressSignupStart from './mutation/addressSignupStart';
import addressUnlink from './mutation/addressUnlink';
import changeEmailMutation from './mutation/changeEmail';
import changeNotificationPreference from './mutation/changeNotificationPreference';
import changePasswordMutation from './mutation/changePassword';
import changeUsernameMutation from './mutation/changeUsername';
import loginMutation from './mutation/login';
import logoutMutation from './mutation/logout';
import postSubscribe from './mutation/postSubscribe';
import postUnsubscribe from './mutation/postUnsubscribe';
import reportContent from './mutation/reportContent';
import requestResetPassword from './mutation/requestResetPassword';
import resendVerifyEmailToken from './mutation/resendVerifyEmailToken';
import resetPassword from './mutation/resetPassword';
import setCredentialsConfirm from './mutation/setCredentialsConfirm';
import setCredentialsStart from './mutation/setCredentialsStart';
import setDefaultAddress from './mutation/setDefaultAddress';
import signupMutation from './mutation/signup';
import undoEmailChange from './mutation/undoEmailChange';
import verifyEmail from './mutation/verifyEmail';
import subscription from './query/subscription';
import textileAuthInfoQuery from './query/textileAuthInfo';
import tokenQuery from './query/token';
import userQuery from './query/user';
import address from './type/address';
import addressLinkType from './type/addressLinkType';
import addressLoginType from './type/addressLoginType';
import changeResponseType from './type/changeResponse';
import loginResponseType from './type/loginResponse';
import messageType from './type/message';
import notificationPreferencesType from './type/notificationPreferences';
import notificationPreferencesInput from './type/notificationPreferencesInput';
import publicUser from './type/publicUser';
import subscriptionType from './type/subscription';
import TextileAuthInfo from './type/textileAuthInfo';
import tokenType from './type/token';
import undoEmailChangeResponse from './type/undoEmailChangeResponse';
import userType from './type/user';

export default gql`
	${address}
	${addressLinkType}
	${addressLoginType}
	${changeResponseType}
	${loginResponseType}
	${messageType}
	${notificationPreferencesType}
	${notificationPreferencesInput}
	${publicUser}
	${subscriptionType}
	${TextileAuthInfo}
	${tokenType}
	${undoEmailChangeResponse}
	${userType}

	type Query {
		${subscription}
		${textileAuthInfoQuery}
		${tokenQuery}
		${userQuery}
	}

	type Mutation {
		${addressLinkConfirm}
		${addressLinkStart}
		${addressLogin}
		${addressLoginStart}
		${addressSignupConfirm}
		${addressSignupStart}
		${addressUnlink}
		${changeUsernameMutation}
		${changeEmailMutation}
		${changePasswordMutation}
		${changeNotificationPreference}
		${loginMutation}
		${logoutMutation}
		${postSubscribe}
		${postUnsubscribe}
		${reportContent}
		${requestResetPassword}
		${resendVerifyEmailToken}
		${resetPassword}
		${setCredentialsConfirm}
		${setCredentialsStart}
		${setDefaultAddress}
		${signupMutation}
		${undoEmailChange}
		${verifyEmail}
	}
`;
