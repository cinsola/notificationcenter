import * as React from "react";
import IWaitableComponent from "../../models/IWaitableComponent";
import { RouteComponentProps, NavLink } from "react-router-dom";
import { ISubscriberDTO } from "../../models/ISubscriber";

interface IDeviceListState extends IWaitableComponent {
    elements: ISubscriberDTO[]
}
export default class DeviceList extends React.Component<RouteComponentProps<{}>, IDeviceListState> {
    public constructor() {
        super({} as RouteComponentProps<{}>);
        this.state = {
            isFetchingStartingData: true,
            isRunning: false,
            elements: new Array<ISubscriberDTO>(),
        }
    }

    componentDidMount() {
        if (this.state.isFetchingStartingData == true) {
            fetch("/api/Subscriptors/", {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                method: "GET"
            }).then(result => result.json() as Promise<ISubscriberDTO[]>)
                .then(notifications => {
                    this.setState({ elements: notifications, isRunning: false, isFetchingStartingData: false })
                }).catch(err => {
                    this.setState({ hasFailedRequest: true, isRunning: false, isFetchingStartingData: false });
                });
        }
    }

    public render() {
        return <div>
            <h1>Device collegati</h1>
            <table className="table table-hover">
                <caption>Elenco device</caption>
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Proprietà</th>
                        <th scope="col">Data</th>
                        <th scope="col">Scadenza</th>
                        <th scope="col">Liste</th>
                        <th scope="col">Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.isFetchingStartingData && <tr><td colSpan={6} style={{ textAlign: "center" }}><span className="glyphicon glyphicon-repeat slow-right-spinner"></span></td></tr>}
                    {(!this.state.isFetchingStartingData && this.state.elements.length == 0) && <tr><td colSpan={6} style={{ textAlign: "center" }}>qui non c'è niente</td></tr>}
                    {this.state.elements.map(element => <tr key={'h' + String(element.id)}>
                        <td scope="col">{String(element.id)}</td>
                        <td>{element.description == null ? <span className="text-muted">mancante</span> : element.description}</td>
                        <td>{(element.setupAt as Date)}</td>
                        <td>{(element.expirationTime as Date) == null ? <span>nessuna</span> : <span>{element.expirationTime as Date}</span>}</td>
                        <td>{element.groupsId.length > 0 ?
                            element.groupsId.map(e => <span key={e.id} style={{ marginRight: "5px" }} className="badge badge-default"> {e.text}</span>)
                            : <span className="text-muted">mancante</span>}</td>
                        <td>
                            <NavLink to={'/device/edit/' + element.id}>assegna a liste</NavLink>
                        </td>
                    </tr>)}
                </tbody>
            </table>
        </div>;
    }
}