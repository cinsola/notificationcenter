import { INotificationGroupSuggestion } from "../components/Notification/INotification";

export interface ISubscriberDTO {
    id: number;
    description: string;
    endpoint: string;
    expirationTime: Date | null;
    setupAt: Date | null;
    tagsCount: number;
    device: string;
    platform: string;
    platformVersion: string;
    browser: string;
    browserVersion: string;
    groupsId: Array<INotificationGroupSuggestion>
}

export interface ISubscriberEditDTO extends ISubscriberDTO {
    groupsId: Array<INotificationGroupSuggestion>,
}