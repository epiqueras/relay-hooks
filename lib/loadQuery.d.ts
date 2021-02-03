import { OperationType, IEnvironment, OperationDescriptor, Disposable } from 'relay-runtime';
import { QueryFetcher } from './QueryFetcher';
import { RenderProps, QueryOptions, LoadQuery } from './RelayHooksType';
export declare const internalLoadQuery: <TOperationType extends OperationType = OperationType>(promise?: boolean, queryExecute?: (queryFetcher: QueryFetcher<TOperationType>, environment: IEnvironment, query: OperationDescriptor, options: QueryOptions, retain?: (environment: any, query: any) => Disposable) => RenderProps<TOperationType>) => LoadQuery<TOperationType, IEnvironment>;
export declare const loadLazyQuery: <TOperationType extends OperationType = OperationType>() => LoadQuery<TOperationType, IEnvironment>;
export declare const loadQuery: <TOperationType extends OperationType = OperationType>() => LoadQuery<TOperationType, IEnvironment>;
