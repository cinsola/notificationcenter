import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { NotificationPrompt } from './NotificationPrompt/NotificationPrompt';

export class Home extends React.Component<RouteComponentProps<{}>, {}> {
    constructor() {
        super({} as RouteComponentProps<{}>)
    }
    public render() {
        return <div>
            <h1>Bevenuto!</h1>
            <p>Tramite questo strumento puoi:</p>
            <ul>
                <li>Creare <b>gruppi di notifiche</b></li>
                <li>Creare e inviare <b>notifiche personalizzate</b> da inviare in broadcast a diversi gruppi</li>
            </ul>
            <p>Per testare, consenti a questo browser di ricevere notifiche:</p>
            <NotificationPrompt />
        </div>;
    }
}
