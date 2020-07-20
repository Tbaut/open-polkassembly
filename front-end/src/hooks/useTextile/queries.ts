// Copyright 2019-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import gql from 'graphql-tag';

export const TextileAuthInfo = gql`
    query TextileAuthInfo {
        textileAuthInfo {
            key
            libp2pIdentity
            msg
            sig
            token
        }
    }
`;