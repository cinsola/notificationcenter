import { PUBLIC_KEY } from "./Settings";
export default class NotificationPermissionPrompt {
    public static serviceWorkerLoader(): Promise<ServiceWorkerRegistration> {
        if (!('serviceWorker' in navigator)) {
            console.log("no-serviceWorker");
            throw new Error("no-worker");
        }
        if (!('PushManager' in window)) {
            console.log("no-pushManager");
            throw new Error("no-manager");
        }
        return navigator.serviceWorker.register('/dist/worker.js');
    }

    public static askPermission(): Promise<void> {
        var promise = new Promise((resolve, reject) => {
            const permissionResult = Notification.requestPermission(function (result) {
                resolve(result);
            });

            console.log(permissionResult);
            if (permissionResult) {
                permissionResult.then(resolve, reject);
            }
        }).then((permissionResult) => {
            if (permissionResult !== 'granted') {
                throw new Error('We weren\'t granted permission.');
            }
        });
        return promise;
    }

    private static urlB64ToUint8Array(base64String: string): Uint8Array {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    public static async subscribeUserToPush(registration: ServiceWorkerRegistration): Promise<PushSubscription> {
            const subscribeOptions = {
                userVisibleOnly: true,
                applicationServerKey: this.urlB64ToUint8Array(PUBLIC_KEY)
            };

        var result = await registration.pushManager.subscribe(subscribeOptions);
        return result;
    }
}