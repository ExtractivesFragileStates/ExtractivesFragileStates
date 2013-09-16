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
      new L.Control.Zoom({ position: 'topleft' }).addTo(this.map);

      this.group = L.layerGroup().addTo(this.map);
      this.headerGroup = L.layerGroup().addTo(this.map);
      $('.layerMenu').hide();
    },


	  maplink: function(e) {
	  	e.preventDefault();
	  	e.stopPropagation();
	  	var switcherElement = $(this);
  
      var layer_group = 'group';
      if (switcherElement.hasClass('headerLayer')) { layer_group = 'headerGroup'; }

      if (switcherElement.hasClass('active')) {
       //maplink is active, just switch it off
  		  switcherElement.removeClass('active');
        extractives.clearLayersLegends(layer_group);
      } else if (switcherElement.hasClass('multimap')) {
        //maplink will load a menu in the legend
        var menu = $('#' + this.id + '-menu');
    		extractives.clearLayersLegends(layer_group);
    		extractives.activateDeactivate($(this));
    		menu.children(':first').trigger('click');
    		menu.show();
        menu.prependTo($('.leaflet-bottom.leaflet-right'));
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
		  extractives.clearLayersLegends();
      extractives.group.addLayer(L.mapbox.tileLayer(mapid));
      var gridLayer = L.mapbox.gridLayer(mapid);
      extractives.group.addLayer(gridLayer);
      extractives.map.addControl(L.mapbox.gridControl(gridLayer));
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
		  this[layer_group].addLayer(L.mapbox.tileLayer(page_data.mapboxLayers[layerId]["id"]));
	  	var gridLayer = L.mapbox.gridLayer(page_data.mapboxLayers[layerId]["id"]);
      if (layer_group == 'group') {
  		  this.group.addLayer(gridLayer);
	  	  this.map.addControl(L.mapbox.gridControl(gridLayer));
      }

		  var legendHtml = page_data.mapboxLayers[layerId]["legend"];
		  var mapLegend = L.mapbox.legendControl({ position:'bottomright' }).addLegend(legendHtml)
		  this.map.addControl(mapLegend);
	  },
	  removeAll: function(g) {
		  extractives.clearLayersLegends(g);
		  $('.active').removeClass('active'); //TODO remove only on g class?
	  },
    clearLayersLegends: function(g) {
      if (g) {
  		  this[g].clearLayers();
      } else {
        this['group'].clearLayers();
        this['headerGroup'].clearLayers();
      }
      $('.map-tooltip').each( function() { $(this).remove(); } );
	  	$('.layerMenu').hide();
  		$('.layerMenu').children().removeClass('active');
		  $('.map-legends').remove();
	  },
    changeZ: function(layer) {
		  $('.dropdownMenu').css('z-index', 1);
		  $('#' + layer.attr('id') + '-layer').css('z-index', 2);
		  layer.addClass('active');
	  },
	  textMenuDown: function() {
	  	$('.dropdownMenu').animate( { 'top': '40px' }, 150 );
		  $('#text').animate( { 'top': '84px' }, 150 );
	  },
	  textMenuUp: function() {
		  $('.dropdownMenu').animate( { 'top': '0px' }, 150 );
		  $('#text').animate( { 'top': '44px' }, 150 );
	  },
  	activateDeactivate: function(button) {
  		button.addClass('active');
  		button.siblings('.active').removeClass('active');
  	}
  }

  window.extractives = extractives;
})(window);
