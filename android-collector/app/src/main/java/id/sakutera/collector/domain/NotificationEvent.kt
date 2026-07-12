package id.sakutera.collector.domain

data class NotificationEvent(
    val packageName: String,
    val title: String,
    val text: String,
    val bigText: String,
    val postedAt: Long,
    val notificationId: Int,
)
