window.__NEXT_REGISTER_PAGE('/app/Home', function() {
    var comp = module.exports = webpackJsonp([18], {
        1646: function(e, t, a) {
            e.exports = a(1647)
        },
        1647: function(e, t, a) {
            "use strict";

            function n(e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var a in e) Object.prototype.hasOwnProperty.call(e, a) && (t[a] = e[a]);
                return t.default = e, t
            }

            function r(e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }
            Object.defineProperty(t, "__esModule", {
                value: !0
            });
            var o = a(22),
                l = r(o),
                s = a(8),
                i = r(s),
                u = a(4),
                c = r(u),
                d = a(23),
                f = r(d),
                m = a(2),
                p = r(m),
                y = a(5),
                h = r(y),
                v = a(3),
                g = r(v),
                b = a(6),
                E = r(b),
                w = a(39),
                P = r(w),
                N = a(0),
                S = r(N),
                k = a(9),
                x = a(132),
                C = a(24),
                _ = r(C),
                R = a(25),
                A = a(451),
                I = n(A),
                V = a(446),
                M = n(V),
                O = a(21),
                D = r(O),
                T = a(73),
                j = r(T),
                L = a(112),
                U = r(L),
                B = a(450),
                Y = r(B),
                F = a(359),
                G = r(F),
                Q = a(445),
                q = r(Q),
                z = a(1648),
                W = r(z),
                J = a(131),
                $ = r(J),
                H = a(174),
                X = r(H),
                Z = a(742),
                K = a(47),
                ee = r(K),
                te = a(408),
                ae = r(te),
                ne = [{
                    tag: "Planet Pulse",
                    title: "View near-real-time data on the planet",
                    intro: "",
                    buttons: [{
                        text: "Launch Planet Pulse",
                        path: "/data/pulse",
                        anchor: !0,
                        className: "-primary"
                    }],
                    background: "url(/static/images/homepage/home-data-bg4.png) 67% center"
                }, {
                    tag: "Explore Data",
                    title: "Access data on the map",
                    intro: "Identify patterns between data sets on the map or download data for analysis.",
                    buttons: [{
                        text: "Explore data",
                        path: "explore",
                        className: "-primary"
                    }],
                    background: "url(/static/images/homepage/home-data-bg1.png)"
                }, {
                    tag: "Dashboards",
                    title: "Create and share visualizations",
                    intro: "Create and share custom visualizations or craft your own personal monitoring system.",
                    buttons: [{
                        text: "Create a dashboard",
                        path: "/myrw/dashboards",
                        anchor: !0,
                        loginRequired: "Log in to create a dashboard",
                        className: "-primary"
                    }],
                    background: "url(/static/images/homepage/home-data-bg2.png)"
                }, {
                    tag: "Alerts",
                    title: "Track data in near-real-time",
                    intro: "Get updates on world events as they unfold.",
                    buttons: [{
                        text: "Sign up for alerts",
                        path: "/myrw/areas",
                        anchor: !0,
                        loginRequired: "Log in to sign up for alerts",
                        className: "-primary"
                    }],
                    background: "url(/static/images/homepage/home-data-bg3.png) 67% center"
                }],
                re = function(e) {
                    function t(e) {
                        (0, p.default)(this, t);
                        var a = (0, h.default)(this, (t.__proto__ || (0, c.default)(t)).call(this, e));
                        return a.handleToggleShareModal = function(e) {
                            a.setState({
                                showNewsletterModal: e
                            })
                        }, a.onVideoStateChange = function(e) {
                            1 === e.data ? a.setState({
                                videoReady: !0
                            }) : a.setState({
                                videoReady: !1
                            })
                        }, a.state = {
                            showNewsletterModal: !1,
                            videoReady: !1,
                            videoHeight: 0,
                            videoWidth: 0
                        }, a
                    }
                    return (0, E.default)(t, e), (0, g.default)(t, null, [{
                        key: "getInitialProps",
                        value: function() {
                            function e(e) {
                                return a.apply(this, arguments)
                            }
                            var a = (0, f.default)(l.default.mark(function e(a) {
                                var n;
                                return l.default.wrap(function(e) {
                                    for (;;) switch (e.prev = e.next) {
                                        case 0:
                                            return e.next = 2, (0, P.default)(t.__proto__ || (0, c.default)(t), "getInitialProps", this).call(this, a);
                                        case 2:
                                            return n = e.sent, a.store.dispatch(I.setSelected(null)), e.next = 6, a.store.dispatch(I.fetchTopics({
                                                filters: {
                                                    "filter[published]": "true"
                                                }
                                            }));
                                        case 6:
                                            return e.next = 8, a.store.dispatch(M.fetchBlogPostsLatest());
                                        case 8:
                                            return e.next = 10, a.store.dispatch(M.fetchBlogPostsSpotlightLatest());
                                        case 10:
                                            return e.abrupt("return", (0, i.default)({}, n));
                                        case 11:
                                        case "end":
                                            return e.stop()
                                    }
                                }, e, this)
                            }));
                            return e
                        }()
                    }, {
                        key: "exploreCardsStatic",
                        value: function() {
                            return ne.map(function(e) {
                                return S.default.createElement("div", {
                                    key: "explore-card-" + e.title + "-" + e.tag,
                                    className: "column small-12 medium-6"
                                }, S.default.createElement(Y.default, {
                                    className: "-alt -clickable",
                                    background: e.background,
                                    clickable: !0,
                                    route: e.buttons[0].path,
                                    anchor: e.buttons[0].anchor
                                }, S.default.createElement("div", null, S.default.createElement("h4", {
                                    className: "tag-name"
                                }, e.tag), S.default.createElement("h3", {
                                    className: "title"
                                }, e.title), S.default.createElement("p", null, e.intro)), S.default.createElement("div", {
                                    className: "buttons -align-center"
                                }, e.buttons.map(function(e) {
                                    return e.loginRequired ? S.default.createElement(X.default, {
                                        key: e.path,
                                        text: e.loginRequired
                                    }, S.default.createElement("a", {
                                        href: e.path,
                                        className: "c-btn -alt " + e.className
                                    }, e.text)) : e.anchor ? S.default.createElement("a", {
                                        href: e.path,
                                        key: e.path,
                                        className: "c-btn -alt " + e.className
                                    }, e.text) : S.default.createElement(k.Link, {
                                        route: e.path,
                                        key: e.path
                                    }, S.default.createElement("a", {
                                        className: "c-btn -alt " + e.className
                                    }, e.text))
                                }))))
                            })
                        }
                    }]), (0, g.default)(t, [{
                        key: "render",
                        value: function() {
                            var e = this,
                                a = this.props.responsive,
                                n = this.state.videoReady,
                                r = t.exploreCardsStatic(),
                                o = {
                                    playerVars: {
                                        modestbranding: 1,
                                        autoplay: 1,
                                        controls: 0,
                                        showinfo: 0,
                                        rel: 0,
                                        loop: 1,
                                        playlist: "XryMlA-8IwE"
                                    }
                                };
                            return S.default.createElement(j.default, {
                                title: "Plataforma Logística",
                                description: "...",
                                url: this.props.url,
                                user: this.props.user,
                                className: "page-home"
                            }, S.default.createElement("div", {
                                className: "video-intro"
                            }, /*S.default.createElement($.default, {
                                minDeviceWidth: x.breakpoints.medium,
                                values: {
                                    deviceWidth: a.fakeWidth
                                }
                            }, S.default.createElement("div", {
                                className: "video-foreground " + (n ? "-ready" : "")
                            }, (0, Z.browserSupported)() && S.default.createElement(W.default, {
                                videoId: "XryMlA-8IwE",
                                opts: o,
                                onStateChange: this.onVideoStateChange
                            }))),*/ S.default.createElement("div", {
                                className: "video-text"
                            }, S.default.createElement("div", null, S.default.createElement("h1", null, "Monitoring the Planet’s Pulse"), S.default.createElement("p", null, "Plataforma Logística"), S.default.createElement(k.Link, {
                                route: "explore"
                            }, S.default.createElement("a", {
                                className: "c-button -alt -primary"
                            }, "Explore data"))))), S.default.createElement("section", {
                                id: "discoverIsights",
                                className: "l-section"
                            }, S.default.createElement("div", {
                                className: "l-container"
                            }, S.default.createElement("header", null, S.default.createElement("div", {
                                className: "row"
                            }, S.default.createElement("div", {
                                className: "column small-12 medium-8"
                            }, S.default.createElement("h2", null, "Latest stories"), S.default.createElement("p", null, "Plataforma Logística")))), S.default.createElement(q.default, null), S.default.createElement("div", {
                                className: "-text-center"
                            }, S.default.createElement("div", {
                                className: "row"
                            }, S.default.createElement("div", {
                                className: "column small-12 medium-12"
                            }, S.default.createElement("div", {
                                className: " buttons"
                            }, S.default.createElement("button", {
                                className: "c-button -secondary join-us-button",
                                onClick: function() {
                                    return e.handleToggleShareModal(!0)
                                }
                            }, "Subscribe to our newsletter", S.default.createElement(ee.default, {
                                isOpen: this.state.showNewsletterModal,
                                className: "-medium",
                                onRequestClose: function() {
                                    return e.handleToggleShareModal(!1)
                                }
                            }, S.default.createElement(ae.default, null))), S.default.createElement("a", {
                                href: "/blog",
                                className: "c-btn -primary"
                            }, "More stories"))))))), S.default.createElement("section", {
                                className: "l-section -secondary"
                            }, S.default.createElement("div", {
                                className: "l-container"
                            }, S.default.createElement("header", null, S.default.createElement("div", {
                                className: "row"
                            }, S.default.createElement("div", {
                                className: "column small-12 medium-8"
                            }, S.default.createElement("h2", null, "Topics"), S.default.createElement("p", null, "Find facts and figures on people and the environment, ", S.default.createElement("br", null), "or visualize the latest data on the world today.")))), S.default.createElement("div", {
                                className: "topics-container"
                            }, S.default.createElement("div", {
                                className: "row"
                            }, S.default.createElement("div", {
                                className: "column small-12"
                            }, S.default.createElement(G.default, {
                                onSelect: function(e) {
                                    var t = e.slug;
                                    k.Router.pushRoute("topics_detail", {
                                        id: t
                                    }).then(function() {
                                        window.scrollTo(0, 0)
                                    })
                                }
                            })))))), S.default.createElement("section", {
                                className: "l-section"
                            }, S.default.createElement("div", {
                                className: "l-container"
                            }, S.default.createElement("header", null, S.default.createElement("div", {
                                className: "row"
                            }, S.default.createElement("div", {
                                className: "column small-12 medium-8"
                            }, S.default.createElement("h2", null, "Dive into the data"), S.default.createElement("p", null, "Create overlays, share visualizations, and subscribe to updates on your favorite issues.")))), S.default.createElement("div", {
                                className: "explore-cards"
                            }, S.default.createElement("div", {
                                className: "row"
                            }, r)))), S.default.createElement(U.default, {
                                className: "get-involved",
                                bgImage: "/static/images/backgrounds/mod_getInvolved.jpg"
                            }, S.default.createElement("div", {
                                className: "l-container"
                            }, S.default.createElement("div", {
                                className: "l-row row"
                            }, S.default.createElement("div", {
                                className: "column small-12 medium-8"
                            }, S.default.createElement("h2", null, "Get involved"), S.default.createElement("p", null, "Use data to drive change in your community and around the world."))), S.default.createElement("div", {
                                className: "buttons"
                            }, S.default.createElement("div", {
                                className: "l-row row"
                            }, S.default.createElement("div", {
                                className: "column small-12 medium-3"
                            }, S.default.createElement(k.Link, {
                                route: "get_involved_detail",
                                params: {
                                    id: "join-community",
                                    source: "home"
                                }
                            }, S.default.createElement("a", {
                                className: "c-btn -b -alt -fullwidth"
                            }, "Join the community"))), S.default.createElement("div", {
                                className: "column small-12 medium-3"
                            }, S.default.createElement(k.Link, {
                                route: "get_involved_detail",
                                params: {
                                    id: "contribute-data",
                                    source: "home"
                                }
                            }, S.default.createElement("a", {
                                className: "c-btn -b -alt -fullwidth"
                            }, "Contribute data"))), S.default.createElement("div", {
                                className: "column small-12 medium-3"
                            }, S.default.createElement(k.Link, {
                                route: "get_involved_detail",
                                params: {
                                    id: "submit-an-insight",
                                    source: "home"
                                }
                            }, S.default.createElement("a", {
                                className: "c-btn -b -alt -fullwidth"
                            }, "Suggest a story"))), S.default.createElement("div", {
                                className: "column small-12 medium-3"
                            }, S.default.createElement(k.Link, {
                                route: "get_involved_detail",
                                params: {
                                    id: "develop-app",
                                    source: "home"
                                }
                            }, S.default.createElement("a", {
                                className: "c-btn -b -alt -fullwidth"
                            }, "Develop your app"))))))))
                        }
                    }]), t
                }(D.default);
            re.displayName = "Home";
            var oe = function(e) {
                return {
                    responsive: e.responsive
                }
            };
            t.default = (0, _.default)(R.initStore, oe, null)(re)
        },
        1648: function(e, t, a) {
            "use strict";

            function n(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            function r(e, t) {
                if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !t || "object" != typeof t && "function" != typeof t ? e : t
            }

            function o(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }

            function l(e, t) {
                if (e.videoId !== t.videoId) return !0;
                var a = e.opts.playerVars || {},
                    n = t.opts.playerVars || {};
                return a.start !== n.start || a.end !== n.end
            }

            function s(e) {
                return b({}, e, {
                    playerVars: b({}, e.playerVars, {
                        autoplay: 0,
                        start: 0,
                        end: 0
                    })
                })
            }

            function i(e, t) {
                return !y()(s(e.opts), s(t.opts))
            }

            function u(e, t) {
                return e.id === t.id || e.className === t.className
            }
            Object.defineProperty(t, "__esModule", {
                value: !0
            });
            var c = a(1),
                d = a.n(c),
                f = a(0),
                m = a.n(f),
                p = a(38),
                y = a.n(p),
                h = a(1649),
                v = a.n(h),
                g = function() {
                    function e(e, t) {
                        for (var a = 0; a < t.length; a++) {
                            var n = t[a];
                            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                        }
                    }
                    return function(t, a, n) {
                        return a && e(t.prototype, a), n && e(t, n), t
                    }
                }(),
                b = Object.assign || function(e) {
                    for (var t = 1; t < arguments.length; t++) {
                        var a = arguments[t];
                        for (var n in a) Object.prototype.hasOwnProperty.call(a, n) && (e[n] = a[n])
                    }
                    return e
                },
                E = function(e) {
                    function t(e) {
                        n(this, t);
                        var a = r(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                        return a.onPlayerReady = function(e) {
                            return a.props.onReady(e)
                        }, a.onPlayerError = function(e) {
                            return a.props.onError(e)
                        }, a.onPlayerStateChange = function(e) {
                            switch (a.props.onStateChange(e), e.data) {
                                case t.PlayerState.ENDED:
                                    a.props.onEnd(e);
                                    break;
                                case t.PlayerState.PLAYING:
                                    a.props.onPlay(e);
                                    break;
                                case t.PlayerState.PAUSED:
                                    a.props.onPause(e);
                                    break;
                                default:
                                    return
                            }
                        }, a.onPlayerPlaybackRateChange = function(e) {
                            return a.props.onPlaybackRateChange(e)
                        }, a.onPlayerPlaybackQualityChange = function(e) {
                            return a.props.onPlaybackQualityChange(e)
                        }, a.createPlayer = function() {
                            if ("undefined" != typeof document) {
                                var e = b({}, a.props.opts, {
                                    videoId: a.props.videoId
                                });
                                a.internalPlayer = v()(a.container, e), a.internalPlayer.on("ready", a.onPlayerReady), a.internalPlayer.on("error", a.onPlayerError), a.internalPlayer.on("stateChange", a.onPlayerStateChange), a.internalPlayer.on("playbackRateChange", a.onPlayerPlaybackRateChange), a.internalPlayer.on("playbackQualityChange", a.onPlayerPlaybackQualityChange)
                            }
                        }, a.resetPlayer = function() {
                            return a.internalPlayer.destroy().then(a.createPlayer)
                        }, a.updatePlayer = function() {
                            a.internalPlayer.getIframe().then(function(e) {
                                e.setAttribute("id", a.props.id), e.setAttribute("class", a.props.className)
                            })
                        }, a.updateVideo = function() {
                            if (void 0 === a.props.videoId || null === a.props.videoId) return void a.internalPlayer.stopVideo();
                            var e = !1,
                                t = {
                                    videoId: a.props.videoId
                                };
                            if ("playerVars" in a.props.opts && (e = 1 === a.props.opts.playerVars.autoplay, "start" in a.props.opts.playerVars && (t.startSeconds = a.props.opts.playerVars.start), "end" in a.props.opts.playerVars && (t.endSeconds = a.props.opts.playerVars.end)), e) return void a.internalPlayer.loadVideoById(t);
                            a.internalPlayer.cueVideoById(t)
                        }, a.refContainer = function(e) {
                            a.container = e
                        }, a.container = null, a.internalPlayer = null, a
                    }
                    return o(t, e), g(t, [{
                        key: "componentDidMount",
                        value: function() {
                            this.createPlayer()
                        }
                    }, {
                        key: "componentDidUpdate",
                        value: function(e) {
                            u(e, this.props) && this.updatePlayer(), i(e, this.props) && this.resetPlayer(), l(e, this.props) && this.updateVideo()
                        }
                    }, {
                        key: "componentWillUnmount",
                        value: function() {
                            this.internalPlayer.destroy()
                        }
                    }, {
                        key: "render",
                        value: function() {
                            return m.a.createElement("span", null, m.a.createElement("div", {
                                id: this.props.id,
                                className: this.props.className,
                                ref: this.refContainer
                            }))
                        }
                    }]), t
                }(m.a.Component);
            E.propTypes = {
                videoId: d.a.string,
                id: d.a.string,
                className: d.a.string,
                opts: d.a.object,
                onReady: d.a.func,
                onError: d.a.func,
                onPlay: d.a.func,
                onPause: d.a.func,
                onEnd: d.a.func,
                onStateChange: d.a.func,
                onPlaybackRateChange: d.a.func,
                onPlaybackQualityChange: d.a.func
            }, E.defaultProps = {
                opts: {},
                onReady: function() {},
                onError: function() {},
                onPlay: function() {},
                onPause: function() {},
                onEnd: function() {},
                onStateChange: function() {},
                onPlaybackRateChange: function() {},
                onPlaybackQualityChange: function() {}
            }, E.PlayerState = {
                UNSTARTED: -1,
                ENDED: 0,
                PLAYING: 1,
                PAUSED: 2,
                BUFFERING: 3,
                CUED: 5
            }, t.default = E
        },
        1649: function(e, t, a) {
            "use strict";

            function n(e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }
            Object.defineProperty(t, "__esModule", {
                value: !0
            });
            var r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                    return typeof e
                } : function(e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                },
                o = a(1650),
                l = n(o),
                s = a(1651),
                i = n(s),
                u = a(1653),
                c = n(u),
                d = void 0;
            t.default = function(e) {
                var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
                    a = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
                    n = (0, l.default)();
                if (d || (d = (0, i.default)(n)), t.events) throw new Error("Event handlers cannot be overwritten.");
                if ("string" == typeof e && !document.getElementById(e)) throw new Error('Element "' + e + '" does not exist.');
                t.events = c.default.proxyEvents(n);
                var o = new Promise(function(a) {
                        if ("string" == typeof e || e instanceof HTMLElement) d.then(function(r) {
                            var o = new r.Player(e, t);
                            return n.on("ready", function() {
                                a(o)
                            }), null
                        });
                        else {
                            if (!("object" === (void 0 === e ? "undefined" : r(e)) && e.playVideo instanceof Function)) throw new TypeError("Unexpected state.");
                            //a(e)
                        }
                    }),
                    s = c.default.promisifyPlayer(o, a);
                return s.on = n.on, s.off = n.off, s
            }, e.exports = t.default
        },
        1650: function(e, t, a) {
            (function(t) {
                /**
                 * @link https://github.com/gajus/sister for the canonical source repository
                 * @license https://github.com/gajus/sister/blob/master/LICENSE BSD 3-Clause
                 */
                function a() {
                    var e = {},
                        t = {};
                    return e.on = function(e, a) {
                        var n = {
                            name: e,
                            handler: a
                        };
                        return t[e] = t[e] || [], t[e].unshift(n), n
                    }, e.off = function(e) {
                        var a = t[e.name].indexOf(e); - 1 != a && t[e.name].splice(a, 1)
                    }, e.trigger = function(e, a) {
                        var n, r = t[e];
                        if (r)
                            for (n = r.length; n--;) r[n].handler(a)
                    }, e
                }
                t.gajus = t.gajus || {}, t.gajus.Sister = a, e.exports = a
            }).call(t, a(40))
        },
        1651: function(e, t, a) {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: !0
            });
            var n = a(1652),
                r = function(e) {
                    return e && e.__esModule ? e : {
                        default: e
                    }
                }(n);
            t.default = function(e) {
                var t = new Promise(function(e) {
                        if (window.YT && window.YT.Player && window.YT.Player instanceof Function) return void e(window.YT);
                        var t = window.onYouTubeIframeAPIReady;
                        window.onYouTubeIframeAPIReady = function() {
                            t && t(), e(window.YT)
                        }
                    }),
                    a = "http:" === window.location.protocol ? "http:" : "https:";
                return (0, r.default)(a + "//www.youtube.com/iframe_api", function(t) {
                    t && e.trigger("error", t)
                }), t
            }, e.exports = t.default
        },
        1652: function(e, t) {
            function a(e, t) {
                for (var a in t) e.setAttribute(a, t[a])
            }

            function n(e, t) {
                e.onload = function() {
                    this.onerror = this.onload = null, t(null, e)
                }, e.onerror = function() {
                    this.onerror = this.onload = null, t(new Error("Failed to load " + this.src), e)
                }
            }

            function r(e, t) {
                e.onreadystatechange = function() {
                    "complete" != this.readyState && "loaded" != this.readyState || (this.onreadystatechange = null, t(null, e))
                }
            }
            e.exports = function(e, t, o) {
                var l = document.head || document.getElementsByTagName("head")[0],
                    s = document.createElement("script");
                "function" == typeof t && (o = t, t = {}), t = t || {}, o = o || function() {}, s.type = t.type || "text/javascript", s.charset = t.charset || "utf8", s.async = !("async" in t) || !!t.async, s.src = e, t.attrs && a(s, t.attrs), t.text && (s.text = "" + t.text), ("onload" in s ? n : r)(s, o), s.onload || n(s, o), l.appendChild(s)
            }
        },
        1653: function(e, t, a) {
            "use strict";

            function n(e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }
            Object.defineProperty(t, "__esModule", {
                value: !0
            });
            var r = a(1654),
                o = n(r),
                l = a(1657),
                s = n(l),
                i = a(1658),
                u = n(i),
                c = a(1659),
                d = n(c),
                f = (0, o.default)("youtube-player"),
                m = {};
            m.proxyEvents = function(e) {
                var t = {},
                    a = !0,
                    n = !1,
                    r = void 0;
                try {
                    for (var o, l = u.default[Symbol.iterator](); !(a = (o = l.next()).done); a = !0) {
                        var s = o.value;
                        ! function(a) {
                            var n = "on" + a.slice(0, 1).toUpperCase() + a.slice(1);
                            t[n] = function(t) {
                                f('event "%s"', n, t), e.trigger(a, t)
                            }
                        }(s)
                    }
                } catch (e) {
                    n = !0, r = e
                } finally {
                    try {
                        !a && l.return && l.return()
                    } finally {
                        if (n) throw r
                    }
                }
                return t
            }, m.promisifyPlayer = function(e) {
                var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
                    a = {},
                    n = !0,
                    r = !1,
                    o = void 0;
                try {
                    for (var l, i = s.default[Symbol.iterator](); !(n = (l = i.next()).done); n = !0) {
                        var u = l.value;
                        ! function(n) {
                            t && d.default[n] ? a[n] = function() {
                                for (var t = arguments.length, a = Array(t), r = 0; r < t; r++) a[r] = arguments[r];
                                return e.then(function(e) {
                                    var t = d.default[n],
                                        r = e.getPlayerState(),
                                        o = e[n].apply(e, a);
                                    return t.stateChangeRequired || Array.isArray(t.acceptableStates) && -1 === t.acceptableStates.indexOf(r) ? new Promise(function(a) {
                                        var n = function n() {
                                            var r = e.getPlayerState(),
                                                o = void 0;
                                            "number" == typeof t.timeout && (o = setTimeout(function() {
                                                e.removeEventListener("onStateChange", n), a()
                                            }, t.timeout)), Array.isArray(t.acceptableStates) && -1 !== t.acceptableStates.indexOf(r) && (e.removeEventListener("onStateChange", n), clearTimeout(o), a())
                                        };
                                        e.addEventListener("onStateChange", n)
                                    }).then(function() {
                                        return o
                                    }) : o
                                })
                            } : a[n] = function() {
                                for (var t = arguments.length, a = Array(t), r = 0; r < t; r++) a[r] = arguments[r];
                                return e.then(function(e) {
                                    return e[n].apply(e, a)
                                })
                            }
                        }(u)
                    }
                } catch (e) {
                    r = !0, o = e
                } finally {
                    try {
                        !n && i.return && i.return()
                    } finally {
                        if (r) throw o
                    }
                }
                return a
            }, t.default = m, e.exports = t.default
        },
        1654: function(e, t, a) {
            (function(n) {
                function r() {
                    return !("undefined" == typeof window || !window.process || "renderer" !== window.process.type) || ("undefined" != typeof document && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || "undefined" != typeof window && window.console && (window.console.firebug || window.console.exception && window.console.table) || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/))
                }

                function o(e) {
                    var a = this.useColors;
                    if (e[0] = (a ? "%c" : "") + this.namespace + (a ? " %c" : " ") + e[0] + (a ? "%c " : " ") + "+" + t.humanize(this.diff), a) {
                        var n = "color: " + this.color;
                        e.splice(1, 0, n, "color: inherit");
                        var r = 0,
                            o = 0;
                        e[0].replace(/%[a-zA-Z%]/g, function(e) {
                            "%%" !== e && (r++, "%c" === e && (o = r))
                        }), e.splice(o, 0, n)
                    }
                }

                function l() {
                    return "object" == typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments)
                }

                function s(e) {
                    try {
                        null == e ? t.storage.removeItem("debug") : t.storage.debug = e
                    } catch (e) {}
                }

                function i() {
                    var e;
                    try {
                        e = t.storage.debug
                    } catch (e) {}
                    return !e && void 0 !== n && "env" in n && (e = n.env.DEBUG), e
                }
                t = e.exports = a(1655), t.log = l, t.formatArgs = o, t.save = s, t.load = i, t.useColors = r, t.storage = "undefined" != typeof chrome && void 0 !== chrome.storage ? chrome.storage.local : function() {
                    try {
                        return window.localStorage
                    } catch (e) {}
                }(), t.colors = ["lightseagreen", "forestgreen", "goldenrod", "dodgerblue", "darkorchid", "crimson"], t.formatters.j = function(e) {
                    try {
                        return JSON.stringify(e)
                    } catch (e) {
                        return "[UnexpectedJSONParseError]: " + e.message
                    }
                }, t.enable(i())
            }).call(t, a(82))
        },
        1655: function(e, t, a) {
            function n(e) {
                var a, n = 0;
                for (a in e) n = (n << 5) - n + e.charCodeAt(a), n |= 0;
                return t.colors[Math.abs(n) % t.colors.length]
            }

            function r(e) {
                function a() {
                    if (a.enabled) {
                        var e = a,
                            n = +new Date,
                            r = n - (u || n);
                        e.diff = r, e.prev = u, e.curr = n, u = n;
                        for (var o = new Array(arguments.length), l = 0; l < o.length; l++) o[l] = arguments[l];
                        o[0] = t.coerce(o[0]), "string" != typeof o[0] && o.unshift("%O");
                        var s = 0;
                        o[0] = o[0].replace(/%([a-zA-Z%])/g, function(a, n) {
                            if ("%%" === a) return a;
                            s++;
                            var r = t.formatters[n];
                            if ("function" == typeof r) {
                                var l = o[s];
                                a = r.call(e, l), o.splice(s, 1), s--
                            }
                            return a
                        }), t.formatArgs.call(e, o);
                        (a.log || t.log || console.log.bind(console)).apply(e, o)
                    }
                }
                return a.namespace = e, a.enabled = t.enabled(e), a.useColors = t.useColors(), a.color = n(e), "function" == typeof t.init && t.init(a), a
            }

            function o(e) {
                t.save(e), t.names = [], t.skips = [];
                for (var a = ("string" == typeof e ? e : "").split(/[\s,]+/), n = a.length, r = 0; r < n; r++) a[r] && (e = a[r].replace(/\*/g, ".*?"), "-" === e[0] ? t.skips.push(new RegExp("^" + e.substr(1) + "$")) : t.names.push(new RegExp("^" + e + "$")))
            }

            function l() {
                t.enable("")
            }

            function s(e) {
                var a, n;
                for (a = 0, n = t.skips.length; a < n; a++)
                    if (t.skips[a].test(e)) return !1;
                for (a = 0, n = t.names.length; a < n; a++)
                    if (t.names[a].test(e)) return !0;
                return !1
            }

            function i(e) {
                return e instanceof Error ? e.stack || e.message : e
            }
            t = e.exports = r.debug = r.default = r, t.coerce = i, t.disable = l, t.enable = o, t.enabled = s, t.humanize = a(1656), t.names = [], t.skips = [], t.formatters = {};
            var u
        },
        1656: function(e, t) {
            function a(e) {
                if (e = String(e), !(e.length > 100)) {
                    var t = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(e);
                    if (t) {
                        var a = parseFloat(t[1]);
                        switch ((t[2] || "ms").toLowerCase()) {
                            case "years":
                            case "year":
                            case "yrs":
                            case "yr":
                            case "y":
                                return a * c;
                            case "days":
                            case "day":
                            case "d":
                                return a * u;
                            case "hours":
                            case "hour":
                            case "hrs":
                            case "hr":
                            case "h":
                                return a * i;
                            case "minutes":
                            case "minute":
                            case "mins":
                            case "min":
                            case "m":
                                return a * s;
                            case "seconds":
                            case "second":
                            case "secs":
                            case "sec":
                            case "s":
                                return a * l;
                            case "milliseconds":
                            case "millisecond":
                            case "msecs":
                            case "msec":
                            case "ms":
                                return a;
                            default:
                                return
                        }
                    }
                }
            }

            function n(e) {
                return e >= u ? Math.round(e / u) + "d" : e >= i ? Math.round(e / i) + "h" : e >= s ? Math.round(e / s) + "m" : e >= l ? Math.round(e / l) + "s" : e + "ms"
            }

            function r(e) {
                return o(e, u, "day") || o(e, i, "hour") || o(e, s, "minute") || o(e, l, "second") || e + " ms"
            }

            function o(e, t, a) {
                if (!(e < t)) return e < 1.5 * t ? Math.floor(e / t) + " " + a : Math.ceil(e / t) + " " + a + "s"
            }
            var l = 1e3,
                s = 60 * l,
                i = 60 * s,
                u = 24 * i,
                c = 365.25 * u;
            e.exports = function(e, t) {
                t = t || {};
                var o = typeof e;
                if ("string" === o && e.length > 0) return a(e);
                if ("number" === o && !1 === isNaN(e)) return t.long ? r(e) : n(e);
                throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(e))
            }
        },
        1657: function(e, t, a) {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.default = ["cueVideoById", "loadVideoById", "cueVideoByUrl", "loadVideoByUrl", "playVideo", "pauseVideo", "stopVideo", "getVideoLoadedFraction", "cuePlaylist", "loadPlaylist", "nextVideo", "previousVideo", "playVideoAt", "setShuffle", "setLoop", "getPlaylist", "getPlaylistIndex", "setOption", "mute", "unMute", "isMuted", "setVolume", "getVolume", "seekTo", "getPlayerState", "getPlaybackRate", "setPlaybackRate", "getAvailablePlaybackRates", "getPlaybackQuality", "setPlaybackQuality", "getAvailableQualityLevels", "getCurrentTime", "getDuration", "removeEventListener", "getVideoUrl", "getVideoEmbedCode", "getOptions", "getOption", "addEventListener", "destroy", "setSize", "getIframe"], e.exports = t.default
        },
        1658: function(e, t, a) {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.default = ["ready", "stateChange", "playbackQualityChange", "playbackRateChange", "error", "apiChange", "volumeChange"], e.exports = t.default
        },
        1659: function(e, t, a) {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: !0
            });
            var n = a(1660),
                r = function(e) {
                    return e && e.__esModule ? e : {
                        default: e
                    }
                }(n);
            t.default = {
                pauseVideo: {
                    acceptableStates: [r.default.ENDED, r.default.PAUSED],
                    stateChangeRequired: !1
                },
                playVideo: {
                    acceptableStates: [r.default.ENDED, r.default.PLAYING],
                    stateChangeRequired: !1
                },
                seekTo: {
                    acceptableStates: [r.default.ENDED, r.default.PLAYING, r.default.PAUSED],
                    stateChangeRequired: !0,
                    timeout: 3e3
                }
            }, e.exports = t.default
        },
        1660: function(e, t, a) {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.default = {
                BUFFERING: 3,
                ENDED: 0,
                PAUSED: 2,
                PLAYING: 1,
                UNSTARTED: -1,
                VIDEO_CUED: 5
            }, e.exports = t.default
        }
    }, [1646]);
    return {
        page: comp.default
    }
})