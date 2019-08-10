jQuery(function($) {
    'use strict';
    $(document).ready(function() {
        // PAGE-PATH
        var pagePATH = document.location.pathname.match(/[^\/]+$/)[0];
        var locPathN1 = pagePATH.split('_')[0];
        var locPathN2 = pagePATH.split('_')[1];
        // console.log(pagePATH + ' | ' + locPathN1 + '_' + locPathN2);
        // PAGE-IDE
        var pageIDE = $('body').attr('class').split(' ')[0];
        var pageTPO = pageIDE.split('_')[0];
        var pageLEVS = pageIDE.split('_')[1];
        // console.log(pageIDE + ' | ' + pageTPO + '_' + pageLEVS);
        var pageLEV1 = pageTPO + '_' + pageLEVS.substring(0, 2);
        var pageLEV2 = pageTPO + '_' + pageLEVS.substring(0, 4);
        var pageLEV3 = pageTPO + '_' + pageLEVS.substring(0, 6);
        // console.log(pageIDE + ' | ' + pageLEV1 + ' : ' + pageLEV2 + ' : ' + pageLEV3);
        window.FontAwesomeConfig.searchPseudoElements = true;
        /*******************************************************
            HEADER [HEIGHT-CHANGE] [SCROLLMAGIC]
        *******************************************************/
        var _sectionHD = '#header';
        var _sectionVH = '#header + section > .section-100vh';
        var _sectionMH = '#header + section > .section-mh';
        var _sectionSH = '#header + section > .section-sh';
        var height_secHD,
            // paddbt_secMH,
            // paddbt_secSH,
            paddtp_padMH,
            paddtp_padSH;
        // ------------
        function headerHeight_change() {
            height_secHD = Math.floor($(_sectionHD).outerHeight());
            // paddbt_secMH = parseInt($(_sectionMH).css('padding-bottom'), 10);
            // paddbt_secSH = parseInt($(_sectionSH).css('padding-bottom'), 10);
            paddtp_padMH = height_secHD - 0; // 60 30
            paddtp_padSH = height_secHD - 0; // 50 20
            // if (isNaN(paddbt_secMH)) paddbt_secMH = 0;
            // if (isNaN(paddbt_secSH)) paddbt_secSH = 0;
            $(_sectionMH).css({
                // 'padding-top': paddtp_padMH + paddbt_secMH + 'px'
                'margin-top': paddtp_padMH + 'px'
            });
            $(_sectionSH).css({
                // 'padding-top': paddtp_padSH + paddbt_secSH + 'px'
                'margin-top': paddtp_padSH + 'px'
            });
            // console.log(paddbt_secMH + ' :: ' + paddbt_secSH);
            headerNav_show();
        }
        headerHeight_change();
        /*******************************************************
            HEADER [NAV-SHOW] [SCROLLMAGIC]
        *******************************************************/
        var height_navHD,
            height_secVH,
            height_secMH,
            height_secSH,
            height_secVMS;
        // HEADER-CLONE
        if ($('#header-nav').length) {
            $('#header .header-wrapper').clone().appendTo('#header-nav');
        }
        // HEADERNAV-SHOW
        function headerNav_show() {
            if ($('#header-nav').length) {
                // HEADER-SHOW
                setTimeout(function() {
                    height_navHD = Math.floor($('#header-nav').outerHeight());
                    height_secVH = Math.floor($(_sectionVH).outerHeight());
                    height_secMH = Math.floor($(_sectionMH).outerHeight());
                    height_secSH = Math.floor($(_sectionSH).outerHeight());
                    if (isNaN(height_secVH)) height_secVH = 0;
                    if (isNaN(height_secMH)) height_secMH = 0;
                    if (isNaN(height_secSH)) height_secSH = 0;
                    // console.log(height_secVH + height_secMH + height_secSH)
                    // INIT-CONTROLLER
                    var controllerHeaderNav = new ScrollMagic.Controller({
                        globalSceneOptions: {
                            triggerHook: 'onLeave',
                            offset: height_secVH + height_secMH + height_secSH
                        }
                    });
                    // BUILD-TWEEN
                    var tweenHeaderNav = TweenMax.fromTo('#header-nav', 0.60, {
                        y: (height_navHD + 10) * -1,
                        transformOrigin: 'top center 0px',
                    }, {
                        y: 0,
                        ease: Sine.easeInOut
                    });
                    // BUILD-SCENE
                    var sceneHeaderNav = new ScrollMagic.Scene().setTween(tweenHeaderNav).setClassToggle('#header-nav', 'active').addTo(controllerHeaderNav);
                    // .addIndicators({name: 'INDICATOR'})
                    // console.log(height_secVH + ' :: ' + height_secMH + ' :: ' + height_secSH);
                }, 300);
            }
        }
        /*******************************************************
            MODAL [OPCS-ITEM]
        *******************************************************/
        $('.opcs-item[data-type]').on('click', function() {
            var dataTYPE = $(this).data('type');
            if (dataTYPE == 'modal') {
                var dataMTYPE = $(this).data('mtype');
                var dataMODAL = $(this).data('modal');
                var modalCONT = '<div class="modal-wrapper">' + dataMODAL + '</div>';;
                var modalTHEM = 'light';
                var modalCLAS = 'large';
                var modalBSTP = true;
                var modalWDTH = '800'; // 720
                // console.log('MODAL | ' + dataMTYPE + ' | ' + dataMODAL);
                if (dataMTYPE == 'youtube') {
                    // MODAL > YOUTUBE
                    modalCONT = '' + '<div class="modal-wrapper">' + '<div class="modal-video-responsive">' + '<iframe src="https://www.youtube.com/embed/' + dataMODAL + '?rel=0" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' + '</div>' + '</div>';
                    modalTHEM = 'supervan';
                    modalCLAS = 'xlarge';
                    modalBSTP = false;
                    setTimeout(function() {
                        $('.jconfirm .jconfirm-box div.jconfirm-content-pane').css({
                            'height': 450,
                            'max-height': '450px !important',
                            'overflow-x': 'visible',
                            'overflow-y': 'visible',
                            'overflow': 'visible'
                        });
                    }, 300);
                } else if (dataMTYPE == 'html5video') {
                    // MODAL > HTML5VIDEO
                    var vidPOSTER = dataMODAL.replace('.mp4', '.jpg'); // *** FILE-EXIST ***
                    modalCONT = '' + '<div class="modal-wrapper">' + '<div class="modal-video-responsive">' + '<video width="" height="" controls poster="' + vidPOSTER + '"><source src="' + dataMODAL + '" type="video/mp4"></video>' + '</div>' + '</div>';
                    modalTHEM = 'supervan';
                    modalCLAS = 'xlarge';
                    modalBSTP = false;
                    setTimeout(function() {
                        $('.jconfirm .jconfirm-box div.jconfirm-content-pane').css({
                            'height': 450,
                            'max-height': '450px !important',
                            'overflow-x': 'visible',
                            'overflow-y': 'visible',
                            'overflow': 'visible'
                        });
                    }, 300);
                } else if (dataMTYPE == 'url') {
                    // MODAL > URL
                    modalCONT = 'url:' + dataMODAL;
                    modalTHEM = 'light';
                    modalCLAS = 'xlarge';
                } else if (dataMTYPE == 'iframe') {
                    // MODAL > IFRAME
                    modalCONT = '<div class="modal-wrapper"><iframe src="' + dataMODAL + '" width="inherit" height="inherit" sandbox></iframe></div>';
                    modalTHEM = 'light';
                    modalCLAS = 'large';
                } else if (dataMTYPE == 'image') {
                    // MODAL > IMAGE
                    if (dataMODAL == '') {
                        dataMODAL = $(this).closest('.xtc-graph-opcs').find('.opcs-image img').attr('src');
                    }
                    modalCONT = '<div class="modal-wrapper"><img src="' + dataMODAL + '"></div>';
                    modalTHEM = 'supervan';
                    modalCLAS = 'xlarge';
                } else {
                    // NPN
                }
                // JQUERY-CONFIRM [DIALOG]
                $.dialog({
                    title: false,
                    content: modalCONT,
                    draggable: false,
                    theme: modalTHEM,
                    animation: 'zoom',
                    offsetTop: 60,
                    offsetBottom: 40,
                    columnClass: modalCLAS,
                    useBootstrap: modalBSTP,
                    boxWidth: modalWDTH,
                    containerFluid: true,
                    backgroundDismiss: true,
                    closeIcon: true,
                    closeIconClass: 'fas fa-times'
                });
            } else if (dataTYPE == 'link') {
                var dataLINK = $(this).data('link');
                var dataTARG = $(this).data('target');
                // console.log('LINK | ' + dataLINK + ' | ' + dataTARG);
                if (dataTARG == '') {
                    // LINK > PARENT
                    window.location.href = dataLINK;
                } else {
                    // LINK > BLANK
                    window.open(dataLINK);
                }
            } else {
                // NPN
            }
        });
        /*******************************************************
            ACCORDION-SLIDER [INIT]
        *******************************************************/
        if ($('.section-component .accordion-slider').length) {
            $('#com_accordion-slider').accordionSlider({
                width: '100%',
                height: 420,
                responsive: true,
                responsiveMode: 'custom',
                orientation: 'horizontal',
                openedPanelSize: 'max',
                maxOpenedPanelSize: 780,
                openPanelOn: 'hover',
                closePanelsOnMouseOut: true,
                mouseDelay: 200,
                panelDistance: 0,
                openPanelDuration: 600,
                closePanelDuration: 600,
                visiblePanels: 5,
                shadow: true,
                autoplay: false,
                mouseWheel: false,
                breakpoints: {
                    939: {
                        height: 320,
                        maxOpenedPanelSize: 594
                    },
                    759: {
                        height: 580,
                        orientation: 'vertical',
                        maxOpenedPanelSize: 780,
                        closePanelsOnMouseOut: false,
                        visiblePanels: 5
                    }
                }
            });
        }
        /*******************************************************
            GRID-ACCORDION [INIT]
        *******************************************************/
        if ($('.section-component .grid-accordion').length) {
            $('#com_grid-accordion').gridAccordion({
                width: '100%',
                height: 640,
                responsive: true,
                responsiveMode: 'custom',
                orientation: 'horizontal',
                columns: 6,
                rows: 2,
                openedPanelWidth: 'auto',
                openedPanelHeight: 'auto',
                maxOpenedPanelWidth: '70%',
                maxOpenedPanelHeight: '70%',
                openPanelOn: 'hover',
                closePanelsOnMouseOut: false,
                mouseDelay: 0,
                panelDistance: 10,
                openPanelDuration: 400,
                closePanelDuration: 400,
                shadow: false,
                autoplay: false,
                mouseWheel: false,
                breakpoints: {
                    1199: {
                        columns: 5,
                        rows: 3
                    },
                    991: {
                        columns: 4,
                        rows: 3
                    },
                    767: {
                        columns: 3,
                        rows: 3
                    },
                    575: {
                        columns: 2,
                        rows: 4,
                        height: 760,
                        orientation: 'vertical'
                    }
                }
            });
        }
        /*******************************************************
            DRAWER-NAV
        *******************************************************/
        /* SCRIPTS_DRAWER.JS */
        /*******************************************************
            COM_SLIDER-THUMB
        *******************************************************/
        /* SCRIPTS_JSSORSLIDER.JS */
        /*******************************************************
            COM_SLIDER-THUMBNAV
        *******************************************************/
        /* SCRIPTS_JSSORSLIDER.JS */
        /*******************************************************
            COM_UNITEGALLERY
        *******************************************************/
        /* SCRIPTS_UNITEGALLERY.JS */
        /*******************************************************
            LINK LONG [WORD-BREAK]
        *******************************************************/
        $('a:contains("http"), a:contains("www")').css('word-break', 'break-all');
        /*******************************************************
            BOTTOM [DATE-YEAR]
        *******************************************************/
        $('#section-bottom .bottom-year').html(new Date().getFullYear());
        /*******************************************************
            WAIT-WINDOW-RESIZE
        *******************************************************/
        var waitWindowResize = (function() {
            var timers = {};
            return function(callback, ms, uniqueId) {
                if (!uniqueId) {
                    uniqueId = 'uniqueId';
                }
                if (timers[uniqueId]) {
                    clearTimeout(timers[uniqueId]);
                }
                timers[uniqueId] = setTimeout(callback, ms);
            };
        })();
        /*******************************************************
            MEASURE-HELPER [ *** TEMPORAL-NO-NEED *** ]
        *******************************************************/
        // function measureHelper() {
        // -------------------------------------------------
        // var docWidth = $(document).width();
        // console.log(docWidth);
        // -------------------------------------------------
        // var docWidth = $(document).width() + 15;
        // var eleWidth = $('.section-component .mosaic-item img').width();
        // console.log(docWidth + ' : ' + eleWidth);
        // -------------------------------------------------
        // var docWidth = $(document).width();
        // var eleWidth = $('.section-component .grid-accordion .ga-panel').width();
        // var eleHeight = $('.section-component .grid-accordion .ga-panel').height();
        // console.log(docWidth + ' : ' + eleWidth + ' x ' + eleHeight);
        // -------------------------------------------------
        // var docWidth = $(document).width() + 15;
        // var eleWidth = $('#com_directory .directory-item').width();
        // console.log(docWidth + ' : ' + eleWidth);
        // -------------------------------------------------
        // console.log('MEASURE-HELPER');
        // }
        // measureHelper();
        /*******************************************************
            WINDOW-RESIZE
        *******************************************************/
        // $(window).resize(function() {
        //     waitWindowResize(function() {
        //         // headerHeight_change();
        //         // headerNav_show()
        //         // measureHelper();
        //         // console.log('DONE-RESIZE');
        //     }, 500);
        // });
    });
});