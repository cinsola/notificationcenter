import { RouteComponentProps } from "react-router";
import * as React from "react";

export interface WithLoadingProps {
    loading: boolean;
}
export const withLoading = <P extends object>(Component: React.ComponentType<P>) =>
    class WithLoading extends React.Component<P & WithLoadingProps> {
        constructor(props: P & WithLoadingProps) {
            super(props);
        }

        render() {
            const { loading, ...p } = this.props as WithLoadingProps;
            return loading ? <div>carico</div> : <Component {...p} />
        }
    };