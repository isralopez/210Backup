const edos_list = {
  '01':"Aguascalientes",
  '02':"Baja California",
  '03':"Baja California Sur",
  '04':"Campeche",
  '05':"Coahuila de Zaragoza",
  '06':"Colima",
  '07':"Chiapas",
  '08':"Chihuahua",
  '09':"CDMX",
  '10':"Durango",
  '11':"Guanajuato",
  '12':"Guerrero",
  '13':"Hidalgo",
  '14':"Jalisco",
  '15':"México",
  '16':"Michoacán de Ocampo",
  '17':"Morelos",
  '18':"Nayarit",
  '19':"Nuevo León",
  '20':"Oaxaca",
  '21':"Puebla",
  '22':"Querétaro",
  '23':"Quintana Roo",
  '24':"San Luis Potosí",
  '25':"Sinaloa",
  '26':"Sonora",
  '27':"Tabasco",
  '28':'Tamaulipas',
  '29':"Tlaxcala",
  '30':"Veracruz de Ignacio de la Llave",
  '31':"Yucatán",
  '32':"Zacatecas"
};
const variable_to_thematize = {
  'sembrada': '0',
  'cosechada': '1',
  'siniestrada': '2',
  'columen': '3',
  'rendimiento': '4',
  'valor': '5'
};
var bbx_edos = [];
var bbx_x = [];
var bbx_y = [];

class Variables{

/**
 * Decodes utf-8 encoded string back into multi-byte Unicode characters.
 */
utf8Decode(utf8String) {
    if (typeof utf8String != 'string') throw new TypeError('parameter ‘utf8String’ is not a string');
    // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
    const unicodeString = utf8String.replace(
        /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,  // 3-byte chars
        function(c) {  // (note parentheses for precedence)
            var cc = ((c.charCodeAt(0)&0x0f)<<12) | ((c.charCodeAt(1)&0x3f)<<6) | ( c.charCodeAt(2)&0x3f);
            return String.fromCharCode(cc); }
    ).replace(
        /[\u00c0-\u00df][\u0080-\u00bf]/g,                 // 2-byte chars
        function(c) {  // (note parentheses for precedence)
            var cc = (c.charCodeAt(0)&0x1f)<<6 | c.charCodeAt(1)&0x3f;
            return String.fromCharCode(cc); }
    );
    return unicodeString;
}

downloadCSV(csv, title) {
  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
  hiddenElement.target = '_blank';
  hiddenElement.download = title;
  hiddenElement.click();
}
exportJSON(file_path){
  var a = document.createElement('A');
  a.href = file_path;
  a.download = file_path.substr(file_path.lastIndexOf('/') + 1);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
exportTableToCSV(ed, crop, exportsa, extra, title) {
  var mu = "";
  if(extra){
    mu = "Municipio, "
  }
  var csv = 'Producción Agricola, SIAP del '+$original_year+'\
      \nEstado:, '+ed+', por el , cultivo, '+crop+' \n '+mu+'Estado, Suma del valor de la producción \
    , Suma de la cosecha, Promedio del rendimiento\n';
   exportsa.forEach(function(row) {
           csv += row.join(',');
           csv += "\n";
   });
   //downloadCSV(csv, 'produccion_agricola_edo.csv');
  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
  hiddenElement.target = '_blank';
  hiddenElement.download = title;
  hiddenElement.click();
}

setBbxL(){
  bbx_x = [21.6222664845356, -102.874176584546];
  bbx_y = [22.4595896830525, -101.835289447401];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["01"] = bbx;
  bbx_x = [27.9999999848061, -118.407649550879];
  bbx_y = [32.7186535752625, -112.654240299838];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["02"] = bbx;
  bbx_x = [22.8719540537057, -115.223764337377];
  bbx_y = [28.0000017041175, -109.413172978395];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["03"] = bbx;
  bbx_x = [17.8128711717366, -92.4687900217799];
  bbx_y = [20.84832728853, -89.1212291974072];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["04"] = bbx;
  bbx_x = [24.5426840653016, -103.96000192005];
  bbx_y = [29.8800242896194, -99.8431198067627];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["05"] = bbx;
  bbx_x = [18.3325939998872, -114.759455288635];
  bbx_y = [19.5125187714414, -103.486346451659];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["06"] = bbx;
  bbx_x = [14.5320983619492, -94.139155996379];
  bbx_y = [17.9852877980833, -90.3702137216039];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["07"] = bbx;
  bbx_x = [25.5588436166759, -109.074886167958];
  bbx_y = [31.7844862894973, -103.306768792693];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["08"] = bbx;
  bbx_x = [19.0482366638106, -99.3649242039483];
  bbx_y = [19.5927572799653, -98.9403028113257];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["09"] = bbx;
  bbx_x = [22.345083713078, -107.210132227248];
  bbx_y = [26.8448759117676, -102.472696981309];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["10"] = bbx;
  bbx_x = [19.9127501813221, -102.097032277151];
  bbx_y = [21.8394167186182, -99.6713026147652];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["11"] = bbx;
  bbx_x = [16.3159525831697, -102.184351179715];
  bbx_y = [18.8878467894171, -98.0072763938042];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["12"] = bbx;
  bbx_x = [19.5977581116736, -99.8595414365727];
  bbx_y = [21.3985207679097, -97.9849289109412];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["13"] = bbx;
  bbx_x = [18.9258718700513, -105.695403467336];
  bbx_y = [22.7502459395598, -101.51054174982];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["14"] = bbx;
  bbx_x = [18.3669428770738, -100.613091003664];
  bbx_y = [20.2858666666518, -98.5968666556226];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["15"] = bbx;
  bbx_x = [17.9149078601021, -103.738127072141];
  bbx_y = [20.3945563459586, -100.063032821642];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["16"] = bbx;
  bbx_x = [18.3323730775454, -99.4944141480939];
  bbx_y = [19.1317017270646, -98.632946651467];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["17"] = bbx;
  bbx_x = [20.6032209478144, -106.687726781448];
  bbx_y = [23.0845033392953, -103.720895546169];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["18"] = bbx;
  bbx_x = [23.1626831854073, -101.206762710012];
  bbx_y = [27.7991371864429, -98.4215760780924];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["19"] = bbx;
  bbx_x = [15.6571685974108, -98.5527073335255];
  bbx_y = [18.6696880653534, -93.8674267718396];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["20"] = bbx;
  bbx_x = [17.8609119303356, -99.0704942745153];
  bbx_y = [20.8399597469255, -96.7246830344269];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["21"] = bbx;
  bbx_x = [20.0150182872879, -100.59653571445];
  bbx_y = [21.6700054263226, -99.0430798533174];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["22"] = bbx;
  bbx_x = [17.8939855540657, -89.2965618140633];
  bbx_y = [21.6055041328782, -86.7104052700568];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["23"] = bbx;
  bbx_x = [21.1601538293591, -102.296038410036];
  bbx_y = [24.4915218276091, -98.3259670492722];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["24"] = bbx;
  bbx_x = [22.4671337656533, -109.447692603181];
  bbx_y = [27.0423059887849, -105.392220002523];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["25"] = bbx;
  bbx_x = [26.2969879325374, -115.053022327618];
  bbx_y = [32.4939131619264, -108.42427083532];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["26"] = bbx;
  bbx_x = [17.250893331235, -94.130025163867];
  bbx_y = [18.6509649531714, -90.9874591997836];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["27"] = bbx;
  bbx_x = [22.206965827776, -100.144950219012];
  bbx_y = [27.6791262156323, -97.1442236040225];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["28"] = bbx;
  bbx_x = [19.10507186002, -98.7083985865751];
  bbx_y = [19.7289174323247, -97.6254391011];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["29"] = bbx;
  bbx_x = [17.1369649102096, -98.6815466037805];
  bbx_y = [22.4717509147403, -93.6079398089036];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["30"] = bbx;
  bbx_x = [19.5511740956119, -92.3263000017498];
  bbx_y = [22.6137999994325, -87.5331452806868];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["31"] = bbx;
  bbx_x = [21.0418694024331, -104.353533038625];
  bbx_y = [25.1252355069575, -100.742324287397];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["32"] = bbx;
  bbx_x = [14.5320983619492, -118.407649550879];
  bbx_y = [32.7186535752625, -86.7104052700568];
  var bbx = [];
  bbx.push(bbx_x);
  bbx.push(bbx_y);
  bbx_edos["99"] = bbx;
}

}