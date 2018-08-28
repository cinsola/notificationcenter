import IWaitableComponent from "../../models/IWaitableComponent";
import { INotificationGroup } from "../../models/INotificationGroup";

export interface INotificationState extends IWaitableComponent {
    id: number | null;
    notification: INotificationInnerState;
    groupSuggestions: Array<INotificationGroupSuggestion>;
}
export interface INotificationProps {
    id?: number;
}

export interface INotificationGroupSuggestion {
    id: string;
    text: string;
}

export interface INotificationInnerState {
    id: number | null;
    groupsId: Array<INotificationGroupSuggestion>;
    notificationName: string;
    notificationTitle: string;
    notificationLink: string;
    notificationImage: string;
    notificationText: string;
    notificationLinkIcon: string;
    notificationLinkTitle: string;
    notificationIcon: string;
    setupAt?: Date;
    isDeleted?: boolean;
    hasLink ?: boolean;
}

export enum BroadcastStatus {
    Broadcasting,
    Ok,
    Failed
}

export enum DeletingStatus {
    Deleting,
    Ok,
    Failed
}
export interface INotificationDTO extends INotificationInnerState {
    id: number;
    broadcastStatus?: BroadcastStatus
    deletingStatus?: DeletingStatus
}