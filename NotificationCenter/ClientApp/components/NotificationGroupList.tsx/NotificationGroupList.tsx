import * as React from "react";
import IWaitableComponent from "../../models/IWaitableComponent";
import { NavLink, RouteComponentProps } from "react-router-dom";
import { INotificationGroupDTO } from "../../models/INotificationGroup";
import { DeletingStatus } from "../Notification/INotification";

interface INotificationGroupListState extends IWaitableComponent {
    elements: INotificationGroupDTO[]
}
export default class NotificationList extends React.Component<RouteComponentProps<{}>, INotificationGroupListState> {
    public constructor() {
        super({} as RouteComponentProps<{}>);
        this.state = {
            isFetchingStartingData: true,
            isRunning: false,
            elements: new Array<INotificationGroupDTO>()
        }
    }

    componentDidMount() {
        if (this.state.isFetchingStartingData == true) {
            fetch("/api/NotificationGroups/", {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                method: "GET"
            }).then(result => result.json() as Promise<INotificationGroupDTO[]>)
                .then(notifications => {
                    this.setState({ elements: notifications, isRunning: false, isFetchingStartingData: false })
                }).catch(err => {
                    this.setState({ hasFailedRequest: true, isRunning: false, isFetchingStartingData: false });
                });
        }
    }

    delete(element: INotificationGroupDTO) {
        if (element.deletingStatus != DeletingStatus.Deleting) {
            this.setState(state => {
                state.elements.filter(x => x == element)[0].deletingStatus = DeletingStatus.Deleting;
                return state;
            });
            fetch("/api/NotificationGroups/" + element.id, {
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
            <h1>Gruppi generati</h1>
            <NavLink to='/groups/add' className="btn btn-primary">Aggiungi nuovo</NavLink>
            <table className="table table-hover">
                <caption>Elenco gruppi</caption>
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Nome</th>
                        <th scope="col">Data</th>
                        <th scope="col">Device</th>
                        <th scope="col">Notifiche</th>
                        <th scope="col">Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.isFetchingStartingData && <tr><td colSpan={6} style={{ textAlign: "center" }}><span className="glyphicon glyphicon-repeat slow-right-spinner"></span></td></tr>}
                    {(!this.state.isFetchingStartingData && this.state.elements.length == 0) && <tr><td colSpan={6} style={{ textAlign: "center" }}>qui non c'è niente</td></tr>}
                    {this.state.elements.map(element => <tr key={'h' + String(element.id)}>
                        <td scope="col">{element.id as number}</td>
                        <td>{element.groupName}</td>
                        <td>{(element.setupAt as Date)}</td>
                        <td><span className="badge badge-primary">{element.deviceCount}</span></td>
                        <td><span className="badge badge-primary">{element.notificationCount}</span></td>
                        <td>
                            <NavLink to={'/groups/edit/' + element.id}>modifica</NavLink> - <a onClick={x => this.delete(element)}>elimina</a>
                        </td>
                    </tr>)}
                </tbody>
            </table>
        </div>;
    }
}