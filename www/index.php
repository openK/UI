<!DOCTYPE html> <html class="" dir="ltr" lang="en-US"> 
    <head>
        <!--base href="http://192.168.1.2:8080/" --/>
        <!-- ACHTUNG: css hier VOR theme.include --> 
        <link type="text/css" rel="stylesheet" href="http://fonts.googleapis.com/css?family=Source+Serif+Pro:400,600,700">
        <link type="text/css" rel="stylesheet" href="http://fonts.googleapis.com/css?family=Source+Sans+Pro:200,300,400,600,700,900,400italic"> 
        <link rel="stylesheet" href="libs/angular-ui-grid/ui-grid.min.css" type="text/css"/>
        <link rel="stylesheet" href="libs/bootstrap/dist/css/bootstrap.min.css" type="text/css"/>
        <link rel="stylesheet" href="libs/bootstrap/dist/css/bootstrap-theme.min.css" type="text/css"/>
        <link rel="stylesheet" href="libs/bootstrap-daterangepicker/daterangepicker.css" type="text/css"/>
        <link rel="stylesheet" href="libs/isteven-angular-multiselect/isteven-multi-select.css" type="text/css"/>
        <link rel="stylesheet" href="libs/angular-bootstrap-grid-tree/src/treeGrid.css" type="text/css"/>
        <link rel="stylesheet" href="app/additional.css"/>
        <link rel="stylesheet" href="app/custom.css"/>

        <title>Eisman</title>
        <meta content="initial-scale=1.0, width=device-width" name="viewport"/>
        <meta content="text/html; charset=UTF-8" http-equiv="content-type" />
        <link href="http://192.168.1.2:8080/openk-theme/images/favicon.ico" rel="Shortcut Icon" />
        <link class="lfr-css-file" href="http&#x3a;&#x2f;&#x2f;192.168.1.2&#x3a;8080&#x2f;openk-theme&#x2f;css&#x2f;aui&#x2e;css&#x3f;browserId&#x3d;firefox&#x26;themeId&#x3d;openk_WAR_openktheme&#x26;languageId&#x3d;en_US&#x26;b&#x3d;6202&#x26;t&#x3d;1447170406000" rel="stylesheet" type="text/css" />
        <link href="&#x2f;html&#x2f;css&#x2f;main&#x2e;css&#x3f;browserId&#x3d;firefox&#x26;themeId&#x3d;openk_WAR_openktheme&#x26;languageId&#x3d;en_US&#x26;b&#x3d;6202&#x26;t&#x3d;1419333880000" rel="stylesheet" type="text/css" />
        <link href="http://192.168.1.2:8080/notifications-portlet/notifications/css/main.css?browserId=firefox&amp;themeId=openk_WAR_openktheme&amp;languageId=en_US&amp;b=6202&amp;t=1447336885000" rel="stylesheet" type="text/css" />
        <link href="http://192.168.1.2:8080/html/portlet/login/css/main.css?browserId=firefox&amp;themeId=openk_WAR_openktheme&amp;languageId=en_US&amp;b=6202&amp;t=1447336886000" rel="stylesheet" type="text/css" />
        <script type="text/javascript">
            // <![CDATA[
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
            // ]]>
        </script>

        <script src="/html/js/everything.jsp?browserId=firefox&amp;themeId=openk_WAR_openktheme&amp;colorSchemeId=01&amp;minifierType=js&amp;minifierBundleId=javascript.everything.files&amp;languageId=en_US&amp;b=6202&amp;t=1420297276000" type="text/javascript"></script>
        <script type="text/javascript">
            // <![CDATA[

            Liferay.Portlet.list = ['eisman_WAR_openkeismanportlet_INSTANCE_uc1dEFUgumF7', '58'];
            Liferay._editControlsState = 'visible';



            // ]]>
        </script>
        <link class="lfr-css-file" href="http&#x3a;&#x2f;&#x2f;192.168.1.2&#x3a;8080&#x2f;openk-theme&#x2f;css&#x2f;main&#x2e;css&#x3f;browserId&#x3d;firefox&#x26;themeId&#x3d;openk_WAR_openktheme&#x26;languageId&#x3d;en_US&#x26;b&#x3d;6202&#x26;t&#x3d;1447170406000" rel="stylesheet" type="text/css" />

        <style type="text/css">


        </style>

        <!-- ACHTUNG: css hier NACH theme.include -->


        <script src="http://192.168.1.2:8080/openk-theme/js/jquery-1.11.2/jquery-1.11.2.min.js" type="text/javascript"></script>
        <script src="http://192.168.1.2:8080/openk-theme/js/bootstrap-3.3.4/js/bootstrap.min.js" type="text/javascript"></script>
        <script src="http://192.168.1.2:8080/openk-theme/js/bootstrap-3.3.4/js/moment.min.js" type="text/javascript"></script>
        <script src="http://192.168.1.2:8080/openk-theme/js/bootstrap-3.3.4/js/ie10-viewport-bug-workaround.js" type="text/javascript"></script>
        <script src="http://192.168.1.2:8080/openk-theme/js/bootstrap-3.3.4/js/daterangepicker.js" type="text/javascript"></script>
        <script src="http://192.168.1.2:8080/openk-theme/js/angular-1.3.13/angular.min.js" type="text/javascript"></script>
        <script src="http://192.168.1.2:8080/openk-theme/js/angular-1.3.13/angular-resource.min.js" type="text/javascript"></script>
        <script src="http://192.168.1.2:8080/openk-theme/js/angular-1.3.13/angular-locale_de-de.min.js" type="text/javascript"></script>
        <script src="http://192.168.1.2:8080/openk-theme/js/ui-bootstrap-0.12.1/ui-bootstrap-tpls-0.12.1.min.js"  type="text/javascript"></script>
        <script src="http://192.168.1.2:8080/openk-theme/js/angular-translate-2.7.0/angular-translate.min.js" type="text/javascript"></script>
        <script src="http://192.168.1.2:8080/openk-theme/js/angular-translate-loader-url-2.7.0/angular-translate-loader-url.js"  type="text/javascript"></script>
        <script src="http://192.168.1.2:8080/openk-theme/js/ui-grid-3.0.0/ui-grid.min.js" type="text/javascript"></script>
        <script src="http://192.168.1.2:8080/openk-theme/js/angular-1.3.13/angular-touch.min.js" type="text/javascript"></script>
        <script src="http://192.168.1.2:8080/openk-theme/js/underscore-1.8.3/underscore-min.js" type="text/javascript"></script>
        <script src="http://192.168.1.2:8080/openk-theme/js/tree-grid-directive/tree-grid-directive.js" type="text/javascript"></script>
        <script src="http://192.168.1.2:8080/openk-theme/js/angular-multi-select-4.0.0/isteven-multi-select.js" type="text/javascript"></script>
        <script src="http://192.168.1.2:8080/openk-theme/js/angular-timer-1.3.3/humanize-duration.js" type="text/javascript"></script>
        <script src="http://192.168.1.2:8080/openk-theme/js/angular-timer-1.3.3/angular-timer.min.js" type="text/javascript"></script>
    </head>

    <body class=" yui3-skin-sam controls-visible guest-site signed-in public-page site">

        <nav class="navbar navbar-default navbar-fixed-top masthead" role="banner">
            <div class="container-fluid">
                <div class="navbar-header">
                    <a href="/" class="navbar-brand">
                        <span class="open">Open</span>
                        <span class="konsequenz">Konsequenz</span>
                    </a>
                </div> 
                <div class="pull-right">
                    <a href="/c/portal/logout">
                        <span class="header_links">Logout</span>
                    </a>

                </div> 
            </div> 
        </nav> 

        <!--main--> 
        <div class="container-fluid">
            <div class="row row-offcanvas row-offcanvas-left">
                <nav class="col-xs-6 col-sm-1 sidebar-offcanvas" id="sidebar" role="navigation">
                    <div class="list-group">
                        <a aria-labelledby="layout_1" class="list-group-item " href="http&#x3a;&#x2f;&#x2f;192.168.1.2&#x3a;8080&#x2f;web&#x2f;guest&#x2f;welcome" role="menuitem"> Welcome </a> <a aria-labelledby="layout_2" class="list-group-item " href="http&#x3a;&#x2f;&#x2f;192.168.1.2&#x3a;8080&#x2f;web&#x2f;guest&#x2f;eisman" role="menuitem"> Eisman </a> <a aria-labelledby="layout_3" class="list-group-item " href="http&#x3a;&#x2f;&#x2f;192.168.1.2&#x3a;8080&#x2f;web&#x2f;guest&#x2f;test" role="menuitem"> test </a>
                        <a aria-labelledby="layout_4" class="list-group-item " href="http&#x3a;&#x2f;&#x2f;192.168.1.2&#x3a;8080&#x2f;web&#x2f;guest&#x2f;tt" role="menuitem"> TT </a>
                    </div> 
                </nav>

                <script type="text/javascript">

            Liferay.Data.NAV_LIST_SELECTOR = '.navbar-inner .nav-collapse > ul';

                </script>


                <div class="col-xs-12 col-sm-11">
                    <div id="content">
                        <div class="columns-1" id="main-content" role="main">
                            <div class="portlet-layout row-fluid">
                                <div class="portlet-column portlet-column-only span12" id="column-1">
                                    <div class="portlet-dropzone portlet-column-content portlet-column-content-only" id="layout-column_column-1">
                                        <div class="portlet-boundary portlet-boundary_eisman_WAR_openkeismanportlet_ portlet-static portlet-static-end " id="p_p_id_eisman_WAR_openkeismanportlet_INSTANCE_uc1dEFUgumF7_" >
                                            <span id="p_eisman_WAR_openkeismanportlet_INSTANCE_uc1dEFUgumF7"></span>
                                            <div class="col-xs-12 col-sm-12" style="">
                                                <section class="portlet" id="portlet_eisman_WAR_openkeismanportlet_INSTANCE_uc1dEFUgumF7">
                                                    <header class="portlet-topper">
                                                        <menu class="portlet-topper-toolbar" id="portlet-topper-toolbar_eisman_WAR_openkeismanportlet_INSTANCE_uc1dEFUgumF7" type="toolbar"> 
                                                        </menu> 
                                                    </header> 
                                                    <div class="">
                                                        <div class=" portlet-content-container" style="">
                                                            <div class="portlet-body">     
                                                                <?php  include('app/overview.html'); ?>
                                                                
                                                            </div>    
                                                        </div> 
                                                    </div>
                                                </section> 
                                            </div>
                                        </div> 
                                    </div> 
                                </div> 
                            </div> 
                        </div> 
                        <form action="#" id="hrefFm" method="post" name="hrefFm">
                            <span></span>
                        </form> 
                    </div> 
                </div> 
            </div> 

            <footer id="footer" role="contentinfo"> 
                <p class="powered-by"> Powered By <a href="http://www.btc-ag.com" rel="external">BTC</a> </p>
            </footer> 
        </div> 







        <script src="libs/jquery/dist/jquery.min.js" type="text/javascript"></script>
        <script src="libs/angular/angular.min.js" type="text/javascript"></script>
        <script src="libs/angular-ui-router/release/angular-ui-router.min.js" type="text/javascript"></script>
        <script src="libs/angular-bootstrap/ui-bootstrap.min.js" type="text/javascript"></script>
        <script src="libs/moment/moment.js" type="text/javascript"></script>
        <script src="libs/bootstrap-daterangepicker/daterangepicker.js" type="text/javascript"></script>
        <script src="libs/angular-resource/angular-resource.min.js" type="text/javascript"></script>
        <script src="libs/angular-i18n/angular-locale_de-de.js" type="text/javascript"></script>
        <script src="libs/angular-bootstrap/ui-bootstrap-tpls.min.js" type="text/javascript"></script>
        <script src="libs/angular-translate/angular-translate.min.js" type="text/javascript"></script>
        <script src="libs/angular-translate-loader-url/angular-translate-loader-url.min.js" type="text/javascript"></script>
        <script src="libs/angular-ui-grid/ui-grid.min.js" type="text/javascript"></script>
        <script src="libs/underscore/underscore-min.js" type="text/javascript"></script>
        <script src="libs/angular-bootstrap-grid-tree/src/tree-grid-directive.js" type="text/javascript"></script>
        <script src="libs/isteven-angular-multiselect/isteven-multi-select.js" type="text/javascript"></script>
        <script src="libs/humanize-duration/humanize-duration.js" type="text/javascript"></script>
        <script src="libs/angular-timer/dist/angular-timer.min.js" type="text/javascript"></script>

        <script src="app/directives/directive.js" type="text/javascript"></script>
        <script src="app/filters/filter.js" type="text/javascript"></script>
        <script src="app/services/dateService.js" type="text/javascript"></script>
        <script src="app/confirmController.js" type="text/javascript"></script>
        <script src="app/createController.js" type="text/javascript"></script>
        <script src="app/detailController.js" type="text/javascript"></script>
        <script src="app/modalControllers.js" type="text/javascript"></script>
        <script src="app/confirmController.js" type="text/javascript"></script>
        <script src="app/networkStateController.js" type="text/javascript"></script>
        <script src="app/overviewController.js" type="text/javascript"></script>
        <script src="app/selectedSubStationController.js" type="text/javascript"></script>
        <script src="app/subStationController.js" type="text/javascript"></script>
        <script src="app/app.js" type="text/javascript"></script>
        <script type="text/javascript">
// <![CDATA[
            Liferay.Util.addInputFocus();

// ]]>
        </script>
        <script type="text/javascript">
            // <![CDATA[

            Liferay.Portlet.onLoad(
                    {
                        canEditTitle: false,
                        columnPos: 0,
                        isStatic: 'end',
                        namespacedId: 'p_p_id_eisman_WAR_openkeismanportlet_INSTANCE_uc1dEFUgumF7_',
                        portletId: 'eisman_WAR_openkeismanportlet_INSTANCE_uc1dEFUgumF7',
                        refreshURL: '\x2fc\x2fportal\x2frender_portlet\x3fp_l_id\x3d10684\x26p_p_id\x3deisman_WAR_openkeismanportlet_INSTANCE_uc1dEFUgumF7\x26p_p_lifecycle\x3d0\x26p_t_lifecycle\x3d0\x26p_p_state\x3dnormal\x26p_p_mode\x3dview\x26p_p_col_id\x3dcolumn-1\x26p_p_col_pos\x3d0\x26p_p_col_count\x3d1\x26p_p_isolated\x3d1\x26currentURL\x3d\x252Fweb\x252Fguest\x252Feisman'
                    }
            );
            AUI().use('aui-base', 'liferay-menu', 'liferay-notice', 'liferay-poller', function (A) {
                (function () {
                    Liferay.Util.addInputType();

                    Liferay.Portlet.ready(
                            function (portletId, node) {
                                Liferay.Util.addInputType(node);
                            }
                    );

                    if (A.UA.mobile) {
                        Liferay.Util.addInputCancel();
                    }
                })();
                (function () {
                    new Liferay.Menu();

                    var liferayNotices = Liferay.Data.notices;

                    for (var i = 1; i < liferayNotices.length; i++) {
                        new Liferay.Notice(liferayNotices[i]);
                    }


                    Liferay.Poller.init(
                            {
                                encryptedUserId: 'PcKJBShli4g1trjpn51hdQ==',
                                supportsComet: false
                            }
                    );

                })();
            });
            // ]]>
        </script>
        <script src="http://192.168.1.2:8080/openk-theme/js/main.js?browserId=firefox&amp;minifierType=js&amp;languageId=en_US&amp;b=6202&amp;t=1447170406000" type="text/javascript"></script>
        <script type="text/javascript">
            // <![CDATA[



            // ]]>
        </script> 




    </body>
</html> 