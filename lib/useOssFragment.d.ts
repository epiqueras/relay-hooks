import { GraphQLTaggedNode } from 'relay-runtime';
import { FragmentResolver } from './FragmentResolver';
import { KeyType, KeyReturnType, $Call, ArrayKeyType, ArrayKeyReturnType } from './RelayHooksType';
export declare function useOssFragment<TKey extends KeyType>(fragmentNode: GraphQLTaggedNode, fragmentRef: TKey): [$Call<KeyReturnType<TKey>>, FragmentResolver];
export declare function useOssFragment<TKey extends KeyType>(fragmentNode: GraphQLTaggedNode, fragmentRef: TKey | null): [$Call<KeyReturnType<TKey>> | null, FragmentResolver];
export declare function useOssFragment<TKey extends ArrayKeyType>(fragmentNode: GraphQLTaggedNode, fragmentRef: TKey): [ReadonlyArray<$Call<ArrayKeyReturnType<TKey>>>, FragmentResolver];
