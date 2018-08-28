export default interface IWaitableComponent {
    isRunning: boolean;
    isFetchingStartingData: boolean;
    hasFailedRequest?: boolean;
    hasDisplayableErrors?: boolean;
    hasSavedModify?: boolean;
    errors?: { [key: string]: Array<string> };
}