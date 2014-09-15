(function(win, ua) {

    var platform = {},
        browser = {},
        device = {},
        support = {},
        match,
        lastOrient = (win.innerWidth > win.innerHeight),
        lastWidth = win.innerWidth,
        devicePixelRatio = 1;

    if (match = ua.match(/Android\s+([\d.]+)/)) {
        platform.android = match[1];
    } else if (ua.match(/\sHTC[\s_].*AppleWebKit/)) {
        // фэйковый десктопный UA по умолчанию у некоторых HTC (например, HTC Sensation)
        platform.android = '2.3';
    } else if (match = ua.match(/iPhone\sOS\s([\d_]+)/)) {
        platform.ios = match[1].replace(/_/g, '.');
        device.iphone = true;
    } else if (match = ua.match(/iPad.*OS\s([\d_]+)/)) {
        platform.ios = match[1].replace(/_/g, '.');
        device.ipad = true;
    } else if (match = ua.match(/Bada\/([\d.]+)/)) {
        platform.bada = match[1];
    } else if (match = ua.match(/Windows\sPhone[^\d]*\s([\d.]+)/)) {
        platform.wp = match[1];
    } else if (match = ua.match(/MSIE\s9/)) {
        platform.wp = '7.5';
    } else {
        platform.other = true;
    }

    if (window.opera) {
        browser.opera = window.opera.version();
    } else if (match = ua.match(/\s(CrMo|Chrome)\/([\d.]+)/)) {
        browser.chrome = match[2];
    }

    if (navigator.connection) {
        switch(navigator.connection.type) {
            case navigator.connection.ETHERNET: support.connection = 'wifi'; break;
            case navigator.connection.WIFI: support.connection = 'wifi'; break;
            case navigator.connection.CELL_3G: support.connection = '3g'; break;
            case navigator.connection.CELL_2G: support.connection = '2g'; break;
        }
    }

    support._videoElement = document.createElement('video');
    support.video = !!(support._videoElement.canPlayType && support._videoElement.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"').replace(/no/, ''));

    support.svg = !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;

    if (navigator.plugins && navigator.plugins.length) {
        var plugin;

        for(var i = navigator.plugins.length; i--;) {
            plugin = navigator.plugins[i];

            if (plugin.name == 'Shockwave Flash') {
                var match;

                if (match = plugin.description.match(/Flash ([\d.]+)/)) {
                    support.flash = match[1];
                    break;
                }
            }
        }
    }

    // http://stackoverflow.com/questions/16383503/window-devicepixelratio-does-not-work-in-ie-10-mobile
    if ('deviceXDPI' in screen && 'logicalXDPI' in screen) {
        // Internet Explorer
        devicePixelRatio = screen.deviceXDPI / screen.logicalXDPI;
    } else if ('devicePixelRatio' in window) {
        // Standard way
        devicePixelRatio = window.devicePixelRatio;
    }

    // http://stackoverflow.com/a/6603537
    $(win).bind('resize', function() {
        setTimeout(function() {
            var width = win.innerWidth,
                height = win.innerHeight,
                landscape = (width > height);

            // http://alxgbsn.co.uk/2012/08/27/trouble-with-web-browser-orientation/
            // check previous device width to disallow Android shrink page and change orientation on opening software keyboard
            if (landscape !== lastOrient && width !== lastWidth) {
                $(win).trigger('orientchange', {
                    landscape: landscape,
                    width: width,
                    height: height
                });

                lastOrient = landscape;
                lastWidth = width;
            }
        }, 400);
    });

    /**
     * Block for gathering and providing UserAgent information
     */
    BEM.DOM.decl('i-ua', {

        onSetMod: {

            js: function() {

                var that = this,
                    self = that.__self,
                    html = document.querySelector('html');

                that
                    .setMod('platform',
                        self.ios ? 'ios' :
                        self.android ? 'android' :
                        self.bada ? 'bada' :
                        self.wp ? 'wp' :
                        self.opera ? 'opera' :
                        'other'
                    )
                    .setMod('browser',
                        self.opera ? 'opera' :
                        self.chrome ? 'chrome' :
                        ''
                    )
                    .setMod('ios', self.ios ? self.ios.charAt(0) : '')
                    .setMod('android', self.android ? self.android.charAt(0) : '')
                    .setMod('ios-subversion', self.ios ? self.ios.match(/(\d\.\d)/)[1].replace('.', '') : '')
                    .setMod('screen-size', self.screenSize)
                    .setMod('orient', self.landscape ? 'landscape' : 'portrait');

                     // Для Windows Phone ставим _inlinesvg_no. LEGO-9072.
                     self.wp && html.setAttribute('class', html.getAttribute('class').replace('i-ua_inlinesvg_yes', 'i-ua_inlinesvg_no'));

                this.bindToWin('orientchange', function(e, data) {
                    self.width = data.width;
                    self.height = data.height;
                    self.landscape = data.landscape;
                    that.setMod('orient', data.landscape ? 'landscape' : 'portrait');
                });

            }

        }

    },{

        ua: ua,
        ios: platform.ios,
        iphone: device.iphone,
        ipad: device.ipad,
        android: platform.android,
        bada: platform.bada,
        wp: platform.wp,
        other: platform.other,
        opera: browser.opera,
        chrome: browser.chrome,
        screenSize: screen.width > 320 ? 'large' : screen.width < 320 ? 'small' : 'normal',
        dpr: devicePixelRatio,
        connection: support.connection,
        flash: support.flash,
        video: support.video,
        svg: support.svg,
        width: win.innerWidth,
        height: win.innerHeight,
        landscape: lastOrient

    });

})(window, navigator.userAgent);
