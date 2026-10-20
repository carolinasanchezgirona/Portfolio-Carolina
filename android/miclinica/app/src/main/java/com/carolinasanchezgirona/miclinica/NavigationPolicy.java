package com.carolinasanchezgirona.miclinica;

import java.net.URI;
import java.util.Locale;

/** The native document bridge is only exposed to the clinic's exact HTTPS origin. */
final class NavigationPolicy {
    private NavigationPolicy() {}
    static boolean isInternal(String value) {
        try {
            URI uri = new URI(value);
            String host = uri.getHost();
            return "https".equalsIgnoreCase(uri.getScheme())
                && uri.getUserInfo() == null
                && (uri.getPort() == -1 || uri.getPort() == 443)
                && host != null
                && ("carolinasanchezgirona.com".equalsIgnoreCase(host)
                    || "www.carolinasanchezgirona.com".equalsIgnoreCase(host));
        } catch (Exception ignored) { return false; }
    }
    static boolean canOpenExternally(String value) {
        try {
            String scheme = new URI(value).getScheme();
            if (scheme == null) return false;
            return switch (scheme.toLowerCase(Locale.ROOT)) {
                case "https", "http", "mailto", "tel" -> true;
                default -> false;
            };
        } catch (Exception ignored) { return false; }
    }
    static String safeFileName(String value) {
        String name = value == null ? "" : value.replaceAll("[\\\\/\\p{Cntrl}]", "_").replaceAll("^\\.+", "").trim();
        if (name.isEmpty()) name = "documento";
        if (name.length() > 120) name = name.substring(name.length() - 120);
        return name;
    }
}
