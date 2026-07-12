# SakuTera Android Collector

Android companion app untuk menangkap notifikasi transaksi dan meneruskannya ke backend SakuTera.

## Status Development

Phase 1-3 sudah tersedia:

- Native Android project dengan Kotlin dan Jetpack Compose.
- Status Notification Access yang diperbarui saat app kembali aktif.
- Tombol eksplisit menuju Android Notification Access Settings.
- `NotificationListenerService` yang terdaftar di manifest.
- Ekstraksi `packageName`, `title`, `text`, `bigText`, `postedAt`, dan `notificationId`.
- Discovery mode dan filter package yang modular.
- Event terakhir ditampilkan pada UI dan dicetak ke Logcat hanya pada debug build.

Room, WorkManager, API sync, dan device pairing akan masuk Phase 4-8.

## Prasyarat

- Android Studio dengan JDK 17.
- Android SDK 35.
- Perangkat Android 8.0 atau lebih baru.

## Menjalankan

1. Buka folder `android-collector` di Android Studio.
2. Tunggu Gradle sync selesai.
3. Jalankan app pada perangkat Android fisik.
4. Tekan **Izinkan Akses Notifikasi**.
5. Aktifkan akses untuk **SakuTera Collector**.
6. Kirim notifikasi dari aplikasi lain dan cek UI atau Logcat dengan tag `SakuTeraCollector`.

Notification Access harus diberikan secara manual oleh user. App tidak membuka Settings secara otomatis.
