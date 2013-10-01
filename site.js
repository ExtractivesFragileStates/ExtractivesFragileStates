---
---
{% include ext/jquery.min.js %}

;(function(context) {

    var eafs = {}

    eafs.global = function() {
        function scroll(el){
            $('html, body').animate({
                scrollTop: $(el).offset().top
            }, 500);
        }

        $('a[data-scroll]').click(function() {
            var to = $(this).attr('href');
            scroll(to);
            return false;
        });

        var $toggle = $('#toggle');

        // On mobile view this toggles the
        // navigation from the right.
        $toggle.click(function() {
            $('body').toggleClass('active-nav');
            return false;
        });

        $('.close', '.interactive-heading').click(function() {
            $('.interactive-heading').toggleClass('inactive');
            return false;
        });
    };

    eafs.slideShow = function(context) {
        var slideIndex = 1,
            $slide = $('[data-index]', context),
            slides = $slide.length;

        $('a.slide-control').click(function() {
            $slide.removeClass('active');
            if ($(this).hasClass('next')) {
                if (slideIndex >= slides) {
                    slideIndex = 1;
                } else {
                    slideIndex++;
                }
            } else {
                if (slideIndex <= 1) {
                    slideIndex = slides;
                } else {
                    slideIndex--;
                }
            }

           $('[data-index="slide-' + slideIndex + '"]', context).addClass('active');
            return false;
        });
    };

    eafs.countriesMap = function(el, mapId) {
        var map = mapbox.map(el, mapbox.layer().id(mapId), null, [
            easey_handlers.DragHandler(),
            easey_handlers.DoubleClickHandler()
        ]);

        // Create and add marker layer
        var markerLayer = mapbox.markers.layer().features(poi).factory(function(f) {
            var a = document.createElement('a');
                a.className = 'marker marker-' + f.properties.klass;
                a.href = '{{site.baseurl}}/' + f.properties.url;
                a.setAttribute('data-scroll', true);

                var country = f.properties.title,
                    projects = f.properties.projects.length - 1;

                var up = document.createElement('div');
                    up.className = 'popup';
                    up.innerHTML = '<div class="clearfix"><div class="name">' + country + '</div></div>';

                a.appendChild(up);
            return a;
        });

        map.addLayer(markerLayer);
        map.setZoomRange(3, 17);

        var mapDefaults = {
            lat: 25,
            lon: 38,
            zoom: 3
        };

        // Set iniital center and zoom
        map.centerzoom({
            lat: mapDefaults.lat,
            lon: mapDefaults.lon
        }, mapDefaults.zoom);

        map.setZoomRange(mapDefaults.min,mapDefaults.max);
    };

    window.eafs = eafs;
})(window);

