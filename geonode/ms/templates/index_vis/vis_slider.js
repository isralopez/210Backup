function setREVStartSize(e) {
	try {
		e.c = jQuery(e.c);
		var i = jQuery(window).width(),
			t = 9999,
			r = 0,
			n = 0,
			l = 0,
			f = 0,
			s = 0,
			h = 0;
		if (e.responsiveLevels && (jQuery.each(e.responsiveLevels, function(e, f) { f > i && (t = r = f, l = e), i > f && f > r && (r = f, n = e) }), t > r && (l = n)), f = e.gridheight[l] || e.gridheight[0] || e.gridheight, s = e.gridwidth[l] || e.gridwidth[0] || e.gridwidth, h = i / s, h = h > 1 ? 1 : h, f = Math.round(h * f), "fullscreen" == e.sliderLayout) { var u = (e.c.width(), jQuery(window).height()); if (void 0 != e.fullScreenOffsetContainer) { var c = e.fullScreenOffsetContainer.split(","); if (c) jQuery.each(c, function(e, i) { u = jQuery(i).length > 0 ? u - jQuery(i).outerHeight(!0) : u }), e.fullScreenOffset.split("%").length > 1 && void 0 != e.fullScreenOffset && e.fullScreenOffset.length > 0 ? u -= jQuery(window).height() * parseInt(e.fullScreenOffset, 0) / 100 : void 0 != e.fullScreenOffset && e.fullScreenOffset.length > 0 && (u -= parseInt(e.fullScreenOffset, 0)) } f = u } else void 0 != e.minHeight && f < e.minHeight && (f = e.minHeight);
		e.c.closest(".rev_slider_wrapper").css({ height: f })
	} catch (d) { console.log("Failure at Presize of Slider:" + d) }
};
// --------------------
var revapi9, tpj;
(function() {
	if (!/loaded|interactive|complete/.test(document.readyState)) document.addEventListener("DOMContentLoaded", onLoad);
	else onLoad();
	function onLoad() {
		if (tpj === undefined) { tpj = jQuery; if ("off" == "on") tpj.noConflict(); }
		if (tpj("#rev_slider_9_1").revolution == undefined) {
			revslider_showDoubleJqueryError("#rev_slider_9_1");
		} else {
			revapi9 = tpj("#rev_slider_9_1").show().revolution({
				sliderType: "standard",
				/* jsFileLocation: "//localhost/cgeo_revslider/revslider/public/assets/js/", /* |<-ADD-MOD [LOCATION] */
				jsFileLocation: "//localhost/cgeo_istmo/js/revslider/",
				sliderLayout: "fullscreen",
				dottedOverlay: "twoxtwo",
				delay: 9000,
				navigation: {
					keyboardNavigation: "off",
					keyboard_direction: "horizontal",
					mouseScrollNavigation: "off",
					mouseScrollReverse: "default",
					onHoverStop: "on",
					touch: {
						touchenabled: "on",
						touchOnDesktop: "off",
						swipe_threshold: 75,
						swipe_min_touches: 1,
						swipe_direction: "horizontal",
						drag_block_vertical: false
					},
					arrows: {
						style: "uranus",
						enable: true,
						hide_onmobile: false,
						hide_onleave: false,
						tmp: '',
						left: {
							h_align: "left",
							v_align: "center",
							h_offset: 10,
							v_offset: 0
						},
						right: {
							h_align: "right",
							v_align: "center",
							h_offset: 10,
							v_offset: 0
						}
					},
					bullets: {
						enable: true,
						hide_onmobile: false,
						style: "hephaistos",
						hide_onleave: false,
						direction: "horizontal",
						h_align: "center",
						v_align: "bottom",
						h_offset: 0,
						v_offset: 30,
						space: 10,
						tmp: ''
					}
				},
				viewPort: {
					enable: true,
					outof: "wait",
					visible_area: "90%",
					presize: false
				},
				visibilityLevels: [1240, 1024, 778, 480],
				gridwidth: 1240,
				gridheight: 868,
				lazyType: "none",
				shadow: 0,
				spinner: "off",
				stopLoop: "off",
				stopAfterLoops: -1,
				stopAtSlide: -1,
				shuffle: "off",
				autoHeight: "off",
				fullScreenAutoWidth: "off",
				fullScreenAlignForce: "off",
				fullScreenOffsetContainer: "",
				fullScreenOffset: "",
				hideThumbsOnMobile: "off",
				hideSliderAtLimit: 0,
				hideCaptionAtLimit: 0,
				hideAllCaptionAtLilmit: 0,
				debugMode: false,
				fallbacks: {
					simplifyAll: "off",
					nextSlideOnWindowFocus: "off",
					disableFocusListener: false,
				}
			});
		}; /* END OF REVAPI CALL */
	}; /* END OF ON LOAD FUNCTION */
}()); /* END OF WRAPPING FUNCTION */