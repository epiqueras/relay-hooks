import { GraphQLTaggedNode, OperationType } from 'relay-runtime';
import {
    KeyType,
    KeyTypeData,
    REFETCHABLE_NAME,
    ReturnTypeRefetchNode,
    ReturnTypeRefetchSuspenseNode,
} from './RelayHooksTypes';
import { useOssFragment } from './useOssFragment';

export function useRefetchable<TQuery extends OperationType, TKey extends KeyType>(
    fragmentInput: GraphQLTaggedNode,
    fragmentRef: TKey,
): // tslint:disable-next-line no-unnecessary-generics
ReturnTypeRefetchNode<TQuery, TKey, KeyTypeData<TKey>>;
export function useRefetchable<TQuery extends OperationType, TKey extends KeyType>(
    fragmentInput: GraphQLTaggedNode,
    fragmentRef: TKey | null,
): // tslint:disable-next-line no-unnecessary-generics
ReturnTypeRefetchNode<TQuery, TKey, KeyTypeData<TKey> | null> {
    const [data] = useOssFragment(fragmentInput, fragmentRef, false, REFETCHABLE_NAME);
    return data;
}

export function useRefetchableFragment<TQuery extends OperationType, TKey extends KeyType>(
    fragmentInput: GraphQLTaggedNode,
    fragmentRef: TKey,
): // tslint:disable-next-line no-unnecessary-generics
ReturnTypeRefetchSuspenseNode<TQuery, TKey, KeyTypeData<TKey>>;
export function useRefetchableFragment<TQuery extends OperationType, TKey extends KeyType>(
    fragmentInput: GraphQLTaggedNode,
    fragmentRef: TKey | null,
): // tslint:disable-next-line no-unnecessary-generics
ReturnTypeRefetchSuspenseNode<TQuery, TKey, KeyTypeData<TKey> | null> {
    const [data] = useOssFragment(fragmentInput, fragmentRef, true, REFETCHABLE_NAME);
    return data;
}
