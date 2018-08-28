import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { INotificationState, INotificationProps, INotificationInnerState, INotificationGroupSuggestion } from './INotification';
import { INotificationGroup } from '../../models/INotificationGroup';
import IWaitableComponent from '../../models/IWaitableComponent';
import FormInput from '../FormInput/FormInput';
import FormSelect from '../FormSelect/FormSelect';
import ApplicationLoader from '../ApplicationLoader/ApplicationLoader';
import { WithContext as ReactTags } from 'react-tag-input';
import './Notification.css';
import FailableException from '../../models/Failable';
import { NavLink } from 'react-router-dom';
const KeyCodes = {
    comma: 188,
    enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

export class Notification extends React.Component<RouteComponentProps<INotificationProps>, INotificationState> {

    constructor(props: RouteComponentProps<INotificationProps>) {
        super(props);
        this.state = {
            id: props.match.params.id != null ? props.match.params.id : null,
            isFetchingStartingData: props.match.params.id != null ? true : false,
            isRunning: false,
            groupSuggestions: new Array<INotificationGroupSuggestion>(),
            notification: {
                id: props.match.params.id != null ? props.match.params.id : null,
                groupsId: new Array<INotificationGroupSuggestion>(),
                hasLink: false,
                notificationImage: "",
                notificationName: "",
                notificationLink: "",
                notificationText: "",
                notificationTitle: "",
                notificationLinkIcon: "",
                notificationIcon: "",
                notificationLinkTitle: ""
            }
        };
    }

    handleTagDelete(i: number) {
        const { groupsId } = this.state.notification;
        this.setState(state => {
            state.notification.groupsId = groupsId.filter((tag, index) => index !== i)
            return state;
        });
    }

    handleTagAddition(tag: INotificationGroupSuggestion) {
        this.setState(state => {
            state.notification.groupsId = [...state.notification.groupsId, tag]
            return state;
        });
    }

    handleTagDrag(tag: INotificationGroupSuggestion, currPos: number, newPos: number) {
        const tags = [...this.state.notification.groupsId];
        const newTags = tags.slice();

        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);

        // re-render
        this.setState(state => {
            state.notification.groupsId = newTags;
            return state;
        });
    }

    componentDidMount() {
        this._loadAllGroups().then(result => {
            for (let element of result) {
                this.setState(state => {
                    state.groupSuggestions.push({ id: String(element.key), text: element.value });
                    return state;
                })
            }
        });

        if (this.state.id != null) {
            fetch("/api/Notifications/" + this.state.id, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                method: "GET"
            }).then(response => {
                if (response.ok) return response.json() as Promise<INotificationInnerState>;
                throw new FailableException(null);
                }).then(notification => {
                    var notificationDetails = { ... this.state.notification };
                    Object.keys(notificationDetails).forEach(p => {
                        var key = p as keyof INotificationInnerState;
                        notificationDetails[key] = notification[key];
                    });
                this.setState({
                    isRunning: false,
                    isFetchingStartingData: false,
                    notification: notificationDetails
                });
            }).catch(fail => {
                this.setState({ hasFailedRequest: true });
            });
        }
    }

    async  _loadAllGroups(): Promise<Array<FormSelectOption>> {
        var s = fetch("/api/NotificationGroups", {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            method: "GET"
        }).then(response => response.json() as Promise<Array<INotificationGroup>>).then(groups => {
            var options = new Array<FormSelectOption>();
            for (let group of groups) {
                options.push({ key: group.id as number, value: group.groupName });
            }
            return options;
        });
        return await s;
    }

    getComponentTitle(): string {
        if (this.state.id != undefined) {
            return "Modifica notifica";
        } else {
            return "Inserisci notifica";
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
        this.setState({ isRunning: true, hasDisplayableErrors: false });
        fetch(this.state.id == null ? "/api/Notifications/" : "/api/Notifications/" + this.state.id, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            method: this.state.id == null ? "POST" : "PUT",
            body: JSON.stringify(this.state.notification)
        }).then(response => {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") != -1) {
                if (response.ok) { return response.json() }
                else {
                    this.setState({ hasDisplayableErrors: true });
                    return response.json();
                }
            } else { return this.state; } //non mi piace...
        }).then(notification => {
            this.setState({ isRunning: false });
            if (this.state.hasDisplayableErrors == false) {
                if (this.state.id == undefined) {
                    this.props.history.push("/notifications/edit/" + notification.id);
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

    public hasLinkChanged(event: React.ChangeEvent<HTMLInputElement>) {
        var targetChecked = event.target.checked;
        this.setState(state => { state.notification.hasLink = targetChecked; return state; });
    }

    public handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        var targetValue = e.target.value;
        var targetKey = e.target.id;
        var oState = Object.keys(this.state.notification).filter(x => x == targetKey)[0] as keyof INotificationInnerState;
        this.setState(state => {
            state.notification[oState] = targetValue;
            return state;
        });
    }

    public render() {
        return <div>
            <h1>{this.getComponentTitle()}</h1>
            <ApplicationLoader hasDisplayableErrors={this.state.hasDisplayableErrors} hasFailedRequest={this.state.hasFailedRequest} isFetchingStartingData={this.state.isFetchingStartingData} isRunning={this.state.isFetchingStartingData}>
                <form onSubmit={(e) => this.handleSubmit(e)}>
                    <div className="form-group">
                        <ReactTags tags={this.state.notification.groupsId}
                            suggestions={this.state.groupSuggestions}
                            handleDelete={x => this.handleTagDelete(x)}
                            handleAddition={x => this.handleTagAddition(x)}
                            handleDrag={(x, y, z) => this.handleTagDrag(x, y, z)}
                            delimiters={delimiters} placeholder="Aggiungi gruppi" />
                    </div>
                    <FormInput error={this.getErrorFor("NotificationName")} changeHandler={(e) => this.handleChange(e)} htmlTagFor="notificationName" placeholder="Nome della notifica" initialValue={this.state.notification.notificationName} label="Nome della notifica" />
                    <FormInput error={this.getErrorFor("NotificationTitle")} changeHandler={(e) => this.handleChange(e)} htmlTagFor="notificationTitle" placeholder="Titolo della notifica" initialValue={this.state.notification.notificationTitle} label="Titolo della notifica" />
                    <FormInput error={this.getErrorFor("NotificationIcon")} changeHandler={(e) => this.handleChange(e)} htmlTagFor="notificationIcon" placeholder="Icona della notifica (256x256)" initialValue={this.state.notification.notificationIcon} label="Icona della notifica (256x256)" />
                    <FormInput error={this.getErrorFor("NotificationImage")} changeHandler={(e) => this.handleChange(e)} htmlTagFor="notificationImage" placeholder="Immagine per la notifica (1350x... in 16:9)" initialValue={this.state.notification.notificationImage} label="Immagine per la notifica (1350x... in 16:9)" />
                    <FormInput isLong={true} error={this.getErrorFor("NotificationText")} changeHandler={(e) => this.handleChange(e)} htmlTagFor="notificationText" placeholder="Testo notifica" initialValue={this.state.notification.notificationText} label="Testo notifica" />
                    <div className="form-group form-check">
                        <input type="checkbox" className="form-check-input" id="has-link" onChange={(e) => this.hasLinkChanged(e)} />
                        <label className="form-check-label" htmlFor="has-link">Utilizzare link?</label>
                    </div>
                    {this.state.notification.hasLink && (<div>
                        <FormInput error={null} changeHandler={(e) => this.handleChange(e)} htmlTagFor="notificationLink" placeholder="" initialValue={this.state.notification.notificationLink} label="Link" />
                        <FormInput error={null} changeHandler={(e) => this.handleChange(e)} htmlTagFor="notificationLinkTitle" placeholder="" initialValue={this.state.notification.notificationLinkTitle} label="Testo link" />
                        <FormInput error={null} changeHandler={(e) => this.handleChange(e)} htmlTagFor="notificationLinkIcon" placeholder="" initialValue={this.state.notification.notificationLinkIcon} label="Icona link" />
                    </div>)}
                    <button type="submit" className={this.getFormClasses()} disabled={this.isDisabled()}>
                        <span className="glyphicon glyphicon-repeat slow-right-spinner"></span>
                        Salva</button>
                    {this.state.hasSavedModify && <mark>modifiche salvate correttamente</mark>}
                </form>
            </ApplicationLoader>
        </div>;
    }
}