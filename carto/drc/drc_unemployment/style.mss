// Unemployment
@1: #FEF0D9;
@2: #FCB779;
@3: #EB603F;
@4: #B30000;

#un_mdg {
  polygon-opacity:0.4;
  [nmply_05 > 0]{ polygon-fill: @1; }
  [nmply_05 > 10]{ polygon-fill: @2; }
  [nmply_05 > 15]{ polygon-fill: @3; }
  [nmply_05 > 20]{ polygon-fill: @4; }
  line-color:#000;
  line-width: 0.6;
  line-opacity:0.6;
  [zoom <= 3]{ line-width: 0.1; }
  [zoom = 4]{ line-width: 0.2; }
  [zoom = 5]{ line-width: 0.3; }
  [zoom = 6]{ line-width: 0.4; }
  [zoom = 7]{ line-width: 0.6; }
  [zoom = 8]{ line-width: 0.8; }
  [zoom = 9]{ line-width: 0.9; }
  [zoom >= 10]{ line-width: 1.0; }
}
