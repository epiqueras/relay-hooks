import { GraphQLTaggedNode, OperationType, OperationDescriptor, Variables } from 'relay-runtime';
import { RenderProps, QueryOptions } from './RelayHooksType';
export declare function useDeepCompare<T>(value: T): T;
export declare function useMemoOperationDescriptor(gqlQuery: GraphQLTaggedNode, variables: Variables): OperationDescriptor;
export declare const useQuery: <TOperationType extends OperationType = OperationType>(gqlQuery: GraphQLTaggedNode, variables?: TOperationType["variables"], options?: QueryOptions) => RenderProps<TOperationType>;
