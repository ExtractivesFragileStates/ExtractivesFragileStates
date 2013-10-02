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
      	  zoomControl: false,
	      attributionControl: false
      })
	    .setView(page_data.baseLayer["latlon"], page_data.baseLayer["zoom"]);

      // Build Base Layer
      for(i = 0; i < page_data.baseLayer["id"].length; i++){
	      this.map.addLayer(L.mapbox.tileLayer(page_data.baseLayer["id"][i][0], {zIndex: page_data.baseLayer["id"][i][1]} ));
      }

      // Add Intro Text, Zoom Control, Initialize an empty Layer Group, and hide all non-permanent menus
      $('#text').html(page_data.baseLayer["text"]);
      // new L.Control.Zoom({ position: 'topleft' }).addTo(this.map);

      //do this in a better way? for GIS?
      this.layer_groups = {};
      this.group = L.layerGroup().addTo(this.map);
      this.group.setZIndex(0);
      this.headerGroup = L.layerGroup().addTo(this.map);
      this.group.setZIndex(998);
      $('.layerMenu').hide();
    },


	  maplink: function(e) {
	  	e.preventDefault();
	  	e.stopPropagation();
	  	var switcherElement = $(this);
  
      var layer_group = 'group';
      if (switcherElement.hasClass('headerLayer')) { layer_group = 'headerGroup'; }

     /* if (switcherElement.hasClass('active')) {
       //maplink is active, just switch it off
  		  switcherElement.removeClass('active');
        extractives.clearLayersLegends(layer_group);
      } else */ if (switcherElement.hasClass('multimap')) {
        //maplink will load a menu in the legend
        var menu = $('#' + this.id + '-menu');
    		extractives.clearLayersLegends(layer_group);
    		extractives.activateDeactivate($(this));
    		menu.children(':first').trigger('click');
    		//menu.show();
        //menu.prependTo($('.leaflet-bottom.leaflet-right'));
      } else {
  	  	//remove layers/legends and add new layer/legend
	    	extractives.clearLayersLegends(layer_group);
	    	extractives.activateDeactivate($(this));
	    	extractives.switchLayer(switcherElement, layer_group);
	    	$('#text').html(page_data.mapboxLayers[switcherElement.attr('id')]["text"])
      }
	  },
    section: function(e) {
		  e.preventDefault();
		  e.stopPropagation();

  		var firstChildElement = $('#' + this.id + '-layer').children(':first');

	    // remove layers/legends and trigger first layer button event
	    extractives.removeAll('group');
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
		  //extractives.clearLayersLegends();
      var grid = $(this).hasClass('grid');
      if (grid) {
        if ($(this).prev().hasClass('active')) {
          extractives.removeGrids('group');
          $('.map-tooltip').each( function() { $(this).remove(); } );
          var gridLayer = L.mapbox.gridLayer(mapid);
          extractives.group.addLayer(gridLayer);
          extractives.map.addControl(L.mapbox.gridControl(gridLayer));
          $('.grid').removeClass('active');
          $(this).addClass('active');
        }
      } else {
        // Toggle off this layer
        if ($(this).hasClass('active')) {
          extractives.layer_groups[ sectionid ].clearLayers();
          $(this).removeClass('active');
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

	  switchLayer: function(layer, layer_group) {
		  layerId = layer.attr('id');
     // if (page_data.mapboxLayers[layerId]["zIndex"] != "") {
  		//  this[layer_group].addLayer(L.mapbox.tileLayer(page_data.mapboxLayers[layerId]["id"]), {zIndex: page_data.mapboxLayers[layerId]["zIndex"]} );
      //} else {
  		  this[layer_group].addLayer(L.mapbox.tileLayer(page_data.mapboxLayers[layerId]["id"])); //, {zIndex: 0 });
      //}

	  	var gridLayer = L.mapbox.gridLayer(page_data.mapboxLayers[layerId]["id"]);
      if (layer_group == 'group') {
  		  this.group.addLayer(gridLayer);
	  	  this.map.addControl(L.mapbox.gridControl(gridLayer));
      }

      var legendHtml = "";
      if ($('#' + layerId).parent().hasClass('layerMenu')) {
        var menu = $('#' + layerId).parent();
        menu.show();
		    var legendHtml = menu[0].outerHTML + "<div class='clear' style='padding-bottom:10px'></div>" + page_data.mapboxLayers[layerId]["legend"];
		    this.mapLegend = L.mapbox.legendControl({ position:'bottomright' }).addLegend(legendHtml)
		    this.map.addControl(this.mapLegend);
        $('.maplink').off('click', this.maplink);
	      $('.maplink').on('click', this.maplink);
        $('#' + layerId).addClass('active');
        //var menu = $('#' + layerId).parent();
        //menu.show();
        //menu.prependTo($('.leaflet-bottom.leaflet-right'));
      } else {
		    var legendHtml = page_data.mapboxLayers[layerId]["legend"];
		    this.mapLegend = L.mapbox.legendControl({ position:'bottomright' }).addLegend(legendHtml)
		    this.map.addControl(this.mapLegend);
      }
	  },
    removeLayer: function(g, mapid) {
      this[g].eachLayer(function (layer) {
        if (layer._tilejson.id == mapid) {
          extractives[g].removeLayer(layer);
        }
      });
    },
    removeGrids: function(g) {
      this[g].eachLayer(function (layer) {
        if (layer.options['grids']) {
          extractives[g].removeLayer(layer);
        }
      });
    },
	  removeAll: function(g) {
		  extractives.clearLayersLegends(g);
      if (g == "group") {
  		  $('.active:not(.headerLayer)').removeClass('active');
      } else {
        $('.active').removeClass('active'); 
      }
	  },
    clearLayersLegends: function(g) {
      if (g) {
  		  this[g].clearLayers();
      } else {
        this['group'].clearLayers();
        this['headerGroup'].clearLayers();
      }
      $('.map-tooltip').each( function() { $(this).remove(); } ); // might need to clear gridControl
	  	$('.layerMenu').hide();
  		$('.layerMenu').children().removeClass('active');
		  //$('.map-legends').remove();
      if (this.mapLegend) {
        this.map.removeControl(this.mapLegend);
        this.mapLegend = null;
      }
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
