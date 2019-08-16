/*
 * Anim: is a class for set and  manage dates.
 */
class Anim {
  /*
   * styleMarker: add styles for geojson (points)
   *return the good date with format
   */
  getGoodDate(date, lapseIndex){
    var changeTime ="yyyy-mm-dd";

    if (lapseIndex=="1M") {
        changeTime ="mmmm yyyy";
    }else {
        changeTime ="yyyy-mm-dd";
    }
    // console.log("primer date "+date);
    var goodDate = new Date(date);//hack to get proper month-year in player bar
    return goodDate.format(changeTime);
  }
  monthDiff(d1, d2) {
      var months;
      months = (d2.getFullYear() - d1.getFullYear()) * 12;
      months -= d1.getMonth() + 1;
      months += d2.getMonth() + 2;
      return months <= 0 ? 1 : months;
  }
  getDateMontInt(dateBarTimeMonth, ev, lapseIndex){
    var changeTime ="dd";
    if (lapseIndex=="1M") {
        changeTime ="mm";
    }else {
        changeTime ="dd";
    }
    dateBarTimeMonth = new Date(dateBarTimeMonth);
    dateBarTimeMonth = new Date(dateBarTimeMonth).format(changeTime);//To do change for day, month and week
    var validateStartDate = new Date(ev.time);
    validateStartDate = new Date(validateStartDate).format(changeTime); //hack to get proper day, month or week
    var dateBarTimeMonthInt = parseInt(dateBarTimeMonth);
    var validateStartMonthInt = parseInt(validateStartDate);
    if(dateBarTimeMonthInt==validateStartMonthInt){
      return true;
    }else{
      return false;
    }
  }
  getNumberForDays(startUserDate, endUserDate, time){
    if (startUserDate != null){
      var numDaysString = "";
      var mate = 0;
      var difMonth = 1;
      var anim = new Anim();
      difMonth = anim.monthDiff(new Date(startUserDate),new Date(endUserDate));
      // console.log("difMonth:");//differenceof months
      // console.log(difMonth);

      var tiempo = Math.floor((new Date(endUserDate)-new Date(startUserDate)));
      //var tiempo = Math.floor((new Date(endUserDate)-new Date(startUserDate)));
      var mate = Math.floor(tiempo / (1000 * 60 * 60 * 24));//time/18
      // numDaysParams = mate;
      // mate = Math.floor((new Date(endUserDate)-new Date(startUserDate)));
      //
      if(lapseIndex=="1D"){
        //Get total number of days to use in calculating width of bars
        numDaysParams = mate+1; // add one day to get correct number of days
        // mate = mate/31;
      }else if (lapseIndex=="1M") {
        //Get total number of days to use in calculating width of bars
        var dayMonth = mate/difMonth;
        var DayBar = new Date(dc.getDateTimeZone(new Date(time)));
        var numOfDaysofMonth = daysInMonth(DayBar.getMonth(), DayBar.getFullYear());
        var monthD = DayBar.getMonth()+1;
        //mate = mate/numOfDaysofMonth;
        if(monthD==2){
          mate = mate/27.5;//this is more extract
        }else {
          if(numOfDaysofMonth==31){
            mate = (mate/29.5);//this is more extract
          }else {
            mate = (mate/30.5);//this is more extract
            //mate = (mate/(mate/difMonth));//this calculate the difference number month / difference between dates
            //mate = mate/numOfDaysofMonth;//this difference between dates / number of days of each months
          }
          //mate = mate/numOfDaysofMonth;
        }
        // console.log("mat"+mate);
        numDaysParams = mate;

      }else{
        //Get total number of days to use in calculating width of bars
        // console.log("is week");
        // console.log(mate);
        mate = (mate/7)+1;
        numDaysParams = mate;
        // mate = mate/4;
      }
      return numDaysParams;
  }else {
    return 14;
  }
  }
  getFormatD(UserDate){
    var initialDateF = "";
    if(UserDate!=null)
    {
      var initialDateFTemp = new Date(startUserDate).format("yyyy-mm-dd");
      initialDateF = initialDateFTemp.toString();
    }
      return initialDateF;
  }

}
