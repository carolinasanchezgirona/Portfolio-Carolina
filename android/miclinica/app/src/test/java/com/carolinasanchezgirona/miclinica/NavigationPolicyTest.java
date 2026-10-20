package com.carolinasanchezgirona.miclinica;

import static org.junit.Assert.*;
import org.junit.Test;

public class NavigationPolicyTest {
    @Test public void keepsClinicPagesAndDefaultHttpsPortInsideApp() {
        assertTrue(NavigationPolicy.isInternal("https://carolinasanchezgirona.com/admin/"));
        assertTrue(NavigationPolicy.isInternal("https://www.carolinasanchezgirona.com:443/admin/clinica/?panel=1"));
    }
    @Test public void rejectsLookalikeHostsUserInfoAndActiveContent() {
        for (String url : new String[] {
            "https://carolinasanchezgirona.com.evil.example/admin/",
            "https://carolinasanchezgirona.com@evil.example/",
            "https://user:password@carolinasanchezgirona.com/",
            "https://carolinasanchezgirona.com:8443/",
            "http://carolinasanchezgirona.com/",
            "javascript:alert(1)", "file:///data/data/app", "content://private/doc", "data:text/html,x",
            "intent://launch", "not a url"
        }) assertFalse(url, NavigationPolicy.isInternal(url));
    }
    @Test public void routesMeetingPhoneAndMailToSystemWithoutArbitraryIntents() {
        assertTrue(NavigationPolicy.canOpenExternally("https://meet.google.com/abc-defg-hij"));
        assertTrue(NavigationPolicy.canOpenExternally("tel:+34600000000"));
        assertTrue(NavigationPolicy.canOpenExternally("mailto:contact@example.com"));
        assertFalse(NavigationPolicy.canOpenExternally("intent://anything"));
        assertFalse(NavigationPolicy.canOpenExternally("javascript:alert(1)"));
        assertFalse(NavigationPolicy.canOpenExternally("file:///private"));
    }
    @Test public void documentNamesCannotEscapeDownloadDirectory() {
        assertEquals("_registro.pdf", NavigationPolicy.safeFileName("../registro.pdf"));
        assertEquals("documento", NavigationPolicy.safeFileName(""));
        assertFalse(NavigationPolicy.safeFileName("x\\n.pdf").contains("\n"));
        assertTrue(NavigationPolicy.safeFileName("a".repeat(200)).length() <= 120);
    }
}
