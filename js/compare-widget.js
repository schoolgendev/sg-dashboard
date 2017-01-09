$(function () {
  if (typeof schoolId != 'undefined') {
    $('.compare-widget-home-page-only').remove();
  }

  if (window.XDomainRequest) {
    jQuery.ajaxTransport(function (s) {
      if (s.crossDomain && s.async) {
        if (s.timeout) {
          s.xdrTimeout = s.timeout;
          delete s.timeout;
        }
        var xdr;
        return {
          send: function (_, complete) {
            function callback(status, statusText, responses, responseHeaders) {
              xdr.onload = xdr.onerror = xdr.ontimeout = jQuery.noop;
              xdr = undefined;
              complete(status, statusText, responses, responseHeaders);
            }
            xdr = new XDomainRequest();
            xdr.onload = function () {
              callback(200, "OK", {
                text: xdr.responseText
              }, "Content-Type: " + xdr.contentType);
            };
            xdr.onerror = function () {
              callback(404, "Not Found");
            };
            xdr.onprogress = jQuery.noop;
            xdr.ontimeout = function () {
              callback(0, "timeout");
            };
            xdr.timeout = s.xdrTimeout || Number.MAX_VALUE;
            xdr.open(s.type, s.url);
            xdr.send((s.hasContent && s.data) || null);
          },
          abort: function () {
            if (xdr) {
              xdr.onerror = jQuery.noop;
              xdr.abort();
            }
          }
        };
      }
    });
  }

  //$.support.cors = true;
  //var schoolId = 129;
  $.ajax({
    url: typeof schoolId == 'undefined' ? 'http://api.schoolgen.co.nz/ProgramData/' : 'http://api.schoolgen.co.nz/SchoolSummary/' + schoolId,
    success: function (data) {
      UpdateCompareWidget(data);
      $('#compareWidgetSlider').show();
    }
  });

  $('#compareWidgetSlider').royalSlider({
    arrowsNav: false,
    loop: true,
    keyboardNavEnabled: true,
    controlsInside: false,
    imageScaleMode: 'fill',
    arrowsNavAutoHide: false,
    autoScaleSlider: true,
    transitionType: 'move',
    autoPlay: {
      enabled: true,
      delay: 6000,
      pauseOnHover: false
    }
  });
});

function GetJavascriptDateFromDotNetDate(date) {
  return new Date(date.replace('T', ' ').replace('-', '/'));
}

function GetDateAsMonthDayYear(date) {
  var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear();
}

function UpdateCompareWidget(data) {
  var biggestSolarGeneratorOfLast12Months, biggestSolarGeneratorOfLast7Days, biggestSolarGeneratorOfLastHour, mostEnergyGeneratedInADayForASingleSchool, biggestSolarEnergyDay,
    energyGenerated = data.TotalEnergyGenerated,
    co2Saved = data.TotalCO2Saved,
    kwhSaved = energyGenerated.toFixed(0),
    mwHSaved = (kwhSaved / 1000).toFixed(1),
    co2TonnesSaved = (co2Saved / 1000), //.toFixed(1),
    co2InAHotAirBalloon = 3.76,
    co2PerKm = 0.000171,
    pcKwPerHourConsumption = 0.09,
    plasmaTvKwPerHourConsumption = 0.37,
    ledTvKwPerHourConsumption = 0.08,
    hoursPerDay = 24,
    daysPerMonth = 30,
    daysPerYear = 365,
    hoursPerYear = daysPerYear * hoursPerDay,
    hoursPerMonth = daysPerMonth * hoursPerDay,
    hotAirBalloons = (co2TonnesSaved / co2InAHotAirBalloon).toFixed(1),
    carKms = (co2TonnesSaved / co2PerKm).toFixed(0),
    computerHours = kwhSaved / pcKwPerHourConsumption,
    plasmaTvHours = kwhSaved / plasmaTvKwPerHourConsumption,
    computersRunningContFor = {
      oneDay: Math.floor(computerHours / hoursPerDay),
      oneMonth: Math.floor(computerHours / hoursPerMonth),
      oneYear: Math.floor(computerHours / hoursPerYear)
    },
    plasmaTvsRunningContFor = {
      oneDay: Math.floor(plasmaTvHours / hoursPerDay),
      oneMonth: Math.floor(plasmaTvHours / hoursPerMonth),
      oneYear: Math.floor(plasmaTvHours / hoursPerYear)
    },
    computers = GetScaleLessThan10000(computersRunningContFor.oneDay, computersRunningContFor.oneMonth, computersRunningContFor.oneYear),
    plasmaTvs = GetScaleLessThan10000(plasmaTvsRunningContFor.oneDay, plasmaTvsRunningContFor.oneMonth, plasmaTvsRunningContFor.oneYear);

  if (typeof schoolId == 'undefined') {
    biggestSolarGeneratorOfLast12Months = {
      kwhGenerated: data.BiggestTotalGenerationSchoolValue,
      schoolName: data.BiggestTotalGenerationSchool,
      schoolId: data.BiggestTotalGenerationSchoolID
    };
    biggestSolarGeneratorOfLast7Days = {
      kwhGenerated: data.Highest7DaySchoolEnergy,
      schoolName: data.Highest7DaySchoolName,
      schoolId: data.Highest7DaySchoolID
    };
    biggestSolarGeneratorOfLastHour = {
      kwhGenerated: (data.TopHourOutput/1000).toFixed(2),
      schoolName: data.TopHourSchoolName,
      schoolId: data.TopHourSchoolID
    };
    mostEnergyGeneratedInADayForASingleSchool = {
      date: GetJavascriptDateFromDotNetDate(data.HighestGenerationDaySchoolDate),
      kwhGenerated: data.HighestGenerationDaySchoolEnergy,
      schoolId: data.HighestGenerationDaySchoolID,
      schoolName: data.HighestGenerationDaySchoolName
    };
    biggestSolarEnergyDay = {
      date: GetJavascriptDateFromDotNetDate(data.HighestDayGeneration),
      kwhGenerated: data.HighestDayGenerationValue
    };

    //school with the most solar energy generated in the last 12 months
    $('#compareWidgetMostSolarEnergyLast12Months .compare-widget-amont-saved span').html(numberWithCommas(biggestSolarGeneratorOfLast12Months.kwhGenerated));
    $('#compareWidgetMostSolarEnergyLast12Months .compare-widget-school-name').html(biggestSolarGeneratorOfLast12Months.schoolName);

    //school with the most solar energy generated in the last 7 days
    $('#compareWidgetMostSolarEnergyLast7Days .compare-widget-amont-saved span').html(numberWithCommas(biggestSolarGeneratorOfLast7Days.kwhGenerated));
    $('#compareWidgetMostSolarEnergyLast7Days .compare-widget-school-name').html(biggestSolarGeneratorOfLast7Days.schoolName);

    //school with the most solar energy generated in the last hour
    $('#compareWidgetMostSolarEnergyLastHour .compare-widget-amont-saved span').html(numberWithCommas(biggestSolarGeneratorOfLastHour.kwhGenerated));
    $('#compareWidgetMostSolarEnergyLastHour .compare-widget-school-name').html(biggestSolarGeneratorOfLastHour.schoolName);

  } else {
    biggestSolarEnergyDay = {
      date: GetJavascriptDateFromDotNetDate(data.MaxGenerationDate),
      kwhGenerated: data.MaxGenerationDay
    };
  }

  //biggest solar energy day
    console.log($('#compareWidgetBiggestSolarEnergyDay .compare-widget-amont-saved span').html());
  $('#compareWidgetBiggestSolarEnergyDay .compare-widget-amont-saved span').html(numberWithCommas(biggestSolarEnergyDay.kwhGenerated));
  $('#compareWidgetBiggestSolarEnergyDay .compare-widget-date').html(GetDateAsMonthDayYear(biggestSolarEnergyDay.date));
  console.log($('#compareWidgetBiggestSolarEnergyDay .compare-widget-amont-saved span').html());
  //hot air balloons
  $('#compareWidgetHotAirBalloons .compare-widget-amont-saved span').html(numberWithCommas(co2TonnesSaved.toFixed(1)));
  $('#compareWidgetHotAirBalloons .compare-widget-equivalent-to-value span').html(numberWithCommas(hotAirBalloons));

  //car
  $('#compareWidgetCarKms .compare-widget-amont-saved span').html(numberWithCommas(co2TonnesSaved.toFixed(1)));
  $('#compareWidgetCarKms .compare-widget-equivalent-to-value span').html(numberWithCommas(carKms));

  //computers
  $('#compareWidgetComputers .compare-widget-amont-saved span').html(numberWithCommas(kwhSaved));
  $('#compareWidgetComputers .compare-widget-equivalent-to-value span').html(numberWithCommas(computers.value));
  $('#compareWidgetComputers .compare-widget-equivalent-to-running-for span').html(numberWithCommas(computers.scale));

  //tvs
  $('#compareWidgetPlasmaTv .compare-widget-amont-saved span').html(numberWithCommas(kwhSaved));
  $('#compareWidgetPlasmaTv .compare-widget-equivalent-to-value span').html(numberWithCommas(plasmaTvs.value));
  $('#compareWidgetPlasmaTv .compare-widget-equivalent-to-running-for span').html(numberWithCommas(plasmaTvs.scale));
  //  $('#compareWidgetPlasmaTv').remove();
}

function GetScaleLessThan10000(day, month, year) {
  if (month > 10000) {
    return {
      scale: 'Year',
      value: year
    }
  }
  if (day > 10000) {
    return {
      scale: 'Month',
      value: month
    }
  }

  return {
    scale: 'Day',
    value: day
  }
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}