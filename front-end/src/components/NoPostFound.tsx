// Copyright 2019-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import * as React from 'react';

interface Props{
    isMotion: boolean
    isProposal: boolean
    isReferendum: boolean
	isTreasuryProposal: boolean
	isTipProposal: boolean
}
const NoPostFound = ({ isMotion = false, isProposal = false, isReferendum = false, isTreasuryProposal = false, isTipProposal = false }: Props) => {
	const postType =  isMotion
		? 'motion'
		: isProposal
			? 'proposal'
			: isReferendum
				? 'referendum'
				: isTreasuryProposal
					? 'treasury proposal'
					: isTipProposal
						? 'Tip proposal'
						: 'post';
	return <div> Sorry, we couldn&apos;t find any {postType} with this id</div>;
};

export default NoPostFound;
