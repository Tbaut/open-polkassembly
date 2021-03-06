// Copyright 2019-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { useParams } from 'react-router-dom';
import useRedirectGovernancePost from 'src/hooks/useRedirectGovernancePost';

import Post from '../../components/Post/Post';
import { useProposalPostAndCommentsQuery } from '../../generated/graphql';
import FilteredError from '../../ui-components/FilteredError';
import Loader from '../../ui-components/Loader';

export default () => {
	const { id } = useParams();
	const idNumber = Number(id) || 0;
	const { data, error, refetch } = useProposalPostAndCommentsQuery({ variables: { 'id': idNumber } });

	useRedirectGovernancePost({ from: 'proposal', onchainLink: data?.posts?.[0]?.onchain_link });

	if (error?.message) return <FilteredError text={error.message}/>;

	if (data) return <Post data={data} isProposal refetch={refetch} />;

	return <Loader/>;
};
