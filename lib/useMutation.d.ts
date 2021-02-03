import * as React from 'react';
import { Environment, MutationParameters } from 'relay-runtime';
import { MutationNode, MutationConfig, MutationState, Mutate, MutationProps } from './RelayHooksType';
export declare function useMutation<T extends MutationParameters>(mutation: MutationNode<T>, userConfig?: MutationConfig<T>, 
/** if not provided, the context environment will be used. */
environment?: Environment): [Mutate<T>, MutationState<T>];
export declare function Mutation<T extends MutationParameters>({ children, mutation, environment, ...config }: MutationProps<T>): React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)>) | (new (props: any) => React.Component<any, any, any>)>;
