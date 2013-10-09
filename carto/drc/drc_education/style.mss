// education
@1: #FEF0D9;
@2: #FCB779;
@3: #EB603F;
@4: #B30000;

#un_mdg {
  polygon-opacity:0.4;
  [youth_en_3 > 65]{ polygon-fill: @4; }
  [youth_en_3 > 70]{ polygon-fill: @3; }
  [youth_en_3 > 75]{ polygon-fill: @2; }
  [youth_en_3 > 80]{ polygon-fill: @1; }
  line-color:#000;
  line-opacity: 0.4;
  [zoom <= 3]{ line-width: 0.1; }
  [zoom = 4]{ line-width: 0.2; }
  [zoom = 5]{ line-width: 0.3; }
  [zoom = 6]{ line-width: 0.4; }
  [zoom = 7]{ line-width: 0.6; }
  [zoom = 8]{ line-width: 0.8; }
  [zoom = 9]{ line-width: 0.9; }
  [zoom >= 10]{ line-width: 1.0; }
}
