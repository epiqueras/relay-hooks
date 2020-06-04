import {
    Disposable,
    OperationType,
    CacheConfig,
    GraphQLTaggedNode,
    Variables,
    PageInfo,
    Observer,
} from 'relay-runtime';
import { RelayContext, FragmentSpecResolver } from 'relay-runtime/lib/store/RelayStoreTypes';

export const NETWORK_ONLY = 'network-only';
export const STORE_THEN_NETWORK = 'store-and-network';
export const STORE_OR_NETWORK = 'store-or-network';
export const STORE_ONLY = 'store-only';

export type FetchPolicy =
    | typeof STORE_ONLY
    | typeof STORE_OR_NETWORK
    | typeof STORE_THEN_NETWORK
    | typeof NETWORK_ONLY;

export type ContainerResult = {
    data: { [key: string]: any };
    resolver: FragmentSpecResolver;
};

export interface RenderProps<T extends OperationType> {
    error: Error | null;
    props: T['response'] | null | undefined;
    retry: (_cacheConfigOverride?: CacheConfig) => void;
    cached?: boolean;
}

export type OperationContextProps = {
    operation: any;
    relay: RelayContext;
};

export type RefetchOptions = {
    force?: boolean;
    fetchPolicy?: FetchPolicy;
    metadata?: { [key: string]: any };
};

export type QueryOptions = {
    fetchPolicy?: FetchPolicy;
    fetchKey?: string | number;
    networkCacheConfig?: CacheConfig;
    skip?: boolean;
};

export type $Call<Fn extends (...args: any[]) => any> = Fn extends (arg: any) => infer RT
    ? RT
    : never;

export interface KeyType {
    readonly ' $data'?: unknown;
}
export type ArrayKeyType = ReadonlyArray<{ readonly ' $data'?: ReadonlyArray<unknown> } | null>;

export type KeyReturnType<T extends KeyType> = (arg: T) => NonNullable<T[' $data']>;
export type ArrayKeyReturnType<T extends ArrayKeyType> = (
    arg: T,
) => NonNullable<NonNullable<T[0]>[' $data']>[0];

export type PaginationFunction<Props, TVariables extends Variables = Variables> = {
    loadMore: (
        connectionConfig: ConnectionConfig<Props>,
        pageSize: number,
        observerOrCallback: ObserverOrCallback,
        options: RefetchOptions,
    ) => Disposable;
    hasMore: (connectionConfig?: ConnectionConfig<Props>) => boolean;
    isLoading: () => boolean;
    refetchConnection: (
        connectionConfig: ConnectionConfig<Props>,
        totalCount: number,
        observerOrCallback: ObserverOrCallback,
        refetchVariables: TVariables,
    ) => Disposable;
};

export type RefetchableFunction<TVariables extends Variables = Variables> = (
    refetchVariables: TVariables | ((fragmentVariables: TVariables) => TVariables),
    options?: {
        renderVariables?: TVariables;
        observerOrCallback?: ObserverOrCallback;
        refetchOptions?: RefetchOptions;
    },
) => Disposable;

export type RefetchFunction<TVariables extends Variables = Variables> = (
    taggedNode: GraphQLTaggedNode,
    refetchVariables: TVariables | ((fragmentVariables: TVariables) => TVariables),
    renderVariables?: TVariables,
    observerOrCallback?: ObserverOrCallback,
    options?: RefetchOptions,
) => Disposable;

export type ObserverOrCallback = Observer<void> | ((error?: Error | null | undefined) => void);

// pagination

export const FORWARD = 'forward';

export type FragmentVariablesGetter = (prevVars: Variables, totalCount: number) => Variables;

export interface ConnectionConfig<Props = object> {
    direction?: 'backward' | 'forward';
    getConnectionFromProps?: (props: Props) => ConnectionData | null | undefined;
    getFragmentVariables?: (prevVars: Variables, totalCount: number) => Variables;
    getVariables: (
        props: Props,
        paginationInfo: { count: number; cursor?: string | null },
        fragmentVariables: Variables,
    ) => Variables;
    query: GraphQLTaggedNode;
}
export interface ConnectionData {
    edges?: ReadonlyArray<any> | null;
    pageInfo?: Partial<PageInfo> | null;
}

export type PaginationData = {
    direction: string;
    getConnectionFromProps: Function;
    getFragmentVariables: Function;
};
