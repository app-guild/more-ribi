import {globals} from "../../../resources/styles";
import PushNotification, {
    ChannelObject,
    PushNotificationObject,
    PushNotificationScheduleObject,
} from "react-native-push-notification";

PushNotification.configure({
    // onNotification is called when a notification is to be emitted
    onNotification: (notification) =>
        console.log(`Notification: ${notification}`),
    popInitialNotification: true,
    requestPermissions: true,
});

let lastId = 0;

const mainNotificationPattern: PushNotificationObject = {
    title: "Море рыбы",
    message: "Message",
    playSound: true,
    soundName: "default",

    autoCancel: true,
    largeIcon: "ic_launcher",
    smallIcon: "ic_notification",
    bigText: "My big text that will be shown when notification is expanded",
    vibrate: true,
    color: globals.primaryColor,
    vibration: 300,
    tag: "Море Рыбы",
    group: "group",
    ongoing: false,
    invokeApp: true,
};

const mainNotificationChannelPatter: ChannelObject = {
    channelId: "more-ribi-channel",
    channelName: "MoreRibi notification channel",
    channelDescription: "MoreRibi notification channel",
    soundName: "default",
    importance: 4,
    vibrate: true,
};

export class NotificationService {
    public static createNotification(
        prototype?: PushNotificationObject,
    ): PushNotificationObject {
        const notification = Object.assign(
            {id: lastId++},
            mainNotificationPattern,
        );
        if (prototype) {
            Object.assign(notification, prototype);
        }
        return notification;
    }

    public static createScheduledNotification(
        prototype?: PushNotificationObject,
    ): PushNotificationScheduleObject {
        const notification: PushNotificationScheduleObject = Object.assign(
            {id: lastId++, date: new Date(Date.now() + 30 * 1000)}, // Rise after 30 seconds by default
            mainNotificationPattern,
        );
        if (prototype) {
            Object.assign(notification, prototype);
        }
        return notification;
    }

    public static createOrUpdateNotificationChannel(
        prototype?: ChannelObject,
        callback?: (created: boolean) => void,
    ) {
        const channel: ChannelObject = Object.assign(
            {},
            mainNotificationChannelPatter,
        );
        if (prototype) {
            Object.assign(channel, prototype);
        }
        PushNotification.createChannel(channel, callback ? callback : () => {});
    }

    public static showNotification(prototype?: PushNotificationObject) {
        const notification = NotificationService.createNotification(prototype);
        PushNotification.localNotification(notification);
    }

    public static showScheduledNotification(
        prototype?: PushNotificationObject,
    ) {
        const notification = NotificationService.createScheduledNotification(
            prototype,
        );
        PushNotification.localNotificationSchedule(notification);
    }
}
