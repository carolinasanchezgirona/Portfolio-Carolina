package com.carolinasanchezgirona.miclinica;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.DownloadManager;
import android.content.ActivityNotFoundException;
import android.content.ContentValues;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.net.http.SslError;
import android.os.Bundle;
import android.os.Environment;
import android.os.Message;
import android.print.PrintManager;
import android.provider.MediaStore;
import android.view.Gravity;
import android.view.View;
import android.view.WindowInsets;
import android.webkit.CookieManager;
import android.webkit.PermissionRequest;
import android.webkit.SslErrorHandler;
import android.webkit.URLUtil;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;
import androidx.webkit.WebViewCompat;
import androidx.webkit.WebViewFeature;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import org.json.JSONObject;

public final class MainActivity extends Activity {
    private static final String HOME = "https://carolinasanchezgirona.com/admin/?source=android";
    private static final int FILE_PICKER = 1001;
    private static final int MAX_FILE_BYTES = 20 * 1024 * 1024;
    private final ExecutorService files = Executors.newSingleThreadExecutor();
    private WebView web;
    private ProgressBar progress;
    private LinearLayout errorPanel;
    private ValueCallback<Uri[]> fileCallback;
    private String failedUrl = HOME;
    private boolean documentBridge;

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.rgb(243,248,248));
        root.setOnApplyWindowInsetsListener((view, insets) -> {
            view.setPadding(insets.getSystemWindowInsetLeft(), insets.getSystemWindowInsetTop(),
                insets.getSystemWindowInsetRight(), insets.getSystemWindowInsetBottom());
            return insets.consumeSystemWindowInsets();
        });
        web = new WebView(this);
        root.addView(web, new FrameLayout.LayoutParams(-1,-1));
        progress = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
        progress.setProgressTintList(android.content.res.ColorStateList.valueOf(Color.rgb(140,65,146)));
        root.addView(progress, new FrameLayout.LayoutParams(-1,dp(3),Gravity.TOP));
        errorPanel = new LinearLayout(this);
        errorPanel.setOrientation(LinearLayout.VERTICAL);
        errorPanel.setGravity(Gravity.CENTER);
        errorPanel.setPadding(dp(28),dp(28),dp(28),dp(28));
        errorPanel.setBackgroundColor(Color.rgb(243,248,248));
        TextView heading = new TextView(this);
        heading.setText("Mi clínica");
        heading.setTextSize(28);
        heading.setTextColor(Color.rgb(14,92,124));
        errorPanel.addView(heading);
        TextView info = new TextView(this);
        info.setText("No se ha podido abrir la consulta. Comprueba tu conexión y vuelve a intentarlo.");
        info.setTextSize(17);
        info.setGravity(Gravity.CENTER);
        info.setPadding(0,dp(18),0,dp(22));
        info.setTextColor(Color.rgb(83,110,120));
        errorPanel.addView(info);
        Button retry = new Button(this);
        retry.setText("Volver a intentar");
        retry.setOnClickListener(v -> {
            errorPanel.setVisibility(View.GONE);
            web.loadUrl(NavigationPolicy.isInternal(failedUrl) ? failedUrl : HOME);
        });
        errorPanel.addView(retry);
        errorPanel.setVisibility(View.GONE);
        root.addView(errorPanel,new FrameLayout.LayoutParams(-1,-1));
        setContentView(root);
        configureWeb();
        if (state == null || web.restoreState(state) == null) web.loadUrl(HOME);
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void configureWeb() {
        WebView.setWebContentsDebuggingEnabled(false);
        WebSettings settings = web.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setSupportMultipleWindows(true);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setUserAgentString(settings.getUserAgentString() + " MiClinicaAndroid/1.0.0");
        CookieManager.getInstance().setAcceptCookie(true);
        CookieManager.getInstance().setAcceptThirdPartyCookies(web,false);
        if (WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)) {
            documentBridge = true;
            Set<String> origins = new HashSet<>();
            origins.add("https://carolinasanchezgirona.com");
            origins.add("https://www.carolinasanchezgirona.com");
            WebViewCompat.addWebMessageListener(web,"MiClinicaFiles",origins,
                (view,message,origin,mainFrame,reply) -> {
                    if (!mainFrame || !NavigationPolicy.isInternal(origin.toString())) return;
                    try {
                        String raw = message.getData();
                        if (raw == null || raw.length() > 29 * 1024 * 1024) return;
                        JSONObject data = new JSONObject(raw);
                        switch (data.optString("type")) {
                            case "print" -> printPage();
                            case "error" -> toast("No se ha podido descargar el documento.");
                            case "export" -> saveExport(data.optString("name","documento"),
                                data.optString("mime","application/octet-stream"),data.optString("data"));
                            default -> { }
                        }
                    } catch (Exception ignored) { toast("No se ha podido preparar el documento."); }
                });
        }
        web.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                if (!request.isForMainFrame()) return false;
                String url = request.getUrl().toString();
                if (NavigationPolicy.isInternal(url)) return false;
                if (request.hasGesture()) openExternal(url);
                return true;
            }
            @Override public void onPageStarted(WebView view,String url,android.graphics.Bitmap icon) {
                if (NavigationPolicy.isInternal(url)) failedUrl=url;
                progress.setVisibility(View.VISIBLE);
            }
            @Override public void onPageFinished(WebView view,String url) {
                progress.setVisibility(View.GONE);
                CookieManager.getInstance().flush();
                if (!NavigationPolicy.isInternal(url)) return;
                web.evaluateJavascript(
                    "(function(){if(window.__miClinicaNativeReady)return;window.__miClinicaNativeReady=true;" +
                    "document.querySelectorAll('[data-clinic-pwa-install],#clinic-pwa-install-hint').forEach(function(e){e.hidden=true;});" +
                    "document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[download]');" +
                    "if(a)window.__miClinicaDownloadName=a.getAttribute('download')||'documento';},true);" +
                    "if(window.MiClinicaFiles){window.print=function(){MiClinicaFiles.postMessage(JSON.stringify({type:'print'}));};}" +
                    "})();",null);
            }
            @Override public void onReceivedError(WebView view,WebResourceRequest request,WebResourceError error) {
                if (request.isForMainFrame()) { progress.setVisibility(View.GONE); errorPanel.setVisibility(View.VISIBLE); }
            }
            @Override public void onReceivedSslError(WebView view,SslErrorHandler handler,SslError error) {
                handler.cancel();
                progress.setVisibility(View.GONE);
                toast("No se ha podido verificar la conexión segura.");
            }
        });
        web.setWebChromeClient(new WebChromeClient() {
            @Override public void onProgressChanged(WebView view,int value) { progress.setProgress(value); }
            @Override public void onPermissionRequest(PermissionRequest request) { request.deny(); }
            @Override public boolean onShowFileChooser(WebView view,ValueCallback<Uri[]> callback,FileChooserParams params) {
                if (!NavigationPolicy.isInternal(view.getUrl())) return false;
                if (fileCallback != null) fileCallback.onReceiveValue(null);
                fileCallback=callback;
                Intent intent=params.createIntent();
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                try { startActivityForResult(intent,FILE_PICKER); }
                catch (ActivityNotFoundException ex) { fileCallback.onReceiveValue(null);fileCallback=null;toast("No hay un selector de archivos disponible."); }
                return true;
            }
            @Override public boolean onCreateWindow(WebView view,boolean dialog,boolean userGesture,Message result) {
                if (!userGesture) return false;
                WebView popup=new WebView(MainActivity.this);
                popup.setWebViewClient(new WebViewClient() {
                    @Override public boolean shouldOverrideUrlLoading(WebView v,WebResourceRequest r) {
                        String url=r.getUrl().toString();
                        if (NavigationPolicy.isInternal(url)) web.loadUrl(url); else openExternal(url);
                        v.destroy();
                        return true;
                    }
                });
                WebView.WebViewTransport transport=(WebView.WebViewTransport)result.obj;
                transport.setWebView(popup); result.sendToTarget();return true;
            }
        });
        web.setDownloadListener((url,userAgent,disposition,mime,length) -> {
            if (url.startsWith("blob:") && NavigationPolicy.isInternal(web.getUrl())) downloadBlob(url);
            else if (NavigationPolicy.isInternal(url)) downloadHttps(url,userAgent,disposition,mime);
            else openExternal(url);
        });
    }

    private void openExternal(String url) {
        if (!NavigationPolicy.canOpenExternally(url)) return;
        try {
            Intent intent=new Intent(Intent.ACTION_VIEW,Uri.parse(url));
            intent.addCategory(Intent.CATEGORY_BROWSABLE);
            startActivity(intent);
        } catch (ActivityNotFoundException ignored) { toast("No hay una aplicación disponible para abrir este enlace."); }
    }

    private void downloadHttps(String url,String userAgent,String disposition,String mime) {
        try {
            DownloadManager.Request request=new DownloadManager.Request(Uri.parse(url));
            String cookies=CookieManager.getInstance().getCookie(url);
            if (cookies != null) request.addRequestHeader("Cookie",cookies);
            request.addRequestHeader("User-Agent",userAgent);
            String name=NavigationPolicy.safeFileName(URLUtil.guessFileName(url,disposition,mime));
            request.setTitle(name);
            if (mime != null) request.setMimeType(mime);
            request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
            request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS,name);
            ((DownloadManager)getSystemService(DOWNLOAD_SERVICE)).enqueue(request);
            toast("Descargando documento en Descargas.");
        } catch (Exception ignored) { toast("No se ha podido iniciar la descarga."); }
    }

    private void downloadBlob(String url) {
        if (!documentBridge) { toast("Actualiza Android System WebView para descargar este documento.");return; }
        String script="(async function(){try{var b=await(await fetch("+JSONObject.quote(url)+")).blob();" +
            "if(b.size>"+MAX_FILE_BYTES+")throw new Error('size');var r=new FileReader();" +
            "r.onload=function(){MiClinicaFiles.postMessage(JSON.stringify({type:'export',name:window.__miClinicaDownloadName||'documento'," +
            "mime:b.type||'application/octet-stream',data:String(r.result).split(',')[1]}));};" +
            "r.onerror=function(){MiClinicaFiles.postMessage(JSON.stringify({type:'error'}));};r.readAsDataURL(b);" +
            "}catch(e){MiClinicaFiles.postMessage(JSON.stringify({type:'error'}));}})();";
        web.evaluateJavascript(script,null);
    }

    private void saveExport(String filename,String mime,String encoded) {
        if (encoded.isEmpty() || encoded.length()>29*1024*1024) { toast("El documento supera el tamaño permitido.");return; }
        files.execute(() -> {
            Uri saved=null;
            try {
                byte[] bytes=Base64.getDecoder().decode(encoded);
                if (bytes.length>MAX_FILE_BYTES) throw new IllegalArgumentException("size");
                ContentValues values=new ContentValues();
                values.put(MediaStore.Downloads.DISPLAY_NAME,NavigationPolicy.safeFileName(filename));
                values.put(MediaStore.Downloads.MIME_TYPE,mime.matches("[a-zA-Z0-9.+-]+/[a-zA-Z0-9.+-]+")?mime:"application/octet-stream");
                values.put(MediaStore.Downloads.RELATIVE_PATH,Environment.DIRECTORY_DOWNLOADS);
                values.put(MediaStore.Downloads.IS_PENDING,1);
                saved=getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI,values);
                if (saved==null) throw new IllegalStateException("destination");
                try (OutputStream out=getContentResolver().openOutputStream(saved)) {
                    if (out==null) throw new IllegalStateException("stream");
                    out.write(bytes);
                }
                ContentValues complete=new ContentValues();complete.put(MediaStore.Downloads.IS_PENDING,0);
                getContentResolver().update(saved,complete,null,null);
                toast("Documento guardado en Descargas.");
            } catch (Exception ignored) {
                if (saved!=null) getContentResolver().delete(saved,null,null);
                toast("No se ha podido guardar el documento.");
            }
        });
    }
    private void printPage() {
        PrintManager manager=(PrintManager)getSystemService(PRINT_SERVICE);
        if (manager!=null) manager.print("Mi clínica",web.createPrintDocumentAdapter("Mi clínica"),null);
    }
    @Override protected void onActivityResult(int request,int result,Intent data) {
        super.onActivityResult(request,result,data);
        if (request!=FILE_PICKER || fileCallback==null) return;
        Uri[] selected=WebChromeClient.FileChooserParams.parseResult(result,data);
        ArrayList<Uri> allowed=new ArrayList<>();
        if (selected!=null) for (Uri uri:selected) {
            if (uri!=null && "content".equalsIgnoreCase(uri.getScheme()) && allowed.size()<20) allowed.add(uri);
        }
        ValueCallback<Uri[]> callback=fileCallback;fileCallback=null;
        callback.onReceiveValue(allowed.isEmpty()?null:allowed.toArray(new Uri[0]));
    }
    @Override public void onBackPressed() {
        if (web.canGoBack()) { errorPanel.setVisibility(View.GONE);web.goBack(); }
        else super.onBackPressed();
    }
    @Override protected void onSaveInstanceState(Bundle state) { super.onSaveInstanceState(state);web.saveState(state); }
    @Override protected void onPause() { CookieManager.getInstance().flush();super.onPause(); }
    @Override protected void onDestroy() {
        if (fileCallback!=null) {fileCallback.onReceiveValue(null);fileCallback=null;}
        web.destroy();files.shutdown();super.onDestroy();
    }
    private int dp(int value) {return Math.round(value*getResources().getDisplayMetrics().density);}
    private void toast(String value) {runOnUiThread(() -> Toast.makeText(this,value,Toast.LENGTH_LONG).show());}
}
