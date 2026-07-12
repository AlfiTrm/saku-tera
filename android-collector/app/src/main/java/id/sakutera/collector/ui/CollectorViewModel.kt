package id.sakutera.collector.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import id.sakutera.collector.notification.CollectorEventStore
import id.sakutera.collector.permission.NotificationAccessManager
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn

class CollectorViewModel(application: Application) : AndroidViewModel(application) {
    private val hasNotificationAccess = MutableStateFlow(checkNotificationAccess())

    val uiState = combine(
        hasNotificationAccess,
        CollectorEventStore.state,
    ) { hasAccess, runtimeState ->
        CollectorUiState(
            hasNotificationAccess = hasAccess,
            isCollectorActive = hasAccess && runtimeState.isListenerConnected,
            lastEvent = runtimeState.lastEvent,
        )
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5_000),
        initialValue = CollectorUiState(
            hasNotificationAccess = hasNotificationAccess.value,
        ),
    )

    fun refreshPermissionStatus() {
        hasNotificationAccess.value = checkNotificationAccess()
    }

    private fun checkNotificationAccess(): Boolean =
        NotificationAccessManager.isEnabled(getApplication())
}
