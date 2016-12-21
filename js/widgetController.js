UnitType = {
    ENERGY: ["kWh", "MWh", "GWh"],
    MASS: ["kg", "tonnes"]
}

jQuery(document).ready(function ($) {

    // class identifiers for replaceable span elements
    // all units are in kwh or kg or nz dollars
    var sgStats = {
        // lifetime values. take info from /ProgramCharts/schoolgen/2016
        lt: {
            kwhGen: {
                name: ".lt-kwhGen",
                unitType: UnitType.ENERGY,
                val: 0
            },
            CO2Saved: {
                name: ".lt-CO2Saved",
                unitType: UnitType.MASS,
                val: 0
            },
            bestSchool: {
                name: ".lt-school",
                unitType: UnitType.ENERGY,
                val: 0
            }
        },
        year: {
            kwhGen: {
                name: ".year-kwhGen",
                unitType: UnitType.ENERGY,
                val: 0
            },
            CO2Saved: {
                name: ".year-CO2Saved",
                unitType: UnitType.MASS,
                val: 0
            },
            bestSchool: {
                name: ".year-school",
                unitType: UnitType.ENERGY,
                val: 0
            }
        },
        week: {
            kwhGen: {
                name: ".week-kwhGen",
                unitType: UnitType.ENERGY,
                val: 0
            },
            CO2Saved: {
                name: ".week-CO2Saved",
                unitType: UnitType.MASS,
                val: 0
            },
            bestSchool: {
                name: ".week-school",
                unitType: UnitType.ENERGY,
                val: 0
            }
        },
        special: {
            // total number of schools involved
            noOfSchools: {
                name: ".sp-noOfSchools",
                val: 92
            },
            // money saved for schools
            moneySaved: {
                name: ".sp-moneySaved",
                val: 125000 //dollars per year
            }
        }
    }

    /* a dictionary kind of object for comparative objects
    // and their associated values */
    var sgObj = {
        // POWER : taken from http://energyusecalculator.com/ or rob's slides
        // one laptop running continuously for a year
        laptops: {
            name: "laptop",
            val: 0.36 //i.e one laptop uses around 0.36 kwh/day
        },
        ps4: {
            name: "PS4",
            val: 3.6 //ps4 running at max uses ~3.6 kwh/day
        },
        batteryTon: {
            name: "tonnes of batteries",
            val: 108 //108 kwh in a single tonne of batteries
        },
        TNT: {
            name: "tonnes of TNT",
            val: 1167 //one tonne of TNT releases 1166 kwh of energy
        },
        // WEIGHT : taken from http://www.bluebulbprojects.com/measureofthings/
        /* weight of a cow in kg*/
        cow: {
            name: "cow",
            val: 680 //one cow ~680 kg
        },
        car: {
            name: "car",
            val: 1650 //a 2009 Ford Taurus = ~1650 kg
        },
        elephant: {
            name: "African Elephant",
            val: 7500 //one elephant = ~7.5 t
        },
        bluewhale: {
            name: "Blue Whale",
            val: 104500 //one blue whale = ~104.5 t
        },
        house: {
            name: "house",
            val: 156000 //single level, unfurnished, 149 sq m = ~156 t
        }
    };

    var slider = {};

    // compile data into the sgStats object

    // compile data into objects. this method shouldn't depend on the slider.
    function compileData() {
        var callArray = ["http://api.schoolgen.co.nz/ProgramCharts/schoolgen/2016", //this gets data for every year
            "http://api.schoolgen.co.nz/ProgramCharts/" //this gets data for the whole program
        ];
        // get API data: this one is for each year
        $.getJSON(callArray[0], function (data) {
            var kwhGen = sgStats.lt.kwhGen;
            var cdioxSaved = sgStats.lt.CO2Saved;
            // extract data from response, throw into objects
            kwhGen.val = extractData(data, 'kWhGen');
            cdioxSaved.val = extractData(data, 'CO2Saved');

            // figure out what the units are for each
            var kwhHolder = extractUnits(kwhGen.val, kwhGen.unitType);
            var co2Holder = extractUnits(cdioxSaved.val, cdioxSaved.unitType);
            // returns objects wtih unit and val fields

            // replace DOM objects with corrected objects
            $(generateReplacer(kwhGen.name, kwhHolder)).replaceAll(sgStats.lt.kwhGen.name);
            $(generateReplacer(cdioxSaved.name, co2Holder)).replaceAll(sgStats.lt.CO2Saved.name);

        });
        // get API data: this one is for the programme's current stats
        // eg today's generation, records, most power generated schools ...
        $.getJSON(callArray[1], function (data) {
            //TODO: need to complete
        })
    }

    /* UTILITY METHODS FOR API CALLS
     */

    /* this gets whatever identifier out of the individual year objects
     from the API call: /ProgramCharts/schoolgen/2016
     */
    function extractData(data, idString) {
        var sumValue = 0;
        $.each(data, function (index, value) {
            //2028 TEMPORARY BUG FIX
            if (value.TimeStamp === "01-01-2028 00:00") {
                return;
            }
            //END 2028 BUG FIX
            sumValue += value[idString];
        });
        return sumValue;
    }
    /* this gets the appropriate unit from the unit array for the
       given value. The unitArray is a UnitType object. Assumes the
       magnitudes between the unit is 1000.
       @return: an object with the fixed value and a unit chosen from the unit array*/
    function extractUnits(value, unitArray) {
        var retObj = {};
        var unitCounter = 0
        retObj.val = value;
        // finish loop when either value < 1000
        //  or unitCounter points to the last unit registered
        while (retObj.val > 1000 && !(unitCounter > unitArray.length - 1)) {
            retObj.val = retObj.val / 1000;
            unitCounter++;
        }
        retObj.unit = unitArray[unitCounter];
        return retObj;
    }
    /*generates a string with the span with class name, and the replaced numbers*/
    function generateReplacer(className, holderObj) {
        var replacer = ""
        var numObj = new Number(holderObj.val)
        replacer += '<span class="' + className + '">';
        replacer += numObj.toPrecision(3) + ' ' + holderObj.unit;
        replacer += '</span>'
        console.log(replacer);
        return replacer;
    }



    // initialize the slider object
    function initializeSlider() {

        var slider1 = $('#slider1');
        slider1.unslider({
            autoplay: true,
            delay: 5000,
            infinite: true,
            nav: false,
            arrows: false
        });

        //TODO: remove the hardcoding and generalize this
        var leftArr, rightArr;
        leftArr = slider1[0].getElementsByClassName("wg-left");
        rightArr = slider1[0].getElementsByClassName("wg-right");
        for (var i = 0; i < leftArr.length; i++) {
            leftArr[i].onclick = function () {
                slider1.data('unslider').prev();
            }
            rightArr[i].onclick = function () {
                slider1.data('unslider').next();
            }
        }
        slider1[0].onmouseover = function(){
            console.log("slider 1 stop");
            slider1.data('unslider').stop();
        }
        slider1[0].onmouseout = function(){
            console.log("slider 1 start");
            slider1.data('unslider').start();
        }

        var slider2 = $('#slider2');
        slider2.unslider({
            autoplay: true,
            delay: 5000,
            infinite: true,
            nav: false,
            arrows: false
        });
        leftArr = slider2[0].getElementsByClassName("wg-left");
        rightArr = slider2[0].getElementsByClassName("wg-right");
        for (var i = 0; i < leftArr.length; i++) {
            leftArr[i].onclick = function () {
                slider2.data('unslider').prev();
            }
            rightArr[i].onclick = function () {
                slider2.data('unslider').next();
            }
        }
        slider2[0].onmouseover = function(){
            console.log("slider 2 stop");
            slider2.data('unslider').stop();
        }
        slider2[0].onmouseout = function(){
            console.log("slider 2 start");
            slider2.data('unslider').start();
        }

        var slider3 = $('#slider3');
        slider3.unslider({
            autoplay: true,
            delay: 5000,
            infinite: true,
            nav: false,
            arrows: false
        });
        leftArr = slider3[0].getElementsByClassName("wg-left");
        rightArr = slider3[0].getElementsByClassName("wg-right");
        for (var i = 0; i < leftArr.length; i++) {
            leftArr[i].onclick = function () {
                slider3.data('unslider').prev();
            }
            rightArr[i].onclick = function () {
                slider3.data('unslider').next();
            }
        }
        slider3[0].onmouseover = function(){
            console.log("slider 3 stop");
            slider3.data('unslider').stop();
        }
        slider3[0].onmouseout = function(){
            console.log("slider 3 start");
            slider3.data('unslider').start();
        }
    }

    compileData();
    initializeSlider();


});