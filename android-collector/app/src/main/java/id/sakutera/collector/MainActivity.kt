package id.sakutera.collector

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import id.sakutera.collector.ui.CollectorRoute
import id.sakutera.collector.ui.theme.SakuTeraCollectorTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            SakuTeraCollectorTheme {
                CollectorRoute()
            }
        }
    }
}
