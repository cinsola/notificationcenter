import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { INotificationGroupProps, INotificationGroupState } from './INotificationGroup';
import IWaitableComponent from '../../models/IWaitableComponent';
import FormInput from '../FormInput/FormInput';
import ApplicationLoader from '../ApplicationLoader/ApplicationLoader';

import { INotificationGroup } from '../../models/INotificationGroup';
import FailableException from '../../models/Failable';

export class NotificationGroup extends React.Component<RouteComponentProps<INotificationGroupProps>, INotificationGroupState> {
    constructor(props: RouteComponentProps<INotificationGroupProps>) {
        super(props);
        this.state = {
            id: props.match.params.id,
            isFetchingStartingData: props.match.params.id != null ? true : false,
            isRunning: false,
            groupName: ""
        };
    }

    componentDidMount() {
        if (this.state.id != undefined) {
            fetch("/api/NotificationGroups/" + this.state.id, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                method: "GET"
            }).then(response => {
                if (response.ok) return response.json() as Promise<INotificationGroup>;
                throw new FailableException(null);
            }).then(response => {
                this.setState({
                    isRunning: false,
                    isFetchingStartingData: false,
                    groupName: response.groupName
                }); //questo lo fa...
            }).catch(fail => {
                this.setState({ hasFailedRequest: true });
            });
        }
    }

    getComponentTitle(): string {
        if (this.state.id != undefined) {
            return "Modifica gruppo";
        } else {
            return "Inserisci gruppo";
        }
    }

    getErrorFor(name: string): string | null {
        if (this.state.errors != null && this.state.errors[name] != null)
            return (this.state.errors[name]).join(", ");
        return null;
    }

    getFormClasses(): string {
        var classes = [];
        classes.push("tree-states-btn");
        classes.push("btn");
        classes.push("btn-primary");
        if (this.state.isRunning) {
            classes.push("running");
        }
        return classes.join(" ");
    }

    isDisabled(): boolean {
        return this.state.isRunning;
    }

    handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        this.setState({ isRunning: true, hasDisplayableErrors: false, hasSavedModify: false });
        fetch(this.state.id == undefined ? "/api/NotificationGroups/" : "/api/NotificationGroups/" + this.state.id, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            method: this.state.id == undefined ? "POST" : "PUT",
            body: JSON.stringify(this.state as INotificationGroup)
        }).then(response => {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") != -1) {
                if (response.ok) { return response.json() as Promise<INotificationGroup> }
                else {
                    this.setState({ hasDisplayableErrors: true });
                    return response.json();
                }
            } else { return this.state; } //non mi piace...
        }).then(notification => {
            this.setState({ isRunning: false });
            if (this.state.hasDisplayableErrors == false) {
                if (this.state.id == undefined) {
                    this.props.history.push("/groups/edit/" + notification.id);
                } else {
                    this.setState({ hasSavedModify: true });
                }
            } else {
                throw new FailableException(notification);
            }
        }).catch(fail => {
            this.setState({ hasDisplayableErrors: true, isRunning: false });

            if (fail instanceof FailableException) {
                this.setState({ errors: fail.errors });
            }
        });
    }

    public handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        var targetValue = e.target.value;
        var targetKey = e.target.id;
        this.setState({ groupName: targetValue })
        var oState = Object.keys(this.state).filter(x => x == targetKey)[0] as keyof INotificationGroup;

        //if (oState in this.state) {
        //    this.setState(oState: targetValue );
        //}
    }

    public render() {
        return <div>
            <h1>{this.getComponentTitle()}</h1>
            <ApplicationLoader hasDisplayableErrors={this.state.hasDisplayableErrors} hasFailedRequest={this.state.hasFailedRequest} isFetchingStartingData={this.state.isFetchingStartingData} isRunning={this.state.isFetchingStartingData}>
                <form onSubmit={(e) => this.handleSubmit(e)}>
                    <FormInput error={this.getErrorFor("GroupName")} changeHandler={(e) => this.handleChange(e)} htmlTagFor="groupName" placeholder="Nome del gruppo" initialValue={this.state.groupName} label="Nome del gruppo" />
                    <button type="submit" className={this.getFormClasses()} disabled={this.isDisabled()}>
                        <span className="glyphicon glyphicon-repeat slow-right-spinner"></span>
                        Salva</button>
                    {this.state.hasSavedModify && <mark>modifiche salvate correttamente</mark>}
                </form>
            </ApplicationLoader>
        </div>;
    }
}