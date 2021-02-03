/// <reference types="react" />
import { Disposable, OperationType, CacheConfig, GraphQLTaggedNode, Environment, IEnvironment, Variables, PageInfo, Observer, MutationConfig as BaseMutationConfig, MutationParameters } from 'relay-runtime';
import { RelayContext, FragmentSpecResolver, Snapshot } from 'relay-runtime/lib/store/RelayStoreTypes';
export declare type MutationState<T extends MutationParameters> = {
    loading: boolean;
    data: T['response'] | null;
    error?: Error | null;
};
export declare type MutationNode<T extends MutationParameters> = BaseMutationConfig<T>['mutation'];
export declare type MutationConfig<T extends MutationParameters> = Partial<Omit<BaseMutationConfig<T>, 'mutation' | 'onCompleted'>> & {
    onCompleted?(response: T['response']): void;
};
export declare type Mutate<T extends MutationParameters> = (config?: Partial<MutationConfig<T>>) => Promise<T['response']>;
export declare type MutationProps<T extends MutationParameters> = MutationConfig<T> & {
    children: (mutate: Mutate<T>, state: MutationState<T>) => React.ReactNode;
    mutation: MutationNode<T>;
    /** if not provided, the context environment will be used. */
    environment?: Environment;
};
export declare const NETWORK_ONLY = "network-only";
export declare const STORE_THEN_NETWORK = "store-and-network";
export declare const STORE_OR_NETWORK = "store-or-network";
export declare const STORE_ONLY = "store-only";
export declare type FetchPolicy = typeof STORE_ONLY | typeof STORE_OR_NETWORK | typeof STORE_THEN_NETWORK | typeof NETWORK_ONLY;
export declare type ContainerResult = {
    data: {
        [key: string]: any;
    };
    resolver: FragmentSpecResolver;
};
export interface RenderProps<T extends OperationType> {
    error: Error | null;
    props: T['response'] | null | undefined;
    retry: (_cacheConfigOverride?: CacheConfig, observer?: Observer<Snapshot>) => void;
    cached?: boolean;
}
export declare type OperationContextProps = {
    operation: any;
    relay: RelayContext;
};
export declare type RefetchOptions = {
    force?: boolean;
    fetchPolicy?: FetchPolicy;
    metadata?: {
        [key: string]: any;
    };
};
export declare type QueryOptions = {
    fetchPolicy?: FetchPolicy;
    fetchKey?: string | number;
    networkCacheConfig?: CacheConfig;
    skip?: boolean;
    fetchObserver?: Observer<Snapshot>;
};
export declare type $Call<Fn extends (...args: any[]) => any> = Fn extends (arg: any) => infer RT ? RT : never;
export interface KeyType {
    readonly ' $data'?: unknown;
}
export declare type ArrayKeyType = ReadonlyArray<{
    readonly ' $data'?: ReadonlyArray<unknown>;
} | null>;
export declare type KeyReturnType<T extends KeyType> = (arg: T) => NonNullable<T[' $data']>;
export declare type ArrayKeyReturnType<T extends ArrayKeyType> = (arg: T) => NonNullable<NonNullable<T[0]>[' $data']>[0];
export declare type PaginationFunction<Props, TVariables extends Variables = Variables> = {
    loadMore: (connectionConfig: ConnectionConfig<Props>, pageSize: number, observerOrCallback?: ObserverOrCallback, options?: RefetchOptions) => Disposable;
    hasMore: (connectionConfig?: ConnectionConfig<Props>) => boolean;
    isLoading: () => boolean;
    refetchConnection: (connectionConfig: ConnectionConfig<Props>, totalCount: number, observerOrCallback?: ObserverOrCallback, refetchVariables?: TVariables) => Disposable;
};
export declare type RefetchableFunction<TVariables extends Variables = Variables> = (refetchVariables: TVariables | ((fragmentVariables: TVariables) => TVariables), options?: {
    renderVariables?: TVariables;
    observerOrCallback?: ObserverOrCallback;
    refetchOptions?: RefetchOptions;
}) => Disposable;
export declare type RefetchFunction<TVariables extends Variables = Variables> = (taggedNode: GraphQLTaggedNode, refetchVariables: TVariables | ((fragmentVariables: TVariables) => TVariables), renderVariables?: TVariables, observerOrCallback?: ObserverOrCallback, options?: RefetchOptions) => Disposable;
export declare type ObserverOrCallback = Observer<void> | ((error?: Error | null | undefined) => void);
export declare const FORWARD = "forward";
export declare type FragmentVariablesGetter = (prevVars: Variables, totalCount: number) => Variables;
export interface ConnectionConfig<Props = object> {
    direction?: 'backward' | 'forward';
    getConnectionFromProps?: (props: Props) => ConnectionData | null | undefined;
    getFragmentVariables?: (prevVars: Variables, totalCount: number) => Variables;
    getVariables: (props: Props, paginationInfo: {
        count: number;
        cursor?: string | null;
    }, fragmentVariables: Variables) => Variables;
    query: GraphQLTaggedNode;
}
export interface ConnectionData {
    edges?: ReadonlyArray<any> | null;
    pageInfo?: Partial<PageInfo> | null;
}
export declare type PaginationData = {
    direction: string;
    getConnectionFromProps: Function;
    getFragmentVariables: Function;
};
export declare type LoadQuery<TOperationType extends OperationType = OperationType, TEnvironment extends IEnvironment = IEnvironment> = {
    next: (environment: TEnvironment, gqlQuery: GraphQLTaggedNode, variables?: TOperationType['variables'], options?: QueryOptions) => Promise<void>;
    subscribe: (callback: (value: any) => any) => () => void;
    getValue: (environment?: TEnvironment) => RenderProps<TOperationType> | Promise<any>;
    dispose: () => void;
};
