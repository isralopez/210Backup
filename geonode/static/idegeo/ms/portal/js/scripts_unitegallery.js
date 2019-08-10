/***************************************************************
    Unite Gallery - http://unitegallery.net/
                    https://github.com/vvvmax/unitegallery
***************************************************************/
jQuery(function($) {
    'use strict';
    $(document).ready(function() {
        /*******************************************************
            COM_UNITEGALLERY
        *******************************************************/
        if ($('.com_unitegallery').length) {
            jQuery('#com_unitegallery').unitegallery({
                gallery_theme: 'compact',
                // THEME-OPTIONS
                theme_panel_position: 'bottom',
                theme_hide_panel_under_width: 480,
                // GALLERY-OPTIONS
                gallery_width: 1280,
                gallery_height: 600,
                gallery_min_width: 400,
                gallery_min_height: 300,
                gallery_skin: 'alexis',
                gallery_images_preload_type: 'minimal',
                gallery_autoplay: true,
                gallery_play_interval: 8000,
                gallery_pause_on_mouseover: true,
                gallery_control_thumbs_mousewheel: false,
                gallery_control_keyboard: true,
                gallery_carousel: true,
                gallery_preserve_ratio: true,
                gallery_debug_errors: false,
                gallery_background_color: '#000000',
                // SLIDER-OPTIONS
                slider_transition: 'fade',
                slider_transition_speed: 600,
                slider_transition_easing: 'easeInOutQuad',
                slider_control_swipe: true,
                slider_control_zoom: false,
                slider_zoom_max_ratio: 6,
                slider_loader_type: 1,
                slider_loader_color: 'white',
                slider_enable_arrows: false,
                slider_enable_progress_indicator: true,
                slider_progress_indicator_type: 'bar',
                slider_progress_indicator_align_hor: 'left',
                slider_progress_indicator_align_vert: 'bottom',
                slider_progress_indicator_offset_hor: 0,
                slider_progress_indicator_offset_vert: 0,
                slider_progressbar_color: '#EDD11D',
                slider_progressbar_opacity: 0.60,
                slider_progressbar_line_width: 4,
                slider_enable_play_button: true,
                slider_play_button_skin: '',
                slider_play_button_align_hor: 'right',
                slider_play_button_align_vert: 'bottom',
                slider_play_button_offset_hor: 20,
                slider_play_button_offset_vert: 20,
                slider_enable_fullscreen_button: false,
                slider_enable_zoom_panel: false,
                slider_enable_text_panel: false,
                // THUMBS-OPTIONS
                thumb_width: 120,
                thumb_height: 50,
                thumb_fixed_size: true,
                thumb_border_effect: true,
                thumb_border_width: 0,
                thumb_border_color: '#000000',
                thumb_over_border_width: 0,
                thumb_over_border_color: '#D9D9D9',
                thumb_selected_border_width: 1,
                thumb_selected_border_color: '#D9D9D9',
                thumb_color_overlay_effect: true,
                thumb_overlay_color: '#000000',
                thumb_overlay_opacity: 0.6,
                thumb_overlay_reverse: false,
                // STRIPT-THUMBS-PANEL-OPTIONS
                strippanel_padding_top: 5,
                strippanel_padding_bottom: 5,
                strippanel_padding_left: 0,
                strippanel_padding_right: 0,
                strippanel_enable_buttons: true,
                strippanel_buttons_skin: '',
                strippanel_padding_buttons: 2,
                strippanel_buttons_role: 'scroll_strip',
                strippanel_enable_handle: false,
                strippanel_background_color: '#000000',
                strip_thumbs_align: 'left',
                strip_space_between_thumbs: 5,
                strip_thumb_touch_sensetivity: 15,
                strip_scroll_to_thumb_duration: 500,
                strip_scroll_to_thumb_easing: 'easeOutCubic',
                strip_control_avia: false,
                strip_control_touch: true,
            });
        }
    });
});