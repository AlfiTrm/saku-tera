package id.sakutera.collector.permission

import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.provider.Settings
import androidx.core.app.NotificationManagerCompat
import id.sakutera.collector.notification.TransactionNotificationListener

object NotificationAccessManager {
    fun isEnabled(context: Context): Boolean {
        val componentName = ComponentName(context, TransactionNotificationListener::class.java)
        return NotificationManagerCompat.getEnabledListenerPackages(context)
            .contains(componentName.packageName)
    }

    fun createSettingsIntent(): Intent =
        Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)
}
