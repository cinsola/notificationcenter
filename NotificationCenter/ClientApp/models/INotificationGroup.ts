import { DeletingStatus } from "../components/Notification/INotification";

export interface INotificationGroup {
    id?: number;
    groupName: string;
}

export interface INotificationGroupDTO extends INotificationGroup {
    setupAt: Date;
    id: number;
    deviceCount: number;
    notificationCount: number;
    deletingStatus?: DeletingStatus
}