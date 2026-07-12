package id.sakutera.collector.ui

import android.content.Context
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.weight
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.compose.LocalLifecycleOwner
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import id.sakutera.collector.domain.NotificationEvent
import id.sakutera.collector.permission.NotificationAccessManager
import java.text.DateFormat
import java.util.Date

@Composable
fun CollectorRoute(viewModel: CollectorViewModel = viewModel()) {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    DisposableEffect(lifecycleOwner) {
        val observer = LifecycleEventObserver { _, event ->
            if (event == Lifecycle.Event.ON_RESUME) {
                viewModel.refreshPermissionStatus()
            }
        }
        lifecycleOwner.lifecycle.addObserver(observer)
        onDispose { lifecycleOwner.lifecycle.removeObserver(observer) }
    }

    CollectorScreen(
        uiState = uiState,
        onOpenNotificationSettings = context::openNotificationAccessSettings,
    )
}

@Composable
private fun CollectorScreen(
    uiState: CollectorUiState,
    onOpenNotificationSettings: () -> Unit,
) {
    Scaffold(containerColor = MaterialTheme.colorScheme.background) { contentPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(contentPadding)
                .padding(horizontal = 24.dp, vertical = 28.dp),
        ) {
            Text(
                text = "SakuTera Collector",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
            )
            Text(
                modifier = Modifier.padding(top = 6.dp),
                text = "Tangkap notifikasi transaksi secara aman.",
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                style = MaterialTheme.typography.bodyLarge,
            )

            Spacer(modifier = Modifier.height(28.dp))

            StatusCard(
                label = "Notification Access",
                isEnabled = uiState.hasNotificationAccess,
                enabledText = "Diizinkan",
                disabledText = "Belum diizinkan",
            )
            Spacer(modifier = Modifier.height(12.dp))
            StatusCard(
                label = "Collector",
                isEnabled = uiState.isCollectorActive,
                enabledText = "Aktif",
                disabledText = if (uiState.hasNotificationAccess) "Menghubungkan" else "Tidak aktif",
            )

            Spacer(modifier = Modifier.height(24.dp))

            LastEventCard(event = uiState.lastEvent)

            Spacer(modifier = Modifier.weight(1f))

            Button(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(54.dp),
                onClick = onOpenNotificationSettings,
                shape = RoundedCornerShape(16.dp),
            ) {
                Text(
                    text = if (uiState.hasNotificationAccess) {
                        "Buka Pengaturan Notifikasi"
                    } else {
                        "Izinkan Akses Notifikasi"
                    },
                    fontWeight = FontWeight.SemiBold,
                )
            }
        }
    }
}

@Composable
private fun StatusCard(
    label: String,
    isEnabled: Boolean,
    enabledText: String,
    disabledText: String,
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        shape = RoundedCornerShape(18.dp),
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 18.dp, vertical = 16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(text = label, fontWeight = FontWeight.SemiBold)
            Text(
                modifier = Modifier
                    .background(
                        color = if (isEnabled) {
                            MaterialTheme.colorScheme.primaryContainer
                        } else {
                            MaterialTheme.colorScheme.errorContainer
                        },
                        shape = RoundedCornerShape(999.dp),
                    )
                    .padding(horizontal = 12.dp, vertical = 6.dp),
                text = if (isEnabled) enabledText else disabledText,
                color = if (isEnabled) {
                    MaterialTheme.colorScheme.onPrimaryContainer
                } else {
                    MaterialTheme.colorScheme.onErrorContainer
                },
                style = MaterialTheme.typography.labelLarge,
                fontWeight = FontWeight.Bold,
            )
        }
    }
}

@Composable
private fun LastEventCard(event: NotificationEvent?) {
    Column {
        Text(
            text = "Notifikasi terakhir",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold,
        )
        Spacer(modifier = Modifier.height(10.dp))
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            shape = RoundedCornerShape(18.dp),
        ) {
            if (event == null) {
                Text(
                    modifier = Modifier.padding(18.dp),
                    text = "Belum ada notifikasi yang terdeteksi.",
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            } else {
                Column(modifier = Modifier.padding(18.dp)) {
                    Text(
                        text = event.title.ifBlank { "Tanpa judul" },
                        fontWeight = FontWeight.Bold,
                        style = MaterialTheme.typography.titleMedium,
                    )
                    Text(
                        modifier = Modifier.padding(top = 4.dp),
                        text = event.text.ifBlank { event.bigText.ifBlank { "Tanpa isi" } },
                        style = MaterialTheme.typography.bodyMedium,
                    )
                    Text(
                        modifier = Modifier.padding(top = 12.dp),
                        text = "${event.packageName} - ${formatPostedAt(event.postedAt)}",
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        style = MaterialTheme.typography.labelMedium,
                    )
                }
            }
        }
    }
}

private fun Context.openNotificationAccessSettings() {
    startActivity(NotificationAccessManager.createSettingsIntent())
}

private fun formatPostedAt(postedAt: Long): String =
    DateFormat.getDateTimeInstance(DateFormat.MEDIUM, DateFormat.SHORT).format(Date(postedAt))
