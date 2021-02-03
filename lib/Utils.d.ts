import { Observer, Variables, ConnectionMetadata, GraphQLTaggedNode, OperationDescriptor, SingularReaderSelector } from 'relay-runtime';
import { FetchPolicy, FragmentVariablesGetter, PaginationData, ConnectionConfig, ObserverOrCallback } from './RelayHooksType';
export declare type ReactConnectionMetadata = ConnectionMetadata & {
    fragmentName: string;
};
export declare const isNetworkPolicy: (policy: FetchPolicy, storeSnapshot: any) => boolean;
export declare const isStorePolicy: (policy: FetchPolicy) => boolean;
export declare function createOperation(gqlQuery: GraphQLTaggedNode, variables: Variables): OperationDescriptor;
export declare function findConnectionMetadata(fragment: any): ReactConnectionMetadata;
export declare function createGetConnectionFromProps(metadata: ReactConnectionMetadata): any;
export declare function createGetFragmentVariables(metadata: ReactConnectionMetadata): FragmentVariablesGetter;
export declare function toObserver(observerOrCallback: ObserverOrCallback): Observer<void>;
export declare function getPaginationData(paginationData: any, fragment: any): PaginationData;
export declare function getNewSelector(request: any, s: any, variables: any): SingularReaderSelector;
export declare function _getConnectionData({ direction, getConnectionFromProps: defaultGetConnectionFromProps }: PaginationData, props: any, connectionConfig?: ConnectionConfig): {
    cursor: string;
    edgeCount: number;
    hasMore: boolean;
};
export declare function getRootVariablesForSelector(selector: any): Variables;
