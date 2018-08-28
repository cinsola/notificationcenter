import { INotificationGroup } from "../../models/INotificationGroup";
import IWaitableComponent from "../../models/IWaitableComponent";

export interface INotificationGroupProps extends INotificationGroup { }
export interface INotificationGroupState extends INotificationGroup, IWaitableComponent { }