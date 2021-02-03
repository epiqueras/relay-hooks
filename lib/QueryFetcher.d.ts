import { Disposable, IEnvironment, Snapshot, OperationType, OperationDescriptor, Observer } from 'relay-runtime';
import { FetchPolicy, RenderProps, QueryOptions } from './RelayHooksType';
export declare function getOrCreateQueryFetcher<TOperationType extends OperationType>(query: OperationDescriptor | null, forceUpdate: any): QueryFetcher<TOperationType>;
export declare class QueryFetcher<TOperationType extends OperationType = OperationType> {
    environment: IEnvironment;
    query: OperationDescriptor;
    networkSubscription: Disposable;
    rootSubscription: Disposable;
    error: Error | null;
    snapshot: Snapshot;
    fetchPolicy: FetchPolicy;
    fetchKey: string | number;
    disposableRetain: Disposable;
    forceUpdate: (_o: any) => void;
    suspense: boolean;
    useLazy: boolean;
    releaseQueryTimeout: any;
    constructor(suspense?: boolean, useLazy?: boolean);
    setForceUpdate(forceUpdate: any): void;
    dispose(): void;
    disposeRetain(): void;
    clearTemporaryRetain(): void;
    temporaryRetain(): void;
    isDiffEnvQuery(environment: IEnvironment, query: any): boolean;
    lookupInStore(environment: IEnvironment, operation: any, fetchPolicy: FetchPolicy): Snapshot;
    execute(environment: IEnvironment, query: OperationDescriptor, options: QueryOptions, retain?: (environment: any, query: any) => Disposable): RenderProps<TOperationType>;
    subscribe(snapshot: any): void;
    fetch(networkCacheConfig: any, suspense: boolean, observer?: Observer<Snapshot>): void;
    disposeRequest(): void;
    _onQueryDataAvailable({ notifyFirstResult, suspense, observer, }: {
        notifyFirstResult: boolean;
        suspense: boolean;
        observer: Observer<Snapshot>;
    }): void;
}
