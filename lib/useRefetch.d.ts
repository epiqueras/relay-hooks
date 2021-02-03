import { GraphQLTaggedNode, OperationType } from 'relay-runtime';
import { RefetchFunction, KeyType, KeyReturnType, $Call, ArrayKeyType, ArrayKeyReturnType } from './RelayHooksType';
export declare function useRefetch<TKey extends KeyType, TOperationType extends OperationType = OperationType>(fragmentNode: GraphQLTaggedNode, fragmentRef: TKey): [$Call<KeyReturnType<TKey>>, RefetchFunction<TOperationType['variables']>];
export declare function useRefetch<TKey extends KeyType, TOperationType extends OperationType = OperationType>(fragmentNode: GraphQLTaggedNode, fragmentRef: TKey | null): [$Call<KeyReturnType<TKey>> | null, RefetchFunction<TOperationType['variables']>];
export declare function useRefetch<TKey extends ArrayKeyType, TOperationType extends OperationType = OperationType>(fragmentNode: GraphQLTaggedNode, fragmentRef: TKey): [ReadonlyArray<$Call<ArrayKeyReturnType<TKey>>>, RefetchFunction<TOperationType['variables']>];
