import { GraphQLSubscriptionConfig, OperationType } from 'relay-runtime';
export declare function useSubscription<TSubscriptionPayload extends OperationType = OperationType>(config: GraphQLSubscriptionConfig<TSubscriptionPayload>): void;
