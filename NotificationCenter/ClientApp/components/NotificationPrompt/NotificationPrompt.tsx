import * as React from 'react';
import NotificationPermissionPrompt from '../../models/NotificationPermission';
import IWaitableComponent from '../../models/IWaitableComponent';

enum ServiceWorkerState {
    Ok, NoServiceWorker, NoPushManager, Fail
};

interface INotificationPromptState extends IWaitableComponent {
    serviceWorkerState: ServiceWorkerState
}

export class NotificationPrompt extends React.Component<{}, INotificationPromptState> {
    constructor() {
        super({});
        this.state = {
            serviceWorkerState: ServiceWorkerState.Ok,
            isRunning: false,
            isFetchingStartingData: false
        }
    }

    public async askPermissions() {
        try {
            await NotificationPermissionPrompt.askPermission().then(async x => {
                var serviceworker = await NotificationPermissionPrompt.serviceWorkerLoader();
                var result = await NotificationPermissionPrompt.subscribeUserToPush(serviceworker);
                this._handleSubscription(result);
            });
        } catch (exc) {
            console.log(exc);
            this.setState({ serviceWorkerState: ServiceWorkerState.Fail });
        }
    }

    private _handleSubscription(subscription: PushSubscription): void {
        this.setState({ isRunning: true, hasDisplayableErrors: false, hasSavedModify: false });
        fetch("/api/Subscriptors", {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(subscription)
        }).then(result => {
            if (result.ok == false) {
                throw new Error();
            } else {
                this.setState({ hasDisplayableErrors: false, isRunning: false, hasSavedModify: true });
            }
        }).catch(error => {
            this.setState({ hasDisplayableErrors: true, isRunning: false });
            console.log(error)
        });
    }
    getFormClasses(): string {
        var classes = [];
        classes.push("tree-states-btn");
        classes.push("btn");
        classes.push("btn-light");
        if (this.state.isRunning) {
            classes.push("running");
        }
        return classes.join(" ");
    }

    isDisabled(): boolean {
        return this.state.isRunning;
    }

    public render() {
        return <div>
            {this.state.serviceWorkerState == ServiceWorkerState.Ok &&
                <button type="button" className={this.getFormClasses()} disabled={this.isDisabled()} onClick={(e => this.askPermissions())}>
                <span className="glyphicon glyphicon-repeat slow-right-spinner"></span>
                    Richiedi permessi</button>}
            {this.state.serviceWorkerState != ServiceWorkerState.Ok && <p className="text-warning">impossibile registrare questo dispositivo</p>}
            {this.state.hasSavedModify && <mark>modifiche salvate</mark>}
            {this.state.hasDisplayableErrors && <mark>impossibile procedere</mark>}
        </div>;
    }
}