@opacity: 0.7;

@mine: #ffcc00;
@oil: #ff5d00;
@forestry: #b0ff00;
@line: #888;

#forest_concessions {
  polygon-opacity:@opacity;
  polygon-fill: @forestry;
  polygon-comp-op: multiply;
  line-color:@line;
  line-opacity:0.4;
  [zoom <= 3]{ line-width: 0.1; }
  [zoom = 4]{ line-width: 0.1; }
  [zoom = 5]{ line-width: 0.2; }
  [zoom = 6]{ line-width: 0.3; }
  [zoom = 7]{ line-width: 0.4; }
  [zoom = 8]{ line-width: 0.5; }
  [zoom = 9]{ line-width: 0.6; }
  [zoom >= 10]{ line-width:0.8; }
}

#mine_concessions {
  polygon-opacity:@opacity;
  polygon-fill: @mine;
  polygon-comp-op: multiply;
  line-color:@line;
  line-opacity:0.4;
  [zoom <= 3]{ line-width: 0.1; }
  [zoom = 4]{ line-width: 0.1; }
  [zoom = 5]{ line-width: 0.2; }
  [zoom = 6]{ line-width: 0.3; }
  [zoom = 7]{ line-width: 0.4; }
  [zoom = 8]{ line-width: 0.5; }
  [zoom = 9]{ line-width: 0.6; }
  [zoom >= 10]{ line-width:0.8; }
}

#oil_concessions {
  polygon-opacity:@opacity;
  polygon-fill: @oil;
  polygon-comp-op: multiply;
  line-color:@line;
  line-opacity:0.4;
  [zoom <= 3]{ line-width: 0.1; }
  [zoom = 4]{ line-width: 0.1; }
  [zoom = 5]{ line-width: 0.2; }
  [zoom = 6]{ line-width: 0.3; }
  [zoom = 7]{ line-width: 0.4; }
  [zoom = 8]{ line-width: 0.5; }
  [zoom = 9]{ line-width: 0.6; }
  [zoom >= 10]{ line-width:0.8; }
}