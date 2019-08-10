jQuery(function($) {
    'use strict';
    $(document).ready(function() {
        /*******************************************************
            TOPBAR [AFFIX]
        *******************************************************/
        $('#topbar-fixed').affix({
            offset: {
                top: $('#topbar-fixed').height()
            }
        });
        /*******************************************************
            SLIDES [VERTICAL-NAV]
        *******************************************************/
        if ($('.template-slider').length) {
            ! function(e) {
                var o = new ScrollMagic.Controller,
                    t = ['#slide-1', '#slide-2', '#slide-3', '#slide-4', '#slide-5', '#slide-6'],
                    r = ['#slide-1 header', '#slide-2 header', '#slide-3 header', '#slide-4 header', '#slide-5 header', '#slide-6 header', '#footer'],
                    n = ['#cb-supported', '#cb-1', '#cb-2', '#cb-3', '#cb-4', '#cb-5', '#cb-6'];
                if (!Modernizr.touch) {
                    r.forEach(function(e, t) {
                        {
                            var r = t + 1;
                            new ScrollMagic.Scene({
                                triggerElement: e,
                                offset: -120
                            }).setClassToggle('#slide-' + r, 'is-active').addTo(o);
                            new ScrollMagic.Scene({
                                triggerElement: e,
                                offset: -120
                            }).setClassToggle('nav#slidenav a[href^="#slide-' + r + '"]', 'is-active').addTo(o);
                            new ScrollMagic.Scene({
                                triggerElement: e,
                                offset: -180
                            }).setClassToggle('nav#slidenav a[href^="' + e + '"]', 'is-active').addTo(o);
                        }
                    }), n.forEach(function(t, r) {
                        {
                            var n = e(t).attr('id');
                            new ScrollMagic.Scene({
                                triggerElement: t,
                                triggerHook: 0.75
                            }).setClassToggle('#' + n, 'is-active').on('enter', function(o) {
                                e('nav#slidenav').attr('class', 'is-light');
                            }).addTo(o);
                        }
                    }), t.forEach(function(t, r) {
                        new ScrollMagic.Scene({
                            triggerElement: t
                        }).on('enter', function(o) {
                            e('nav#slidenav').removeAttr('class');
                        }).addTo(o);
                    }), t.forEach(function(t, r) {
                        {
                            var n = e(t).find('.bcg');
                            new ScrollMagic.Scene({
                                triggerElement: t,
                                triggerHook: 1,
                                duration: '100%'
                            }).setTween(TweenMax.from(n, 1, {
                                y: '-40%',
                                autoAlpha: 0.3,
                                ease: Power0.easeNone
                            })).addTo(o);
                        }
                    });
                    var a = new TimelineMax;
                    a.to(e('#intro header, .scroll-hint'), 0.2, {
                        autoAlpha: 0,
                        ease: Power1.easeNone
                    }).to(e('#intro .bcg'), 1.4, {
                        y: '20%',
                        ease: Power1.easeOut
                    }, '-=0.2').to(e('#intro'), 0.7, {
                        autoAlpha: 0.5,
                        ease: Power1.easeNone
                    }, '-=1.4'); {
                        new ScrollMagic.Scene({
                            triggerElement: '#intro',
                            triggerHook: 0,
                            duration: '100%'
                        }).setTween(a).addTo(o);
                    }
                    o.scrollTo(function(e) {
                        TweenMax.to(window, 1, {
                            scrollTo: {
                                y: e
                            },
                            ease: Power1.easeInOut
                        });
                    }), e(document).on('click', 'a[href^="#"]', function(t) {
                        var r = e(this).attr('href');
                        e(r).length > 0 && (t.preventDefault(), o.scrollTo(r), window.history && window.history.pushState && history.pushState('', document.title, r));
                    })
                }
            }(jQuery);
        }
        /*******************************************************
            NAV-MENU-SVG [MOUSE]
        *******************************************************/
        // CAPAS
        // $('.nav-menu-svg #active1').click(function() {
        //     window.location.href = 'http://www.centrogeo.org.mx/';
        // }).mouseenter(function() {
        //     $('.nav-menu-svg #circleBTM1').css('opacity', 1.0);
        //     $('.nav-menu-svg #icon1').css('fill', '#635515');
        // }).mouseleave(function() {
        //     $('.nav-menu-svg #circleBTM1').css('opacity', 0.8);
        //     $('.nav-menu-svg #icon1').css('fill', '#99931A');
        // });
        // MAPAS
        // $('.nav-menu-svg #active2').click(function() {
        //     window.location.href = 'http://www.centrogeo.org.mx/';
        // }).mouseenter(function() {
        //     $('.nav-menu-svg #circleBTM2').css('opacity', 1.0);
        //     $('.nav-menu-svg #icon2').css('fill', '#635515');
        // }).mouseleave(function() {
        //     $('.nav-menu-svg #circleBTM2').css('opacity', 0.8);
        //     $('.nav-menu-svg #icon2').css('fill', '#99931A');
        // });
        // DOCUMENTOS
        // $('.nav-menu-svg #active3').click(function() {
        //     window.location.href = 'http://www.centrogeo.org.mx/';
        // }).mouseenter(function() {
        //     $('.nav-menu-svg #circleBTM3').css('opacity', 1.0);
        //     $('.nav-menu-svg #icon3').css('fill', '#635515');
        // }).mouseleave(function() {
        //     $('.nav-menu-svg #circleBTM3').css('opacity', 0.8);
        //     $('.nav-menu-svg #icon3').css('fill', '#99931A');
        // });
        /*******************************************************
            WINDOW-RESIZE
        *******************************************************/
        // $(window).resize(function () { /*VACIO*/ });
    });
});