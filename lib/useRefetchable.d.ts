import { GraphQLTaggedNode, OperationType } from 'relay-runtime';
import { RefetchableFunction, KeyType, KeyReturnType, $Call, ArrayKeyType, ArrayKeyReturnType } from './RelayHooksType';
export declare function useRefetchable<TKey extends KeyType, TOperationType extends OperationType = OperationType>(fragmentInput: GraphQLTaggedNode, fragmentRef: TKey): [$Call<KeyReturnType<TKey>>, RefetchableFunction<TOperationType['variables']>];
export declare function useRefetchable<TKey extends KeyType, TOperationType extends OperationType = OperationType>(fragmentInput: GraphQLTaggedNode, fragmentRef: TKey | null): [$Call<KeyReturnType<TKey>> | null, RefetchableFunction<TOperationType['variables']>];
export declare function useRefetchable<TKey extends ArrayKeyType, TOperationType extends OperationType = OperationType>(fragmentInput: GraphQLTaggedNode, fragmentRef: TKey): [ReadonlyArray<$Call<ArrayKeyReturnType<TKey>>>, RefetchableFunction<TOperationType['variables']>];
