import type { SetStateAction } from 'react';
import { useCallback } from 'react';

import { DEBTOR_REGISTRY_LAYOUT_MOCK_RESPONSE } from '@/constants/debtor-registry-layout-mock';

import { DebtorRegistryScreenInner } from './debtor-registry-screen-inner';

type Props = { displayName: string };

export function DebtorRegistryScreenMock({ displayName }: Props) {
  const data = DEBTOR_REGISTRY_LAYOUT_MOCK_RESPONSE;
  const noopSetPage = useCallback((_v: SetStateAction<number>) => {}, []);
  return (
    <DebtorRegistryScreenInner
      displayName={displayName}
      items={data.data}
      loading={false}
      empty={data.data.length === 0}
      pageInfo={data.page}
      page={0}
      setPage={noopSetPage}
    />
  );
}
