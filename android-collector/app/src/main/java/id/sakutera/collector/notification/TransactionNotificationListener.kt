package id.sakutera.collector.notification

import android.content.ComponentName
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import id.sakutera.collector.BuildConfig

class TransactionNotificationListener : NotificationListenerService() {
    private val filter = NotificationFilter()

    override fun onListenerConnected() {
        super.onListenerConnected()
        CollectorEventStore.setListenerConnected(true)
    }

    override fun onListenerDisconnected() {
        CollectorEventStore.setListenerConnected(false)
        requestRebind(ComponentName(this, TransactionNotificationListener::class.java))
        super.onListenerDisconnected()
    }

    override fun onNotificationPosted(statusBarNotification: StatusBarNotification?) {
        val event = statusBarNotification?.let(NotificationExtractor::extract) ?: return
        if (!filter.shouldCollect(event)) return

        CollectorEventStore.publish(event)

        if (BuildConfig.DEBUG) {
            Log.d(
                TAG,
                "Detected package=${event.packageName}, title=${event.title}, " +
                    "text=${event.text}, bigText=${event.bigText}, postedAt=${event.postedAt}, " +
                    "notificationId=${event.notificationId}",
            )
        }
    }

    companion object {
        private const val TAG = "SakuTeraCollector"
    }
}
