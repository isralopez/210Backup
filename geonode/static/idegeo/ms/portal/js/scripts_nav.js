jQuery(function($) {
    'use strict';
    $(document).ready(function() {
        // PAGE-IDE
        var pageIDE = $('body').attr('class').split(' ')[0];
        var pageTPO = pageIDE.split('_')[0];
        var pageLEVS = pageIDE.split('_')[1];
        var pageLEVL = pageLEVS.length;
        // console.log(pageIDE + ' | ' + pageTPO + '_' + pageLEVS);
        var pageLEV1 = pageTPO + '_' + pageLEVS.substring(0, 2);
        var pageLEV2 = pageTPO + '_' + pageLEVS.substring(0, 4);
        var pageLEV3 = pageTPO + '_' + pageLEVS.substring(0, 6);
        // console.log(pageIDE + ' | ' + pageLEV1 + ' : ' + pageLEV2 + ' : ' + pageLEV3);
        /*******************************************************
            XTC-NAVAUX [ *** TEMPORAL-DEMO *** ]
        *******************************************************/
        // CODE
        var xtcCODE = '' + 
            '<div id="xtc_navAUX">' + 
            '<div class="content-nav">' + 
            '<ul class="nav-menu">' + 
                '<li class="sty_01"><a href="sty_01.html">STY_01</a></li>' + 
                '<li class="sty_02"><a href="sty_02.html">STY_02</a></li>' + 
                '<li class="com_00"><a href="com_00.html">COM_00</a></li>' + 
                '<li class="com_01"><a href="com_01.html">COM_01</a></li>' + 
                '<li class="com_02"><a href="com_02.html">COM_02</a></li>' + 
                '<li class="com_03"><a href="com_03.html">COM_03</a></li>' + 
                '<li class="com_04"><a href="com_04.html">COM_04</a></li>' + 
                '<li class="map_00"><a href="map_00.html">MAP_00</a></li>' + 
            '</ul>' + 
            '</div>' + 
            '</div>';
        $('#drawer-nav').append(xtcCODE);
        // ACTIVE
        setTimeout(function() {
            var xtcMENU = '#xtc_navAUX ul.nav-menu li.' + pageLEV1;
            $(xtcMENU).addClass('active');
        }, 600);
        /*******************************************************
            HEADER-MENU [CODE] [ACTIVE]
        *******************************************************/
        if ($('#header .header-menu').length) {
            // CODE
            var navCODE = '' + 
                '<div class="content-nav">' + 
                    '<ul class="nav-menu">' + 
                        '<li class="tem_00"><a href="index.html">Inicio</a></li>' + 
                        // '<li class="tem_01"><span>Temática 01</span>' + 
                        '<li class="tem_01"><a href="tem_01.html">Temática 01 <i class="fas fa-angle-down"></i></a>' + 
                            '<ul class="nav-child">' + 
                                '<li class="tem_0101"><a href="tem_0101.html">Temática 0101</a></li>' + 
                                '<li class="tem_0102"><a href="tem_0102.html">Temática 0102</a></li>' + 
                                '<li class="tem_0103"><a href="tem_0103.html">Temática 0103</a></li>' + 
                                '<li class="tem_0104"><a href="tem_0104.html">Temática 0104</a></li>' + 
                            '</ul>' + 
                        '</li>' + 
                        '<li class="tem_02"><a href="tem_02.html">Temática 02 <i class="fas fa-angle-down"></i></a>' + 
                            '<ul class="nav-child">' + 
                                '<li class="tem_0201"><a href="tem_0201.html">Temática 0201</a></li>' + 
                                '<li class="tem_0202"><a href="tem_0202.html">Temática 0202</a></li>' + 
                                '<li class="tem_0203"><a href="tem_0203.html">Temática 0203</a></li>' + 
                                '<li class="tem_0204"><a href="tem_0204.html">Temática 0204</a></li>' + 
                            '</ul>' + 
                        '</li>' + 
                        '<li class="tem_03"><a href="tem_03.html">Temática 03 <i class="fas fa-angle-down"></i></a>' + 
                            '<ul class="nav-child">' + 
                                '<li class="tem_0301"><a href="tem_0301.html">Temática 0301</a></li>' + 
                                '<li class="tem_0302"><a href="tem_0302.html">Temática 0302</a></li>' + 
                                '<li class="tem_0303"><a href="tem_0303.html">Temática 0303</a></li>' + 
                                '<li class="tem_0304"><a href="tem_0304.html">Temática 0304</a></li>' + 
                            '</ul>' + 
                        '</li>' + 
                        '<li class="tem_04"><a href="tem_04.html">Temática 04 <i class="fas fa-angle-down"></i></a>' + 
                            '<ul class="nav-child">' + 
                                '<li class="tem_0401"><a href="tem_0401.html">Temática 0401</a></li>' + 
                                '<li class="tem_0402"><a href="tem_0402.html">Temática 0402</a></li>' + 
                                '<li class="tem_0403"><a href="tem_0403.html">Temática 0403</a></li>' + 
                                '<li class="tem_0404"><a href="tem_0404.html">Temática 0404</a></li>' + 
                            '</ul>' + 
                        '</li>' + 
                        '<li class="tem_05"><a href="tem_05.html">Temática 05 <i class="fas fa-angle-down"></i></a>' + 
                            '<ul class="nav-child">' + 
                                '<li class="tem_0501"><a href="tem_0501.html">Temática 0501</a></li>' + 
                                '<li class="tem_0502"><a href="tem_0502.html">Temática 0502</a></li>' + 
                                '<li class="tem_0503"><a href="tem_0503.html">Temática 0503</a></li>' + 
                                '<li class="tem_0504"><a href="tem_0504.html">Temática 0504</a></li>' + 
                            '</ul>' + 
                        '</li>' + 
                        '<li class="tem_06"><a href="tem_06.html">Temática 06 <i class="fas fa-angle-down"></i></a>' + 
                            '<ul class="nav-child">' + 
                                '<li class="tem_0601"><a href="tem_0601.html">Temática 0601</a></li>' + 
                                '<li class="tem_0602"><a href="tem_0602.html">Temática 0602</a></li>' + 
                                '<li class="tem_0603"><a href="tem_0603.html">Temática 0603</a></li>' + 
                                '<li class="tem_0604"><a href="tem_0604.html">Temática 0604</a></li>' + 
                            '</ul>' + 
                        '</li>' + 
                    '</ul>' + 
                '</div>';
            $('#header .header-menu').append(navCODE);
            // ACTIVE
            setTimeout(function() {
                var headerMENU = '#header .content-nav ul.nav-menu li.' + pageIDE;
                $(headerMENU).addClass('active');
                var parentMENU = '#header .content-nav ul.nav-menu > li.' + pageLEV1;
                $(parentMENU).addClass('active');
                var headernavMENU = '#header-nav .content-nav ul.nav-menu li.' + pageIDE;
                $(headernavMENU).addClass('active');
                var headernavMENU = '#header-nav .content-nav ul.nav-menu > li.' + pageLEV1;
                $(headernavMENU).addClass('active');
            }, 300);
        }
        /*******************************************************
            DRAWER-NAV [CODE] [ACTIVE]
        *******************************************************/
        if ($('#drawer-nav').length) {
            // CODE
            var drawerCODE = '' + 
                // DRAWER-HEADER
                '<div id="drawer-header">' + 
                '<div class="header-wrapper">' + 
                '<div class="container-full">' + 
                '<div class="content">' + 
                '<div class="head-logo">' + 
                    '<div class="logo-item"><a href="https://www.conacyt.gob.mx/" target="_blank"><img src="img/logo/logo_conacyt_black.svg" alt="Logo CONACYT" title="Consejo Nacional de Ciencia y Tecnología (CONACYT)"></a></div>' + 
                    '<div class="logo-item"><a href="https://www.centrogeo.org.mx/" target="_blank"><img src="img/logo/logo_centrogeo_black.svg" alt="Logo CentroGeo" title="Centro de Investigación en Ciencias de Información Geoespacial (CentroGeo)"></a></div>' + 
                '</div>' + 
                '<div class="head-right">' + 
                    '<div class="site-name">' + 
                        '<h1 class="name-item sitename"><span class="xtc-nowrap">Plataforma Geoweb</span> <span class="xtc-nowrap">del Istmo de Tehuantepec</span></h1>' + 
                        '<h2 class="name-item sitename-sub"><span class="xtc-nowrap">Una caracterización territorial</span></h2>' + 
                    '</div>' + 
                '</div>' + 
                '</div>' + 
                '</div>' + 
                '</div>' + 
                '</div>' + 
                // DRAWER-CONTENT
                '<div id="drawer-content">' + 
                '<div class="content-wrapper">' + 
                '<div class="container-full">' + 
                '<div class="content">' + 
                '<div class="content-nav">' + 
                '<ul class="nav-menu">' + 
                    '<li class="tem_00"><a href="index.html">Inicio</a></li>' + 
                    '<li class="doc_01"><a href="doc_01.html">Acerca de esta plataforma</a></li>' + 
                    '<li class="tem_01"><a href="tem_01.html">Temática 01</a></li>' + 
                    '<li class="tem_02"><a href="tem_02.html">Temática 02</a></li>' + 
                    '<li class="tem_03"><a href="tem_03.html">Temática 03</a></li>' + 
                    '<li class="tem_04"><a href="tem_04.html">Temática 04</a></li>' + 
                    '<li class="tem_05"><a href="tem_05.html">Temática 05</a></li>' + 
                    '<li class="tem_06"><a href="tem_06.html">Temática 06</a></li>' + 
                '</ul>' + 
                '</div>' + 
                '</div>' + 
                '</div>' + 
                '</div>' + 
                '</div>' + 
                // DRAWER-BOTTOM
                '<div id="drawer-bottom">' + 
                '<div class="bottom-wrapper">' + 
                '<div class="container-full">' + 
                '<div class="content">' + 
                // '<div class="bottom-logo">' + 
                // '<div class="logo-item"><a href="https://www.conacyt.gob.mx/" target="_blank"><img src="img/logo/logo_conacyt_black.svg" alt="Logo CONACYT" style="width: 108px; height: 90px;" title="Consejo Nacional de Ciencia y Tecnología"></a></div>' + 
                // '<div class="logo-item"><a href="https://www.centrogeo.org.mx/" target="_blank"><img src="img/logo/logo_centrogeo_black.svg" alt="Logo CentroGeo" style="width: 90px; height: 90px;" title="Centro de Investigación en Ciencias de Información Geoespacial"></a></div>' + 
                // '</div>' + 
                '<div class="bottom-nav">' + 
                '<ul class="nav-menu">' + 
                    '<li class="doc_02"><a href="doc_02.html">Política de privacidad</a></li>' + 
                    '<li class="doc_03"><a href="doc_03.html">Condiciones generales de uso</a></li>' + 
                    '<li><a href="mailto:contacto@centrogeo.edu.mx">Contacto</a></li>' + 
                '</ul>' + 
                '</div>' + 
                '</div>' + 
                '</div>' + 
                '</div>' + 
                '</div>';
            $('#drawer-nav .drawer-wrapper').prepend(drawerCODE);
            // ACTIVE
            setTimeout(function() {
                var drawerMENU = '#drawer-nav .content ul.nav-menu li.' + pageLEV1;
                $(drawerMENU).addClass('active');
            }, 600);
        }
        /*******************************************************
            DRAWER-NAV [INIT]
        *******************************************************/
        if ($('#drawer-nav').length) {
            $('.drawer').drawer({
                class: {
                    nav: 'drawer-nav',
                        toggle: 'drawer-toggle',
                        overlay: 'drawer-overlay',
                        open: 'drawer-open',
                        close: 'drawer-close',
                        dropdown: 'drawer-dropdown'
                },
                iscroll: {
                    mouseWheel: false,
                    preventDefault: false
                },
                showOverlay: true
            });
        }
        /*******************************************************
            SIDEBAR-NAV [CODE] [ACTIVE]
        *******************************************************/
        if ($('#nav_menu-tp').length) {
            // CODE
            var sidebarTPCODE = '' + 
                '<div class="nav-header">Novedades</div>' + 
                '<nav role="navigation">' + 
                '<ul class="nav-menu">' + 
                    '<li class="new_0101"><a href="#">Novedad 01</a></li>' + 
                    '<li class="new_0102"><a href="#">Novedad 02</a></li>' + 
                    '<li class="new_0103"><a href="#">Novedad 03</a></li>' + 
                    '<li class="new_0104"><a href="#">Novedad 04</a></li>' + 
                    '<li class="new_0105"><a href="#">Novedad 05</a></li>' + 
                    '<li class="new_0106"><a href="#">Novedad 06</a></li>' + 
                '</ul>' + 
                '</nav>';
            $('#nav_menu-tp').prepend(sidebarTPCODE);
            // ACTIVE
            setTimeout(function() {
                for (var i = 1; i <= (pageLEVL / 2); i++) {
                    var pageITEMn = pageTPO + '_' + pageLEVS.substring(0, i * 2);
                    var sidebarITEM = '.row-sidebar nav .nav-menu .' + pageITEMn;
                    $(sidebarITEM).parent('.nav-child').addClass('active');
                    $(sidebarITEM).addClass('active');
                    $(sidebarITEM).find(">.nav-child").addClass('active');
                }
            }, 300);
        }
        if ($('#nav_menu-bt').length) {
            // CODE
            var sidebarBTCODE = '' + 
                '<div class="nav-header">Temáticas</div>' + 
                '<nav role="navigation">' + 
                '<ul class="nav-menu">' + 
                    '<li class="tem_01"><a href="tem_01.html">Temática 0101</a>' + 
                    '<ul class="nav-child">' + 
                        '<li class="tem_0101"><a href="tem_0101.html">Temática 0101</a></li>' + 
                        '<li class="tem_0102"><a href="tem_0102.html">Temática 0102</a></li>' + 
                        '<li class="tem_0103"><a href="tem_0103.html">Temática 0103</a></li>' + 
                        '<li class="tem_0104"><a href="tem_0104.html">Temática 0104</a></li>' + 
                    '</ul>' + 
                    '</li>' + 
                    '<li class="tem_02"><a href="#">Temática 02</a></li>' + 
                    '<li class="tem_03"><a href="#">Temática 03</a></li>' + 
                    '<li class="tem_04"><a href="#">Temática 04</a></li>' + 
                '</ul>' + 
                '</nav>';
            $('#nav_menu-bt').prepend(sidebarBTCODE);
            // ACTIVE
            setTimeout(function() {
                for (var i = 1; i <= (pageLEVL / 2); i++) {
                    var pageITEMn = pageTPO + '_' + pageLEVS.substring(0, i * 2);
                    var sidebarITEM = '.row-sidebar nav .nav-menu .' + pageITEMn;
                    $(sidebarITEM).parent('.nav-child').addClass('active');
                    $(sidebarITEM).addClass('active');
                    $(sidebarITEM).find(">.nav-child").addClass('active');
                }
            }, 300);


        }
    });
});