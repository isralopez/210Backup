/*
 * data-picker-custom: is a class for set and  manage elements of date jquery picker. Of animAllDates.html
 * It can be shared among different layers and it can be added to a map, and become
 * the default timedimension component for any layer added to the map.
 */
//set label of calendars
jQuery(function($){
  $.datepicker.regional['es'] = {
	closeText: 'Cerrar',
	prevText: '&#x3c;Ant',
	nextText: 'Sig&#x3e;',
	currentText: 'Hoy',
	monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
	'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
	monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun',
	'Jul','Ago','Sep','Oct','Nov','Dic'],
	dayNames: ['Domingo','Lunes','Martes','Mi&eacute;rcoles','Jueves','Viernes','S&aacute;bado'],
	dayNamesShort: ['Dom','Lun','Mar','Mi&eacute;','Juv','Vie','S&aacute;b'],
	dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','S&aacute;'],
	weekHeader: 'Sm',
	dateFormat: 'yy/mm/dd',
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: ''};
  $.datepicker.setDefaults($.datepicker.regional['es']);

});
//initial document for the elements of the html and css load first
$(document).ready(function(){
	//icon of miniminsize and maximize display true and false
	$(".miniminsize").css("display", "none");

	/*Close the leyend */
	$(".close").on("click", function() {
		$("#drag-legend").css("display", "none");
		$(".miniminsize").css("display", "block");
		// $("#drag-legend-PCAC").css("display", "none");
	});
	/*End Close the leyend */

	/*minimize the leyend */
	$("#mini").on("click", function() {
		$(".miniminsize").css("display", "none");
		$("#drag-legend").css("display", "block");
		// $("#drag-legend-PCAC").css("display", "none");
	});
	/*End minimize the leyend */
	//Start datapickers initial
	//datapicke for month initial date
	$('#date-picker-month-initial').datepicker({
		beforeShow: function () {
			$('#hideMonth-initial').html('.ui-datepicker-calendar{display:none;}');
		},
		changeMonth: true,
		changeYear: true,
		showButtonPanel: true,
		dateFormat: 'MM yy',
		onClose: function () {
			var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
			var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
			$(this).datepicker('setDate', new Date(year, month, 1));
			minDate = new Date($("#date-picker-month-initial").val());
			$('#date-picker-month-end').datepicker("option", {"minDate": minDate, disabled: false});
			setTimeout(function () {
				$('#hideMonth-initial').html('');
			}, 100);
		}
	});

	//datapicke for month end date
	$('#date-picker-month-end').datepicker({
		beforeShow: function () {
			$('#hideMonth-end').html('.ui-datepicker-calendar{display:none;}');
		},
		changeMonth: true,
		changeYear: true,
		showButtonPanel: true,
		dateFormat: 'MM yy',
		onClose: function () {
			var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
			var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
			$(this).datepicker('setDate', new Date(year, month, 1));
			isLastDates = false;
			// get user dates in timeDimension format
			// set time to the beginning of day to match d3's time
			startUserDate = dc.getDateTimeZone(new Date($("#date-picker-month-initial").val()));
			startUserDate.setHours(00,00,00,00);
			endUserDate = dc.getDateTimeZone(new Date($("#date-picker-month-end").val()));
			endUserDate.setHours(00,00,00,00);
			// pass new timeinterval to timeDimension player
			setTimer(startUserDate, endUserDate);
			setTimeout(function () {
				$('#hideMonth-end').html('');
			}, 100);
		}
	});
	//datapicke for day initial date
	$("#datepicker1").datepicker({ //set intial date picker
		changeMonth: true,
		changeYear: true
	});
	//datapicke event initial day date
	$('#datepicker1').on("change", function(e){ // action on initial date picked
		minDate = new Date($("#datepicker1").val());
		$("#datepicker2").datepicker("option", {"minDate": minDate, disabled: false});
	});
	//datapicke for day end date
	$("#datepicker2").datepicker({ //set final date picker - is disabled
		changeMonth: true,
		changeYear: true,
		disabled: true
	});
	//datapickefor initial week date
	$("#date-picker-week-initial").datepicker({ //set intial date picker
		changeMonth: true,
		changeYear: true,
		showButtonPanel: false,
		beforeShowDay: function(date){
			var day = date.getDay();
			return [day == 1,""];
		},
		onClose: function () {
			minDate = new Date($("#date-picker-week-initial").val());
			$("#date-picker-week-end").datepicker("option", {"minDate": minDate, disabled: false});
		}
	});

	//datapickefor end week date
	$("#date-picker-week-end").datepicker({ //set intial date picker
		changeMonth: true,
		changeYear: true,
		showButtonPanel: false,
		beforeShowDay: function(date){
			var day = date.getDay();
			return [day == 1,""];
		},
		onClose: function () {
			isLastDates = false;
			// get user dates in timeDimension format
			// set time to the beginning of day to match d3's time
			startUserDate = dc.getDateTimeZone(new Date($("#date-picker-week-initial").val()));
			startUserDate.setHours(00,00,00,00);
			endUserDate = dc.getDateTimeZone(new Date($("#date-picker-week-end").val()));
			endUserDate.setHours(00,00,00,00);
			// pass new timeinterval to timeDimension player
			setTimer(startUserDate, endUserDate);
		}
	});
	//datapicke event day end date
	$('#datepicker2').on("change", function(e){ // action on final date picked
		isLastDates = false;
		// $('.leaflet-bar-timecontrol .timecontrol-speed .speed').blur();
		maxDate = new Date($("#datepicker2").val());
		$("#datepicker1").datepicker("option", "maxDate", maxDate);
		// get user dates in timeDimension format
		// set time to the beginning of day to match d3's time
		startUserDate = dc.getDateTimeZone(new Date($("#datepicker1").val()));
		startUserDate.setHours(00,00,00,00);
		endUserDate = dc.getDateTimeZone(new Date($("#datepicker2").val()));
		endUserDate.setHours(00,00,00,00);
		// pass new timeinterval to timeDimension player
		setTimer(startUserDate, endUserDate);
		});

	//hide calendars
	$('#date-picker-week-initial').css("display","none");
	$('#date-picker-week-end').css("display","none");
	$('#date-picker-month-initial').css("display","none");
	$('#date-picker-month-end').css("display","none");
	//Disable calendars
	document.getElementById("datepicker2").disabled = true;
	document.getElementById("date-picker-week-end").disabled = true;
	document.getElementById("date-picker-month-end").disabled = true;
	//event for lapse of time chante
	$('#time-lapse').change(function() {
		lapseIndex = $('#time-lapse :selected').val();
		$('#datepicker1').val("");
		$('#datepicker2').val("");

		isDateValid = true;

		if (lapseIndex == "1M") {
		$('#date-picker-week-initial').css("display","none");
		$('#date-picker-week-end').css("display","none");
		$('#datepicker1').css("display","none");
		$('#datepicker2').css("display","none");
		$('#date-picker-month-initial').css("display","block");
		$('#date-picker-month-end').css("display","block");
		// //Set min date of the times
		if(minDateBd!=""){
			minDate = new Date(minDateBd);
			isMinDateBd = true;
			$("#date-picker-month-initial").datepicker("option", {"minDate": minDate});
		}
		//set max date of the times
		if(maxDateBd!=null){
			if(isDateValid){
				maxDate = new Date(maxDateBd);
				$("#date-picker-month-initial").datepicker("option", {"maxDate": maxDate});
				$("#date-picker-month-end").datepicker("option", {"maxDate": maxDate});
				isDateValid = false;
			}
		}

	}else if (lapseIndex == "1W") {
		$('#date-picker-month-initial').css("display","none");
		$('#date-picker-month-end').css("display","none");
		$('#datepicker1').css("display","none");
		$('#datepicker2').css("display","none");
		$('#date-picker-week-initial').css("display","block");
		$('#date-picker-week-end').css("display","block");
		// //Set min date of the times
		if(minDateBd!=""){
			minDate = new Date(minDateBd);
			isMinDateBd = true;
			$("#date-picker-month-initial").datepicker("option", {"minDate": minDate});
		}
		//set max date of the times
		if(maxDateBd!=null){
			if(isDateValid){
				maxDate = new Date(maxDateBd);
				$("#date-picker-week-initial").datepicker("option", {"maxDate": maxDate});
				$("#date-picker-week-end").datepicker("option", {"maxDate": maxDate});
				isDateValid = false;
			}
		}
	} else {
		$('#date-picker-month-initial').css("display","none");
		$('#date-picker-month-end').css("display","none");
		$('#date-picker-week-initial').css("display","none");
		$('#date-picker-week-end').css("display","none");
		$('#datepicker1').css("display","block");
		$('#datepicker2').css("display","block");
		// //Set min date of the times
		if(minDateBd!=""){
			minDate = new Date(minDateBd);
			isMinDateBd = true;
			$("#datepicker1").datepicker("option", {"minDate": minDate});
		}
		//set max date of the times
		if(maxDateBd!=null){
			if(isDateValid){
				maxDate = new Date(maxDateBd);
				$("#datepicker1").datepicker("option", {"maxDate": maxDate});
				$("#datepicker2").datepicker("option", {"maxDate": maxDate});
				isDateValid = false;
			}
		}
	}
	overWrite(type);

	});
	//this method set the timer of bar
	function setTimer(st_d, end_d){
		var userTimePeriod = $('#time-lapse :selected').val();
		var timeArray = L.TimeDimension.Util.explodeTimeRange(st_d, end_d, 'P'+userTimePeriod);
		timeDimensionControl._timeDimension.setAvailableTimes(timeArray, 'replace');
		timeDimensionControl._timeDimension.setCurrentTime(st_d); //move player marker to date
		// update heatmap with selected dates
		var currentBarTime = timeDimensionControl._timeDimension.getCurrentTime();
		crimeHeatMapLayer._getDataForTime(currentBarTime);
		overWrite(type);
	}
		//this method overWrite change the labels for the dates of title
	function overWrite(stoleIndex){
			var currentBarTime = timeDimensionControl._timeDimension.getCurrentTime();
			var dat = new Date(currentBarTime).format("mmmm-yy");
			$(".titleclassBox").html("Robo a "+stole[stoleIndex].toLowerCase()+" en Aguascalientes -- Animación por "+$('#time-lapse :selected').text().toLowerCase()+" --");
			$(".dateclassBox").html(" "+dat.toString());

			document.title = 'Robo a '+stole[stoleIndex]+' AGS';
			// crimeHeatMapLayer._getDataForTime(currentBarTime);
	}
	
	$('#type-stole').change(function() {
		type = $('#type-stole :selected').val();
		overWrite(type);
	});


	$("#datepicker1, #datepicker2").blur(function () {
		displayCalendar();
	 });
	$("#datepicker1, #datepicker2").focus(function () {
		displayCalendar();
	});
	function displayCalendar(lapseIndex){
		if (lapseIndex == "1M") {
			$(".ui-datepicker-calendar").hide();
		}else{
			$(".ui-datepicker-calendar").show();
		}
	}

});
