import { GraphQLTaggedNode } from 'relay-runtime';
import { KeyType, KeyReturnType, $Call, ArrayKeyType, ArrayKeyReturnType } from './RelayHooksType';
export declare function useFragment<TKey extends KeyType>(fragmentNode: GraphQLTaggedNode, fragmentRef: TKey): $Call<KeyReturnType<TKey>>;
export declare function useFragment<TKey extends KeyType>(fragmentNode: GraphQLTaggedNode, fragmentRef: TKey | null): $Call<KeyReturnType<TKey>> | null;
export declare function useFragment<TKey extends ArrayKeyType>(fragmentNode: GraphQLTaggedNode, fragmentRef: TKey): ReadonlyArray<$Call<ArrayKeyReturnType<TKey>>>;
