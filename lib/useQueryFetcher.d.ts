import { OperationType, OperationDescriptor } from 'relay-runtime';
import { QueryFetcher } from './QueryFetcher';
export declare type Reference<TOperationType extends OperationType = OperationType> = {
    queryFetcher: QueryFetcher<TOperationType>;
};
export declare const useQueryFetcher: <TOperationType extends OperationType>(query?: OperationDescriptor) => QueryFetcher<TOperationType>;
