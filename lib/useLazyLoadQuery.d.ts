import { GraphQLTaggedNode, OperationType } from 'relay-runtime';
import { RenderProps, QueryOptions } from './RelayHooksType';
export declare const useLazyLoadQuery: <TOperationType extends OperationType = OperationType>(gqlQuery: GraphQLTaggedNode, variables?: TOperationType["variables"], options?: QueryOptions) => RenderProps<TOperationType>;
