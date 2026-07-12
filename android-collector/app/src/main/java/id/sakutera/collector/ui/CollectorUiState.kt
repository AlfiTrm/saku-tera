package id.sakutera.collector.ui

import id.sakutera.collector.domain.NotificationEvent

data class CollectorUiState(
    val hasNotificationAccess: Boolean = false,
    val isCollectorActive: Boolean = false,
    val lastEvent: NotificationEvent? = null,
)
