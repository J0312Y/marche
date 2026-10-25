package com.lamuka.app;

import android.graphics.Color;
import android.os.Bundle;
import android.os.SystemClock;
import android.webkit.JavascriptInterface;
import androidx.core.splashscreen.SplashScreen;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    // Écran de lancement gardé jusqu'à ce que la page web soit affichée (sinon : écran noir pendant le chargement)
    private volatile boolean webReady = false;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        SplashScreen splash = SplashScreen.installSplashScreen(this);
        final long deadline = SystemClock.uptimeMillis() + 6000; // sécurité : jamais bloqué plus de 6 s
        splash.setKeepOnScreenCondition(() -> !webReady && SystemClock.uptimeMillis() < deadline);
        super.onCreate(savedInstanceState);
        // La page appelle LamukaBoot.ready() après son premier affichage (src/main.jsx)
        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().addJavascriptInterface(new Object() {
                @JavascriptInterface
                public void ready() { webReady = true; }
            }, "LamukaBoot");
        }
        // Comme Toters : barres système blanches, icônes foncées
        getWindow().getDecorView().setBackgroundColor(Color.WHITE);
        getWindow().setStatusBarColor(Color.WHITE);
        getWindow().setNavigationBarColor(Color.WHITE);
        if (android.os.Build.VERSION.SDK_INT >= 29) {
            getWindow().setStatusBarContrastEnforced(false);
            getWindow().setNavigationBarContrastEnforced(false);
        }
        WindowInsetsControllerCompat bars = WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
        bars.setAppearanceLightStatusBars(true);
        bars.setAppearanceLightNavigationBars(true);
        // Une app, pas un site : pas de zoom au pincement ni au double appui
        if (getBridge() != null && getBridge().getWebView() != null) {
            android.webkit.WebSettings ws = getBridge().getWebView().getSettings();
            ws.setSupportZoom(false);
            ws.setBuiltInZoomControls(false);
            ws.setDisplayZoomControls(false);
        }
    }
}
