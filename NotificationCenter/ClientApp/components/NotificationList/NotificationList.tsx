import * as React from "react";
import IWaitableComponent from "../../models/IWaitableComponent";
import { INotificationDTO, BroadcastStatus, DeletingStatus } from "../Notification/INotification";
import { NavLink, RouteComponentProps } from "react-router-dom";

interface INotificationListState extends IWaitableComponent {
    elements: INotificationDTO[]
}
export default class NotificationList extends React.Component<RouteComponentProps<{}>, INotificationListState> {
    public constructor() {
        super({} as RouteComponentProps<{}>);
        this.state = {
            isFetchingStartingData: true,
            isRunning: false,
            elements: new Array<INotificationDTO>()
        }
    }

    componentDidMount() {
        if (this.state.isFetchingStartingData == true) {
            fetch("/api/Notifications/", {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                method: "GET"
            }).then(result => result.json() as Promise<INotificationDTO[]>)
                .then(notifications => {
                    this.setState({ elements: notifications, isRunning: false, isFetchingStartingData: false })
                }).catch(err => {
                    this.setState({ hasFailedRequest: true, isRunning: false, isFetchingStartingData: false });
                });
        }
    }

    broadcast(element: INotificationDTO) {
        if (element.broadcastStatus != BroadcastStatus.Broadcasting) {
            this.setState(state => {
                state.elements.filter(x => x == element)[0].broadcastStatus = BroadcastStatus.Broadcasting;
                return state;
            });
            fetch("/api/Notifications/broadcast/" + element.id, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                method: "POST"
            }).then(result => {
                if (result.ok) {
                    this.setState(state => {
                        state.elements.filter(x => x == element)[0].broadcastStatus = BroadcastStatus.Ok;
                        return state;
                    });
                } else {
                    this.setState(state => {
                        state.elements.filter(x => x == element)[0].broadcastStatus = BroadcastStatus.Failed;
                        return state;
                    });
                }
            }).catch(err => {
                this.setState(state => {
                    state.elements.filter(x => x == element)[0].broadcastStatus = BroadcastStatus.Failed;
                    return state;
                });
            });
        }
    }
    delete(element: INotificationDTO) {
        if (element.deletingStatus != DeletingStatus.Deleting) {
            this.setState(state => {
                state.elements.filter(x => x == element)[0].deletingStatus = DeletingStatus.Deleting;
                return state;
            });
            fetch("/api/Notifications/" + element.id, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                method: "DELETE"
            }).then(result => {
                var i = this.state.elements.indexOf(element);
                if (result.ok) {
                    this.setState(state => {
                        state.elements.splice(i, 1);
                        return state;
                    });
                } else {
                    this.setState(state => {
                        state.elements[i].deletingStatus = DeletingStatus.Failed;
                        return state;
                    });
                }
            }).catch(err => {
                this.setState(state => {
                    state.elements.filter(x => x == element)[0].deletingStatus = DeletingStatus.Failed;
                    return state;
                });
            });
        }
    }
    public render() {
        return <div>
            <h1>Notifiche generate</h1>
            <NavLink to='/notifications/add' className="btn btn-primary">Aggiungi nuova</NavLink>
            <table className="table table-hover">
                <caption>Elenco notifiche</caption>
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Nome</th>
                        <th scope="col">Liste</th>
                        <th scope="col">Titolo</th>
                        <th scope="col">Data</th>
                        <th scope="col">Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.isFetchingStartingData && <tr><td colSpan={6} style={{ textAlign: "center" }}><span className="glyphicon glyphicon-repeat slow-right-spinner"></span></td></tr>}
                    {(!this.state.isFetchingStartingData && this.state.elements.length == 0) && <tr><td colSpan={6} style={{ textAlign: "center" }}>qui non c'è niente</td></tr>}
                    {this.state.elements.map(element => <tr key={'h' + String(element.id)}>
                        <td scope="col">{element.id as number}</td>
                        <td><NavLink to={'/notifications/edit/' + element.id}>{element.notificationName}</NavLink></td>
                            <td>{element.groupsId.map(group => <span key={'g' + group.id} className="badge badge-primary" style={{ marginRight: "3px" }}>{group.text}</span>)}</td>
                            <td>{element.notificationTitle} </td>
                            <td>{element.setupAt as Date}</td>
                            <td>
                                {element.broadcastStatus == BroadcastStatus.Broadcasting && <span style={{ marginRight: "5px" }} className="glyphicon glyphicon-repeat slow-right-spinner"></span>}
                                {element.broadcastStatus == BroadcastStatus.Failed && <span style={{ marginRight: "5px" }} className="text-danger">errore sconosciuto</span>}
                                {element.broadcastStatus == BroadcastStatus.Ok && <span style={{ marginRight: "5px" }} className="text-success">fatto</span>}
                                {element.broadcastStatus != BroadcastStatus.Broadcasting && <div><a onClick={x => this.broadcast(element)}>broadcast</a> - <a onClick={x => this.delete(element)}>elimina</a></div>}
                            </td>
                    </tr>)}
                </tbody>
            </table>
        </div>;
    }
}