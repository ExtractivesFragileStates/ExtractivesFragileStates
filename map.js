---
---
{% include ext/jquery.min.js %}

;(function(context) {
  var extractives = {

    global: function() {
      this.init_map();
	    $('.maplink').on('click', this.maplink);
      $('.section').on('click', this.section);
      $('.gisMenu').on('click', this.gisMenu);
      $('.refresher').on('click', this.refresher);
	    $('#text').on('click', '.navigate', this.navigate);
    },

    init_map: function() {
      // Initialize Map
      this.map = L.map('map', {
	      minZoom: 3,
	      maxZoom: 10,
      	  zoomControl: true,
	      attributionControl: false
      })
	    .setView(page_data.baseLayer["latlon"], page_data.baseLayer["zoom"]);

      $(window).resize(function() { $('.leaflet-control-zoom').css('left', $('#content').width()); });
      $('.leaflet-control-zoom').css('left', $('#content').width());

      // Build Base Layer
      for(i = 0; i < page_data.baseLayer["id"].length; i++){
	      this.map.addLayer(L.mapbox.tileLayer(page_data.baseLayer["id"][i][0], {zIndex: page_data.baseLayer["id"][i][1]} ));
      }

      // Add Intro Text, Zoom Control, Initialize an empty Layer Group, and hide all non-permanent menus
      $('#text').html(page_data.baseLayer["text"]);
      // new L.Control.Zoom({ position: 'topleft' }).addTo(this.map);

      //layer_groups object used for GIS layout.
      this.layer_groups = {};

      //one group used for Narrative layout
      this.group = L.layerGroup().addTo(this.map);
      this.group.setZIndex(0);

      $('.layerMenu').hide();
    },


	  maplink: function(e) {
	  	e.preventDefault();
	  	e.stopPropagation();
	  	var switcherElement = $(this);
  
    	extractives.clearLayersLegends();
      extractives.activateDeactivate($(this));

      if (switcherElement.hasClass('multimap')) {
        //maplink will load a menu in the legend
        var menu = $('#' + this.id + '-menu');
    		menu.children(':first').trigger('click');
      } else {
  	  	//add new layer/legend
	    	extractives.switchLayer(switcherElement);
	    	$('#text').html(page_data.mapboxLayers[switcherElement.attr('id')]["text"])
      }
	  },
    section: function(e) {
		  e.preventDefault();
		  e.stopPropagation();

  		var firstChildElement = $('#' + this.id + '-layer').children(':first');

	    // remove layers/legends and trigger first layer button event
	    extractives.removeAll();
	    firstChildElement.trigger('click');

	    // change z-index on layer menus and move layer
	    extractives.changeZ($(this));
	  	extractives.textMenuDown();
	  },
    gisMenu: function(e) {
      e.preventDefault();
	  	e.stopPropagation();	
      var mapid = this.getAttribute('mapid');
      var sectionid = this.getAttribute('sectionid');
      var grid = $(this).hasClass('grid');
      var legendid = this.getAttribute('legendid');

      if (grid) {
        if ($(this).prev().hasClass('active')) {
          extractives.removeGrids();
          $('.map-tooltip').each( function() { $(this).remove(); } );
          var gridLayer = L.mapbox.gridLayer(mapid);
          extractives.group.addLayer(gridLayer);
          extractives.map.addControl(L.mapbox.gridControl(gridLayer));
          $('.grid').removeClass('active');
          $(this).addClass('active');

          if (extractives.mapLegend) {
            extractives.map.removeControl(extractives.mapLegend);
            extractives.mapLegend = null;
          }
          if (legendid) {
            extractives.mapLegend = L.mapbox.legendControl({ position:'bottomright' }).addLegend(document.getElementById(legendid).innerHTML);
		        extractives.map.addControl(extractives.mapLegend);
          }

        }
      } else {
        // Toggle off this layer
        if ($(this).hasClass('active')) {
          extractives.layer_groups[ sectionid ].clearLayers();
          $(this).removeClass('active');
          if (extractives.mapLegend && $(this).next().hasClass('active')) {
            extractives.map.removeControl(extractives.mapLegend);
            extractives.mapLegend = null;
          }
          $(this).next().removeClass('possible');
          $(this).next().removeClass('active');
        } else {
        // Switch to this layer
          if (extractives.layer_groups[ sectionid ] == null) {
            extractives.layer_groups[ sectionid ] = L.layerGroup().addTo(extractives.map);
          }
          extractives.layer_groups[ sectionid ].clearLayers();
          $("[sectionid=" + sectionid + ']').removeClass('active');
          $("[sectionid=" + sectionid + ']').next().removeClass('active');
          $("[sectionid=" + sectionid + ']').next().removeClass('possible');
          $(this).addClass('active');
          $(this).next().addClass('possible');
          $(this).next().trigger('click');
          extractives.layer_groups[ sectionid ].addLayer(L.mapbox.tileLayer(mapid));
        }
      }
    },
	  navigate: function(e) {
	  	e.preventDefault();
	  	e.stopPropagation();	

	  	var location = this.getAttribute('data-location').split(',');
	  	var latLon = [location[0],location[1]];
	  	var zoom = location[2];
	  	if (latLon && zoom){
	  		extractives.map.setView(latLon, zoom);
	  	}
	  },
  	refresher: function(e) {
  		e.preventDefault();
  		e.stopPropagation();

  		// remove layers/legends, move layers up, change text to intro, and reset view
  		extractives.removeAll();
  		extractives.textMenuUp();
  		$('#text').html(page_data.baseLayer['text']);
  		extractives.map.setView(page_data.baseLayer["latlon"], page_data.baseLayer["zoom"]);
  	},

	  switchLayer: function(layer) {
		  layerId = layer.attr('id');
  		this['group'].addLayer(L.mapbox.tileLayer(page_data.mapboxLayers[layerId]["id"])); 

	  	var gridLayer = L.mapbox.gridLayer(page_data.mapboxLayers[layerId]["id"]);
  		this.group.addLayer(gridLayer);
	  	this.map.addControl(L.mapbox.gridControl(gridLayer));

      var legendHtml = "";
      if ($('#' + layerId).parent().hasClass('layerMenu')) {
        //add buttons
        var menu = $('#' + layerId).parent();
        menu.show();
		    legendHtml = menu[0].outerHTML + "<div style='clear: both; margin-bottom: 6px'></div>" + page_data.mapboxLayers[layerId]["legend"];
		    this.mapLegend = L.mapbox.legendControl({ position:'bottomright' }).addLegend(legendHtml)
		    this.map.addControl(this.mapLegend);
        $('.maplink').off('click', this.maplink);
	      $('.maplink').on('click', this.maplink);
        $('#' + layerId).addClass('active');
      } else {
		    legendHtml = page_data.mapboxLayers[layerId]["legend"];
		    this.mapLegend = L.mapbox.legendControl({ position:'bottomright' }).addLegend(legendHtml)
		    this.map.addControl(this.mapLegend);
      }

	  },
    removeLayer: function(mapid) {
      this['group'].eachLayer(function (layer) {
        if (layer._tilejson.id == mapid) {
          extractives['group'].removeLayer(layer);
        }
      });
    },
    removeGrids: function() {
      this['group'].eachLayer(function (layer) {
        if (layer.options['grids']) {
          extractives['group'].removeLayer(layer);
        }
      });
    },
	  removeAll: function() {
		  extractives.clearLayersLegends();
      $('.active').removeClass('active'); 
	  },
    clearLayersLegends: function() {
      this['group'].clearLayers();
      $('.map-tooltip').each( function() { $(this).remove(); } ); // might need to clear gridControl?
	  	$('.layerMenu').hide();
  		$('.layerMenu').children().removeClass('active');
      if (this.mapLegend) {
        this.map.removeControl(this.mapLegend);
        this.mapLegend = null;
      }
      $('.map-legends').remove();
	  },
    changeZ: function(layer) {
		  $('.dropdownMenu').css('z-index', 1);
		  $('#' + layer.attr('id') + '-layer').css('z-index', 2);
		  layer.addClass('active');
	  },
	  textMenuDown: function() {
	  	  $('.dropdownMenu').animate( { 'top': '89px' }, 150 );
		  $('#text-container').animate( { 'top': '135px' }, 150 );
	  },
	  textMenuUp: function() {
		  $('.dropdownMenu').animate( { 'top': '46px' }, 150 );
		  $('#text-container').animate( { 'top': '92px' }, 150 );
	  },
  	activateDeactivate: function(button) {
  		button.addClass('active');
  		button.siblings('.active').removeClass('active');
  	}
  }

  window.extractives = extractives;
})(window);
