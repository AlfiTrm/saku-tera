package id.sakutera.collector.notification

import id.sakutera.collector.domain.NotificationEvent

enum class CollectorMode {
    DISCOVERY,
    WHITELIST_ONLY,
}

class NotificationFilter(
    private val mode: CollectorMode = CollectorMode.DISCOVERY,
    private val allowedPackages: Set<String> = emptySet(),
) {
    fun shouldCollect(event: NotificationEvent): Boolean {
        if (event.packageName.isBlank()) return false

        return when (mode) {
            CollectorMode.DISCOVERY -> true
            CollectorMode.WHITELIST_ONLY -> event.packageName in allowedPackages
        }
    }
}
