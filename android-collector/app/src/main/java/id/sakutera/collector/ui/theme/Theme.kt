package id.sakutera.collector.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val SakuTeraColors = lightColorScheme(
    primary = Color(0xFF176B52),
    onPrimary = Color.White,
    primaryContainer = Color(0xFFD7F5E7),
    onPrimaryContainer = Color(0xFF0B4937),
    background = Color(0xFFFAFAF7),
    onBackground = Color(0xFF151A24),
    surface = Color.White,
    onSurface = Color(0xFF151A24),
    surfaceVariant = Color(0xFFF0F1EC),
    onSurfaceVariant = Color(0xFF626870),
    error = Color(0xFFB42318),
    errorContainer = Color(0xFFFFE4E0),
    onErrorContainer = Color(0xFF7A2018),
)

@Composable
fun SakuTeraCollectorTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = SakuTeraColors,
        content = content,
    )
}
