import IWaitableComponent from "../../models/IWaitableComponent";
import * as React from "react";
export default class ApplicationLoader extends React.Component<IWaitableComponent> {
    constructor(props: IWaitableComponent) {
        super(props);
    }

    render() {
        const style = { width: "100%" };
        if (this.props.hasFailedRequest == true) {
            return <div className="alert alert-danger" role="alert">
                <strong>Ops</strong> Qualcosa è andato storto. Prova a ricaricare la pagina</div>;
        }

        if (this.props.isFetchingStartingData == true) {
            return <div className="progress">
                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={style}></div>
            </div>
        }

        return <div>
            {this.props.hasDisplayableErrors &&
                <div className="alert alert-warning" role="alert">
                    <strong>Attenzione!</strong> Controlla meglio il form e prova a reinviarlo: sono presenti degli errori.
                </div>}
                <div>{this.props.children}</div>
            </div>;
    }
}