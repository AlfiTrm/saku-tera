package id.sakutera.collector.notification

import id.sakutera.collector.domain.NotificationEvent
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

data class CollectorRuntimeState(
    val isListenerConnected: Boolean = false,
    val lastEvent: NotificationEvent? = null,
)

object CollectorEventStore {
    private val mutableState = MutableStateFlow(CollectorRuntimeState())
    val state = mutableState.asStateFlow()

    fun setListenerConnected(isConnected: Boolean) {
        mutableState.update { current ->
            current.copy(isListenerConnected = isConnected)
        }
    }

    fun publish(event: NotificationEvent) {
        mutableState.update { current ->
            current.copy(lastEvent = event)
        }
    }
}
