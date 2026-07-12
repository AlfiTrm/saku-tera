package id.sakutera.collector.notification

import android.app.Notification
import android.service.notification.StatusBarNotification
import id.sakutera.collector.domain.NotificationEvent

object NotificationExtractor {
    fun extract(statusBarNotification: StatusBarNotification): NotificationEvent {
        val extras = statusBarNotification.notification.extras

        return NotificationEvent(
            packageName = statusBarNotification.packageName.orEmpty(),
            title = extras.getCharSequence(Notification.EXTRA_TITLE)?.toString().orEmpty(),
            text = extras.getCharSequence(Notification.EXTRA_TEXT)?.toString().orEmpty(),
            bigText = extras.getCharSequence(Notification.EXTRA_BIG_TEXT)?.toString().orEmpty(),
            postedAt = statusBarNotification.postTime,
            notificationId = statusBarNotification.id,
        )
    }
}
