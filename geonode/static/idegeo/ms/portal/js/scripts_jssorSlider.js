/***************************************************************
    Jssor Slider - https://www.jssor.com/
***************************************************************/
jQuery(function($) {
    'use strict';
    $(document).ready(function() {
        /*******************************************************
            COM_SLIDER-THUMBNAV
        *******************************************************/
        if ($('.com_slider-thumbnav').length) {
            // TRANSITIONS
            var slideThumbnav_TRANSITIONS = [
                {$Duration:800,x:-0.3,$During:{$Left:[0.3,0.7]},$Easing:{$Left:$Jease$.$InCubic,$Opacity:$Jease$.$Linear},$Opacity:2}
            ];
            // OPTIONS
            var slideThumbnav_OPTIONS = {
                $AutoPlay: 1,
                $Idle: 6000,
                $FillMode: 2,
                $SlideshowOptions: {
                    $Class: $JssorSlideshowRunner$,
                    $Transitions: slideThumbnav_TRANSITIONS,
                    $TransitionsOrder: 1
                },
                $ArrowNavigatorOptions: {
                    $Class: $JssorArrowNavigator$
                },
                $ThumbnailNavigatorOptions: {
                    $Class: $JssorThumbnailNavigator$,
                    $SpacingX: 3,
                    $SpacingY: 3
                }
            };
            // INIT
            var slideThumbnav_SLIDER = new $JssorSlider$('com_slider-thumbnav', slideThumbnav_OPTIONS);
            var MAX_WIDTH = 980;
            // SCALE-SLIDER
            function scaleSlider() {
                var containerElement = slideThumbnav_SLIDER.$Elmt.parentNode;
                var containerWidth = containerElement.clientWidth;
                if (containerWidth) {
                    var expectedWidth = Math.min(MAX_WIDTH || containerWidth, containerWidth);
                    slideThumbnav_SLIDER.$ScaleWidth(expectedWidth);
                } else {
                    window.setTimeout(scaleSlider, 30);
                }
            }
            scaleSlider();
            $(window).bind('load', scaleSlider);
            $(window).bind('resize', scaleSlider);
            $(window).bind('orientationchange', scaleSlider);
        }
        /*******************************************************
            COM_SLIDER-THUMB
        *******************************************************/
        if ($('.com_slider-thumb').length) {
            // OPTIONS
            var com_sliderThumb_OPTIONS = {
                $AutoPlay: 1,
                $AutoPlaySteps: 3,
                $Idle: 4000,
                $SlideDuration: 240,
                $FillMode: 2,
                $SlideWidth: 210,
                $SlideHeight: 118,
                $SlideSpacing: 3,
                $DragOrientation: 3,
                $ArrowNavigatorOptions: {
                    $Class: $JssorArrowNavigator$,
                    $Steps: 3
                },
                $BulletNavigatorOptions: {
                    $Class: $JssorBulletNavigator$,
                    $SpacingX: 10
                }
            };
            var com_sliderThumb_SLIDER = new $JssorSlider$('com_slider-thumb', com_sliderThumb_OPTIONS);
            com_sliderThumb_SLIDER.$Elmt.style.margin = '';
            // SCALE-SLIDER
            function scaleSlider() {
                var containerElement = com_sliderThumb_SLIDER.$Elmt.parentNode;
                var containerWidth = containerElement.clientWidth;
                if (containerWidth) {
                    var expectedWidth = Math.min(containerWidth, com_sliderThumb_SLIDER.$OriginalWidth());
                    com_sliderThumb_SLIDER.$ScaleSize(expectedWidth, com_sliderThumb_SLIDER.$OriginalHeight());
                    com_sliderThumb_SLIDER.$Elmt.style.left = ((containerWidth - expectedWidth) / 2) + 'px';
                } else {
                    window.setTimeout(scaleSlider, 30);
                }
            }
            scaleSlider();
            $(window).bind('load', scaleSlider);
            $(window).bind('resize', scaleSlider);
            $(window).bind('orientationchange', scaleSlider);
        }
    });
});