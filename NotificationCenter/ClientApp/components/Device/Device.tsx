import * as React from "react";
import { RouteComponentProps } from "react-router";
import { ISubscriberEditDTO } from "../../models/ISubscriber";
import IWaitableComponent from "../../models/IWaitableComponent";
import FailableException from "../../models/Failable";
import ApplicationLoader from "../ApplicationLoader/ApplicationLoader";
import { INotificationDTO, INotificationGroupSuggestion } from "../Notification/INotification";
import { WithContext as ReactTags } from 'react-tag-input';
import FormInput from "../FormInput/FormInput";
import { withLoading } from "../ListHOC/ListHOC";
import { Component } from "react";
interface DeviceProps { id: number }
interface DeviceState extends IWaitableComponent {
    device: ISubscriberEditDTO
    groupSuggestions: Array<INotificationGroupSuggestion>
}
const KeyCodes = {
    comma: 188,
    enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];
export default class Device extends React.Component<RouteComponentProps<DeviceProps>, DeviceState> {
    constructor(props: RouteComponentProps<DeviceProps>) {
        super(props);
        this.handleTagDrag.bind(this);
        this.state = {
            isRunning: false,
            isFetchingStartingData: true,
            groupSuggestions: new Array<INotificationGroupSuggestion>(),
            device: {
                groupsId: new Array<INotificationGroupSuggestion>(),
                id: Number(props.match.params.id),
                endpoint: "",
                description: "",
                expirationTime: null,
                setupAt: null,
                tagsCount: 0,
                device: "",
                platform: "",
                platformVersion: "",
                browser: "",
                browserVersion: ""
            }
        }
    }

    componentDidMount() {
        if (this.state.isFetchingStartingData == true) {
            this.setState({ isRunning: true });
            fetch("/api/Subscriptors/" + this.state.device.id, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                method: "GET"
            }).then(response => {
                if (response.ok) return response.json() as Promise<ISubscriberEditDTO>;
                throw new FailableException(null);
            }).then(response => {
                this.setState((state, props) => ({
                    ...state,
                    isRunning: false,
                    isFetchingStartingData: false,
                    device: response
                }));
            }).catch(fail => {
                this.setState({ hasFailedRequest: true, isRunning: false, isFetchingStartingData: false });
            });
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

    getFormattedEndpoint(e: string) {
        return e.substring(0, 10) + "..." + e.substr(-10);
    }

    isDisabled(): boolean {
        return this.state.isRunning;
    }

    handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        this.setState({ isRunning: true, hasDisplayableErrors: false, hasSavedModify: false });
        fetch("/api/Subscriptors/" + this.state.device.id, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            method: "PUT",
            body: JSON.stringify(this.state.device)
        }).then(response => {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") != -1) {
                if (response.ok) { return response.json() as Promise<ISubscriberEditDTO> }
                else {
                    this.setState({ hasDisplayableErrors: true });
                    return response.json();
                }
            } else { return this.state; } //non mi piace...
        }).then(notification => {
            this.setState({ isRunning: false });
            if (this.state.hasDisplayableErrors == false) {
                this.setState({ hasSavedModify: true });
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

    handleTagDelete(i: number) {
        const { groupsId } = this.state.device;
        this.setState(state => {
            state.device.groupsId = (groupsId).filter((tag, index) => index !== i)
            return state;
        });
    }

    handleTagAddition(tag: INotificationGroupSuggestion) {
        this.setState(state => {
            state.device.groupsId = [...state.device.groupsId, tag]
            return state;
        });
    }

    handleTagDrag(tag: INotificationGroupSuggestion, currPos: number, newPos: number) {
        const tags = [...this.state.device.groupsId];
        const newTags = tags.slice();

        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);

        this.setState(state => {
            state.device.groupsId = newTags;
            return state;
        });
    }

    public handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        var targetValue = e.target.value;
        var targetKey = e.target.id;
        var oState = Object.keys(this.state.device).filter(x => x == targetKey)[0] as keyof ISubscriberEditDTO;
        this.setState(state => {
            state.device[oState] = targetValue;
            return state;
        });
    }

    render() {
        const s: React.ComponentType<FormInputProps> = FormInput;
        var Silenzio = withLoading<FormInputProps>(FormInput);

        return <div>
            <Silenzio loading={true} error={this.getErrorFor("Description")} changeHandler={(e) => this.handleChange(e)} htmlTagFor="description" placeholder="Nome identificativo" initialValue={this.state.device.description} label="Nome identificativo" />
            <h1>Gestione device</h1>
            <ApplicationLoader hasDisplayableErrors={this.state.hasDisplayableErrors} hasFailedRequest={this.state.hasFailedRequest} isFetchingStartingData={this.state.isFetchingStartingData} isRunning={this.state.isFetchingStartingData}>
                <form onSubmit={(e) => this.handleSubmit(e)}>
                    <div className="form-group">
                        <ReactTags tags={this.state.device.groupsId}
                            suggestions={this.state.groupSuggestions}
                            handleDelete={x => this.handleTagDelete(x)}
                            handleAddition={x => this.handleTagAddition(x)}
                            handleDrag={this.handleTagDrag}
                            delimiters={delimiters} placeholder="Aggiungi gruppi" />
                    </div>
                    <div className="form-group">
                        <FormInput error={this.getErrorFor("Description")} changeHandler={(e) => this.handleChange(e)} htmlTagFor="description" placeholder="Nome identificativo" initialValue={this.state.device.description} label="Nome identificativo" />
                    </div>
                    <div className="form-group">
                        <dl className="row">
                            <dt>Endpoint</dt>
                            <dd>{this.getFormattedEndpoint(this.state.device.endpoint)}</dd>
                            <dt>Device</dt>
                            <dd>{this.state.device.device}</dd>
                            <dt>Piattaforma</dt>
                            <dd>{this.state.device.platform} {this.state.device.platformVersion}</dd>
                            <dt>Browser</dt>
                            <dd>{this.state.device.browser} {this.state.device.browserVersion}</dd>
                        </dl>
                    </div>
                    <button type="submit" className={this.getFormClasses()} disabled={this.isDisabled()}>
                        <span className="glyphicon glyphicon-repeat slow-right-spinner"></span>
                        Salva</button>
                    {this.state.hasSavedModify && <mark>modifiche salvate correttamente</mark>}
                </form>
            </ApplicationLoader>
        </div>;
    }
}
