var Liferay = {
    Browser: {
        acceptsGzip: function () {
            return true;
        },
        getMajorVersion: function () {
            return 37.0;
        },
        getRevision: function () {
            return "37.0";
        },
        getVersion: function () {
            return "37.0";
        },
        isAir: function () {
            return false;
        },
        isChrome: function () {
            return false;
        },
        isFirefox: function () {
            return true;
        },
        isGecko: function () {
            return true;
        },
        isIe: function () {
            return false;
        },
        isIphone: function () {
            return false;
        },
        isLinux: function () {
            return true;
        },
        isMac: function () {
            return false;
        },
        isMobile: function () {
            return false;
        },
        isMozilla: function () {
            return true;
        },
        isOpera: function () {
            return false;
        },
        isRtf: function () {
            return true;
        },
        isSafari: function () {
            return false;
        },
        isSun: function () {
            return false;
        },
        isWap: function () {
            return false;
        },
        isWapXhtml: function () {
            return false;
        },
        isWebKit: function () {
            return false;
        },
        isWindows: function () {
            return false;
        },
        isWml: function () {
            return false;
        }
    },
    Data: {
        NAV_SELECTOR: '#navigation',
        isCustomizationView: function () {
            return false;
        },
        notices: [
            null




        ]
    },
    ThemeDisplay: {
        getLayoutId: function () {
            return "2";
        },
        getLayoutURL: function () {
            return "http://192.168.1.2:8080/web/guest/eisman";
        },
        getParentLayoutId: function () {
            return "0";
        },
        isPrivateLayout: function () {
            return "false";
        },
        isVirtualLayout: function () {
            return false;
        },
        getBCP47LanguageId: function () {
            return "en-US";
        },
        getCDNBaseURL: function () {
            return "http://192.168.1.2:8080";
        },
        getCDNDynamicResourcesHost: function () {
            return "";
        },
        getCDNHost: function () {
            return "";
        },
        getCompanyId: function () {
            return "10155";
        },
        getCompanyGroupId: function () {
            return "10195";
        },
        getDefaultLanguageId: function () {
            return "en_US";
        },
        getDoAsUserIdEncoded: function () {
            return "";
        },
        getLanguageId: function () {
            return "en_US";
        },
        getParentGroupId: function () {
            return "10182";
        },
        getPathContext: function () {
            return "";
        },
        getPathImage: function () {
            return "/image";
        },
        getPathJavaScript: function () {
            return "/html/js";
        },
        getPathMain: function () {
            return "/c";
        },
        getPathThemeImages: function () {
            return "http://192.168.1.2:8080/openk-theme/images";
        },
        getPathThemeRoot: function () {
            return "/openk-theme";
        },
        getPlid: function () {
            return "10684";
        },
        getPortalURL: function () {
            return "http://192.168.1.2:8080";
        },
        getPortletSetupShowBordersDefault: function () {
            return true;
        },
        getScopeGroupId: function () {
            return "10182";
        },
        getScopeGroupIdOrLiveGroupId: function () {
            return "10182";
        },
        getSessionId: function () {



            return "";


        },
        getSiteGroupId: function () {
            return "10182";
        },
        getURLControlPanel: function () {
            return "/group/control_panel?refererPlid=10684";
        },
        getURLHome: function () {
            return "http\x3a\x2f\x2f192.168.1.2\x3a8080\x2fweb\x2fguest";
        },
        getUserId: function () {
            return "11119";
        },
        getUserName: function () {


            return "\u006f\u0070\u0065\u006e\u006b\u0020\u006f\u0070\u0065\u006e\u006b";



        },
        isAddSessionIdToURL: function () {
            return false;
        },
        isFreeformLayout: function () {
            return false;
        },
        isImpersonated: function () {
            return false;
        },
        isSignedIn: function () {
            return true;
        },
        isStateExclusive: function () {
            return false;
        },
        isStateMaximized: function () {
            return false;
        },
        isStatePopUp: function () {
            return false;
        }
    },
    PropsValues: {
        NTLM_AUTH_ENABLED: false
    }
};

var themeDisplay = Liferay.ThemeDisplay;



Liferay.AUI = {
    getAvailableLangPath: function () {
        return 'available_languages.jsp?browserId=firefox&themeId=openk_WAR_openktheme&colorSchemeId=01&minifierType=js&languageId=en_US&b=6202&t=1420297276000';
    },
    getCombine: function () {
        return true;
    },
    getComboPath: function () {
        return '/combo/?browserId=firefox&minifierType=&languageId=en_US&b=6202&t=1420297276000&';
    },
    getFilter: function () {


        return 'min';




    },
    getJavaScriptRootPath: function () {
        return '/html/js';
    },
    getLangPath: function () {
        return 'aui_lang.jsp?browserId=firefox&themeId=openk_WAR_openktheme&colorSchemeId=01&minifierType=js&languageId=en_US&b=6202&t=1420297276000';
    }
};

Liferay.authToken = 'dWql175a';



Liferay.currentURL = '\x2fweb\x2fguest\x2feisman';
Liferay.currentURLEncoded = '%2Fweb%2Fguest%2Feisman';
