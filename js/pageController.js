// pageController is responsible for updating the dashboard.
// Uses a publish/subscribe kind of architecture between sgStats and
// the various dashboard components (e.g. widgets, charts...)
glob = this;
$(document).ready(function () {

    /* GLOBAL VARIABLES*/

    var UnitType = {
        ENERGY: ["kWh", "MWh", "GWh"],
        MASS: ["kg", "tonnes"]
    };
    // SgNames holds names for classes for page, as well as a few stats.
    var sgNames = {
        lt: {
            kwhGen: {
                name: ".lt-kwhGen",
                unitType: UnitType.ENERGY
            },
            CO2Saved: {
                name: ".lt-CO2Saved",
                unitType: UnitType.MASS
            },
            bestSchool: {
                name: ".lt-school",
                unitType: UnitType.ENERGY
            }
        },
        year: {
            kwhGen: {
                name: ".year-kwhGen",
                unitType: UnitType.ENERGY
            },
            CO2Saved: {
                name: ".year-CO2Saved",
                unitType: UnitType.MASS
            },
            bestSchool: {
                name: ".year-school",
                unitType: UnitType.ENERGY
            }
        },
        week: {
            kwhGen: {
                name: ".week-kwhGen",
                unitType: UnitType.ENERGY
            },
            CO2Saved: {
                name: ".week-CO2Saved",
                unitType: UnitType.MASS
            },
            bestSchool: {
                name: ".week-school",
                unitType: UnitType.ENERGY
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
    };
    // sgObjects has all the objects you want to compare to
    var sgComp = {
        // ENERGY: taken from rob's spreadsheet
        e: {
            /* the objects that we are comparing the energy levels to */
            objects: [
                //object 20
                {
                    obj: "ge-wind-turbine-month",
                    val: 125000,
                    bg: "url('/img/laptop-wg-bg.png')",
                    lText: {
                        margin: {
                            top: "30px",
                            left: null
                        },
                        smallprint: "Based on Genesis Energy wind turbines"
                    },
                    rText: {
                        margin: {
                            top: "50px",
                            left: "30px"
                        },
                        up: "Equivalent to",
                        span: " turbines",
                        down: "spinning for a month"
                    }
                },
                {
                    obj: "ge-wind-turbine-days",
                    val: 4110,
                    bg: "url('/img/laptop-wg-bg.png')",
                    lText: {
                        margin: {
                            top: "30px",
                            left: "null"
                        },
                        smallprint: "Based on Genesis Energy wind turbines"
                    },
                    rText: {
                        margin: {
                            top: "50px",
                            left: "30px"
                        },
                        up: "Equivalent to",
                        span: " turbines",
                        down: "spinning for a month"
                    }
                },
                {
                    obj: "nz-generation-minutes",
                    val: 102986,
                    bg: "url('/img/nz-wg-bg.png')",
                    lText: {
                        margin: {
                            top: "30px",
                            left: "null"
                        },
                        smallprint: ""
                    },
                    rText: {
                        margin: {
                            top: "50px",
                            left: "30px"
                        },
                        up: "That could power the whole of NZ for",
                        span: "",
                        down: "months!"
                    }
                },
                {
                    obj: "nz-houses-year",
                    val: 7000,
                    bg: "url('house-wg-bg.png')",
                    lText: {
                        margin: {
                            top: "30px",
                            left: "null"
                        },
                        smallprint: ""
                    },
                    rText: {
                        margin: {
                            top: "50px",
                            left: "30px"
                        },
                        up: "That's enough energy to power",
                        span: " houses",
                        down: "in NZ for a year!"
                    }
                },
                {
                    obj: "nz-generation-seconds",
                    val: 1716,
                    bg: "url('/img/nz-wg-bg.png')",
                    lText: {
                        margin: {
                            top: "30px",
                            left: "null"
                        },
                        smallprint: ""
                    },
                    rText: {
                        margin: {
                            top: "50px",
                            left: "30px"
                        },
                        up: "That's enough energy to power",
                        span: " houses",
                        down: "in NZ for a year!"
                    }
                },
                // object 15
/*                {
                    obj: "oil-barrels",
                    val: 1700,
                    bg: "url('/img/oil-wg-bg.png')",
                    lText: {
                        margin: {
                            top: "30px",
                            left: "null"
                        },
                        smallprint: ""
                    },
                    rText: {
                        margin: {
                            top: "50px",
                            left: "30px"
                        },
                        up: "Equivalent to",
                        span: " barrels",
                        down: "of oil!"
                    }
                },  */
                {
                    obj: "nz-houses-month",
                    val: 583,
                    bg: "url('/img/house-wg-bg.png')",
                    lText: {
                        margin: {
                            top: "30px",
                            left: "null"
                        },
                        smallprint: ""
                    },
                    rText: {
                        margin: {
                            top: "50px",
                            left: "30px"
                        },
                        up: "That's enough energy to power",
                        span: " houses",
                        down: "in NZ for a month!"
                    }
                },
                {
                    obj: "TNT-tonne",
                    val: 1200,
                    bg: "url('/img/tnt-wg-bg.png')",
                    lText: {
                        margin: {
                            top: "30px",
                            left: "null"
                        },
                        smallprint: ""
                    },
                    rText: {
                        margin: {
                            top: "50px",
                            left: "30px"
                        },
                        up: "Equivalent to",
                        span: " tonnes",
                        down: "of TNT!"
                    }
                },
                {
                    // note: objects beginning with km-driven must be multiplied
                    obj: "km-driven-train",
                    val: 10,
                    bg: "url('/img/train-wg-bg.png')",
                    lText: {
                        margin: {
                            top: "30px",
                            left: "null"
                        },
                        smallprint: "based on Auckland's electric trains"
                    },
                    rText: {
                        margin: {
                            top: "50px",
                            left: "30px"
                        },
                        up: "A train could travel for",
                        span: " km",
                        down: "on that energy!"
                    }
                },
                {
                    obj: "tesla-battery",
                    val: 90,
                    bg: "url('/img/tesla-wg-bg.png')",
                    lText: {
                        margin: {
                            top: "30px",
                            left: "null"
                        },
                        smallprint: ""
                    },
                    rText: {
                        margin: {
                            top: "50px",
                            left: "30px"
                        },
                        up: "You could charge your Tesla S",
                        span: " times",
                        down: "on that kind of energy!"
                    }
                },
                // object 10
                {
                    obj: "km-driven-tesla",
                    val: 6.25,
                    bg: "url('/img/tesla-wg-bg.png')",
                    lText: {
                        margin: {
                            top: "30px",
                            left: "null"
                        },
                        smallprint: ""
                    },
                    rText: {
                        margin: {
                            top: "50px",
                            left: "30px"
                        },
                        up: "An electric car could travel",
                        span: " km",
                        down: "with that kind of power!"
                    }
                },
                {
                    obj: "tdf-cyclist-total",
                    val: 21.2,
                    bg: "url('/img/cyclist-wg-bg.png')",
                    lText: {
                        margin: {
                            top: "30px",
                            left: "null"
                        },
                        smallprint: ""
                    },
                    rText: {
                        margin: {
                            top: "50px",
                            left: "30px"
                        },
                        up: "That's the amount of energy output by",
                        span: " Tour de France cyclists",
                        down: "over the whole course!"
                    }
                },
                {
                    obj: "km-driven-tdf-cyclist",
                    val: 0.0057,
                    bg: "url('/img/cyclist-wg-bg.png')",
                    lText: {
                        margin: {
                            top: "30px",
                            left: "null"
                        },
                        smallprint: ""
                    },
                    rText: {
                        margin: {
                            top: "50px",
                            left: "30px"
                        },
                        up: "A Tour de France cyclist could cycle",
                        span: " km",
                        down: "on that kind of power!"
                    }
                },
                {
                    obj: "home-batt-panasonic",
                    val: 0.8,
                    bg: "url('/img/panason-wg-bg.png')",
                    lText: {
                        margin: {
                            top: "30px",
                            left: "null"
                        },
                        smallprint: ""
                    },
                    rText: {
                        margin: {
                            top: "50px",
                            left: "30px"
                        },
                        up: "You could recharge your Panasonic home battery",
                        span: " times",
                        down: "on that much energy!"
                    }
                },
                {
                    obj: "coal-kg",
                    val: 4,
                    bg: "url('/img/coal-wg-bg.png')",
                    lText: {
                        margin: {
                            top: "30px",
                            left: "null"
                        },
                        smallprint: ""
                    },
                    rText: {
                        margin: {
                            top: "50px",
                            left: "30px"
                        },
                        up: "That's enough heat energy from",
                        span: " kg",
                        down: "of coal burned!"
                    }
                },
                {
                    obj: "TNT-kg",
                    val: 1.2,
                    bg: "url('tnt-wg-bg.png')",
                    lText: {
                        margin: {
                            top: "30px",
                            left: "null"
                        },
                        smallprint: ""
                    },
                    rText: {
                        margin: {
                            top: "50px",
                            left: "30px"
                        },
                        up: "Equivalent to",
                        span: " kg",
                        down: "of TNT!"
                    }
                },
                {
                    obj: "home-batt-enphase",
                    val: 1.2,
                    bg: "url('/img/enphase-wg-bg.png')",
                    lText: {
                        margin: {
                            top: "30px",
                            left: "null"
                        },
                        smallprint: "based on a 1.2 kwh Enphase AC battery"
                    },
                    rText: {
                        margin: {
                            top: "50px",
                            left: "30px"
                        },
                        up: "Equivalent to",
                        span: " recharges",
                        down: "of your Enphase home battery!"
                    }
                },
                {
                    obj: "tdf-cyclist-40k1hr",
                    val: 0.230,
                    bg: "url('/img/cyclist-wg-bg.png')",
                    lText: {
                        margin: {
                            top: "30px",
                            left: "null"
                        },
                        smallprint: "based on cyclists going 40km/hr for 1 hour"
                    },
                    rText: {
                        margin: {
                            top: "50px",
                            left: "30px"
                        },
                        up: "Equivalent to",
                        span: " Tour de France cyclists",
                        down: "cycling for 1 hour"
                    }
                },
                {
                    obj: "batt-chromebook",
                    val: 0.04,
                    bg: "url('img/laptop-bg.png')",
                    lText: {
                        margin: {
                            top: "30px",
                            left: "null"
                        },
                        smallprint: ""
                    },
                    rText: {
                        margin: {
                            top: "50px",
                            left: "30px"
                        },
                        up: "Equal to recharging",
                        span: "",
                        down: "Chromebook batteries!"
                    }
                },
                {
                    obj: "batt-tablet",
                    val: 0.02,
                    bg: "url('img/laptop-bg.png')",
                    lText: {
                        margin: {
                            top: "30px",
                            left: "null"
                        },
                        smallprint: ""
                    },
                    rText: {
                        margin: {
                            top: "50px",
                            left: "30px"
                        },
                        up: "You could recharge your tablet",
                        span: "",
                        down: "times!"
                    }
                },
                // object 0
                {
                    obj: "batt-phone",
                    val: 0.01,
                    bg: "url('img/laptop-bg.png')",
                    lText: {
                        margin: {
                            top: "30px",
                            left: "null"
                        },
                        smallprint: ""
                    },
                    rText: {
                        margin: {
                            top: "50px",
                            left: "30px"
                        },
                        up: "Equal to recharging your phone",
                        span: "",
                        down: "times!"
                    }
                }
            ],
            /* returns an array of numbers corresponding to comparison objects.
             These are cleared to be included in the slider. */
            threshLevel: function threshLevel(x) {
                // level 1
                if (x <= 50) {
                    return slideArray(0, 10);
                }
                // level 2
                if (x > 50 && x <= 250) {
                    return slideArray(0, 11);
                }
                // level 3
                if (x > 250 && x <= 1500) {
                    return slideArray(4, 14);
                }
                // level 4
                if (x > 1500 && x <= 3000) {
                    return slideArray(4, 14, null, 8);
                }
                // level 5
                if (x > 3000 && x <= 6000) {
                    return slideArray(4, 15, 18, 8);
                }
                // level 6
                if (x > 6000 && x <= 10000) {
                    return slideArray(10, 16, 18);
                }
                // level 7
                if (x > 10000 && x <= 100000) {
                    return slideArray(11, 18);
                }
                // level 8
                if (x > 100000 && x <= 500000) {
                    return slideArray(11, 19);
                }
                // level 9
                if (x > 500000) {
                    return slideArray(13, 19);
                }
            }
        },
        // WEIGHT : taken from http://www.bluebulbprojects.com/measureofthings/
        w: {
            objects: [
                {
                    obj: "wg-cow",
                    val: 680,
                    bg: "url('/img/cow-wg-bg.png')",
                    lText: {
                        margin: {
                            top: "30px",
                            left: "null"
                        },
                        smallprint: ""
                    },
                    rText: {
                        margin: {
                            top: "50px",
                            left: "30px"
                        },
                        up: "That's as heavy as",
                        span: " cows!",
                        down: ""
                    }
                },
                {
                    obj: "wg-car",
                    val: 1650, //a 2009 Ford Taurus = ~1650 kg
                    bg: "url('/img/car-wg-bg.png')",
                    lText: {
                        margin: {
                            top: "30px",
                            left: "null"
                        },
                        smallprint: "based on weight of 2009 Ford Taurus"
                    },
                    rText: {
                        margin: {
                            top: "50px",
                            left: "30px"
                        },
                        up: "That's as heavy as",
                        span: " cars!",
                        down: ""
                    }
                },
                {
                    obj: "wg-elephant",
                    val: 7500, //one elephant = ~7.5 t
                    bg: "url('/img/elephant-wg-bg.png')",
                    lText: {
                        margin: {
                            top: "30px",
                            left: "null"
                        },
                        smallprint: "based on weight of an African Elephant"
                    },
                    rText: {
                        margin: {
                            top: "50px",
                            left: "30px"
                        },
                        up: "That's as heavy as",
                        span: " elephants!",
                        down: ""
                    }
                },
                {
                    obj: "wg-blue-whale",
                    val: 104500, //one blue whale = ~104.5 t
                    bg: "url('/img/elephant-wg-bg.png')",
                    lText: {
                        margin: {
                            top: "30px",
                            left: "null"
                        },
                        smallprint: "one blue whale is around 104.5 t"
                    },
                    rText: {
                        margin: {
                            top: "50px",
                            left: "30px"
                        },
                        up: "That's as heavy as",
                        span: " Blue Whales!",
                        down: ""
                    }
                },
                {
                    obj: "wg-house",
                    val: 156000, //single level, unfurnished, 149 sq m = ~156 t
                    bg: "url('/img/house2-wg-bg.png')",
                    lText: {
                        margin: {
                            top: "30px",
                            left: "null"
                        },
                        smallprint: ""
                    },
                    rText: {
                        margin: {
                            top: "50px",
                            left: "30px"
                        },
                        up: "That's as heavy as",
                        span: " houses!",
                        down: ""
                    }
                }
            ],
            threshLevel: function threshLevel(x){
                if (x <= 1000){
                    return [0,1];
                }
                if (x > 1000 && x <= 50000){
                    return [0,2];
                }
                if (x > 50000 && x <= 100000){
                    return [1,2];
                }
                if (x > 100000 && x <= 500000){
                    return [2,4];
                }
                if (x > 500000){
                    return [3,4];
                }
            }
        }
    };
    // returns an array of numbers with plus at end and minus taken out.
    function slideArray(start, stop, plus, minus) {
            slideArr = [];
            for (var i = start; i <= stop; i++) {
                if (minus === undefined || minus === null || i !== minus) {
                    slideArr.push(i);
                }
            }
            if (plus === undefined || plus === null) {
                return slideArr;
            } else {
                slideArr.push(plus);
                return slideArr;
            }
        }
    // holds time divisions. Used in the chart.
    var TimePeriod = {
        HOUR: "hour",
        DAY: "day",
        WEEK: "week",
        MONTH: "month",
        YEAR: "year",
        LIFETIME: "lifetime"
    };
    // holds month names in an array. Used in the chart.
    var MonthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    // holds the number of days in each month. Used in the chart.
    var DaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    // holds the current date object
    var date = new Date();
    // holds objects to compare schoolgen stats to for the widgets
    // used for AJAX calls - remember to replace variable sections
    var ApiCallArray = [
        "http://api.schoolgen.co.nz/ProgramCharts/schoolgen/2016", //gets yearly data
        "http://api.schoolgen.co.nz/ProgramCharts/schoolgen/{year}/{month}/{day}/{period}", //variable period
        "http://api.schoolgen.co.nz/ProgramCharts/" // gets schoolgen specific statistics
    ];
    /* pc is the page controller for the widgets and charts and stuff.
     register with the pc to gain notification access. */
    var pc = new PageController();
    var dc = new DataCompiler(pc.stat);
    var lifetimeBtn = document.getElementById("btn-lifetime");
    var yearBtn = document.getElementById("btn-year");
    var monthBtn = document.getElementById("btn-month");
    var weekBtn = document.getElementById("btn-week");
    var dayBtn = document.getElementById("btn-day");
    var backBtn = document.getElementById("btn-back");
    bindButtons();
    var cc = new ChartController();
    console.log(cc);
    var wc = new WidgetController();
    pc.register(cc);
    pc.register(wc);
    pc.chartPeriod(date.getFullYear(), date.getMonth(), date.getDate(), 1);


    /* FUNCTIONS AND FUNCTION CONSTRUCTORS*/

    /* SgStats constructor function
    SgStats is an object holding the relevant statistics for schoolgen.
    This is held by the PageController (pc) and is accessible from there.\
    */
    function SgStats() {
        glob.SgStats = this;
        /* what the current time division is (year, month, day, hour)
          i.e. what each data point increments by. */
        this.currentTimeDivs;
        /* this shows what the currently displayed data is*/
        this.currentVisual;
    }

    /* PageController constructor function*/
    function PageController() {
        /* SUBJECT/OBSERVER-RELATED LOGIC */

        /* sgStats is the subject for the observers */
        var stat = this.stat = new SgStats();
        /* obsList is the list of observers for the subject. */
        var obsList = this.obsList = new ObserverList();
        /* register (observer) pushes a new observer object to the observation list. */
        var register = this.register = function (observer) {
            obsList.add(observer);
        };
        /* deregister (observer) removes a given observing object from the observer list. */
        var deregister = this.deregister = function (observer) {
            let index = obsList.indexOf(observer, 0);
            if (index != -1) {
                obsList.removeAt(index);
                return;
            }
            // removal failed - couldn't find the observing object in the list.
            console.log("observer removal failed");
        };
        /* notify() triggers the update mechanism for all registered observers. */
        var notify = this.notify = function () {
            console.log("notify called");
            // cycle through observers, call update()
            let i, obsCount = obsList.count();
            for (i = 0; i < obsCount; i++) {
                console.log("notifying observer " + i)
                if (typeof obsList.list[i].update === 'function') {
                    obsList.list[i].update();
                }
                console.log("finished notifying observer " + i)
            }
        };
        /*preNotify() triggers preupdate mechanism for all registered observers*/
        var preNotify = this.preNotify = function () {
            let i, obsCount = obsList.count();
            // cycle through observers, call preUpdate()
            for (i = 0; i < obsCount; i++) {
                if (typeof obsList.list[i].preUpdate === 'function') {
                    obsList.list[i].preUpdate();
                }
            }
        };

        /* PAGE CONTROLLER INTERFACE */

        /* chartPeriod(year, month, day, period) - gets the data using an API call
         for a given period, before calling notify on everything.
         If called with no parameters, the data period is the entire lifetime of schoolgen.
         Makes use of the top-level dc (data compiler) and the stat.
         */
        this.chartPeriod = function chartPeriod(year, month, day, period) {
            // a signal variable for the AJAX request with callString1
            var programStatCallFinished = false;
            // a signal variable for the AJAX request with callString2
            var periodStatCallFinished = false;
            // callString1 and 2 are the URLs for the AJAX requests further down.
            // callString1 is for the general data
            var callString1 = ApiCallArray[2];
            var callString2;

            if (arguments.length === 0) {
                callString2 = ApiCallArray[0];
            } else {
                callString2 = generateCallString(year, month, day, period);
            }
            // 1. call observer.preNotify() - this will e.g. kill the graph and launch the loader
            this.preNotify();
            // 2. make API call. will need to make two API calls.
            console.log("API call 1: " + callString1);
            console.log("API call 2: " + callString2);
            // 2.1 - make API call for general stats
            d3.json(callString1, generalStatHandler);
            d3.json(callString2, periodStatHandler);
            // 3. on success - throw data into sgStats
            // 4. use callback to trigger observer.notify() - this will e.g. kill the loader,
            //      redraw the graph, and replace the slider spans.

            /* AJAX ERROR/SUCCESS HANDLERS */
            // generalStatHandler is the callback method for callArray[2]
            function generalStatHandler(err, xhr) {
                //handle error
                if (err !== null) {
                    console.log("failed to complete request for general stats");
                    console.log(err);
                    return;
                }
                // compile in the general data
                dc.compileGeneralData(xhr);
                // if both calls finished, run notify
                programStatCallFinished = true;
                if (programStatCallFinished && periodStatCallFinished) {
                    pc.notify();
                }
            }
            // periodStatHandler is the callback method for callArray[0 or 1]
            function periodStatHandler(err, xhr) {
                //handle error
                if (err !== null) {
                    console.log("failed to complete request for specific stats");
                    console.log(err);
                    return;
                }
                // compile stats
                dc.compileSpecificData(xhr, pc.stat.currentTimeDivs, pc.stat.currentVisual);
                // run notify when both calls finish
                periodStatCallFinished = true;
                if (programStatCallFinished && periodStatCallFinished) {
                    pc.notify();
                }
            }

            /* UTILITY METHODS*/
            /* generateCallString(year, month, day, period) uses ApiCallArray[1] to
                create a new string to be used in an API call for a specified period.
            */
            function generateCallString(year, month, day, period) {
                console.log("running call string generator");
                // returnable is the string that will eventually be returned.
                var returnable = ApiCallArray[1];
                // month label is the required month name for the api.
                var monthLabel = MonthName[month];
                // this replaces all the generic {time} labels with the actual values.
                returnable = returnable.replace(new RegExp("{year}"), year)
                    .replace(new RegExp("{month}"), monthLabel)
                    .replace(new RegExp("{day}"), day)
                    .replace(new RegExp("{period}"), period);
                console.log(returnable);
                return returnable;
            }
        };

        /* chartLifetime() - charts the entirety of the schoolgen program,
        in one year intervals.
         */
        this.chartLifetime = function chartLifetime() {
            this.stat.currentVisual = TimePeriod.LIFETIME;
            this.stat.currentTimeDivs = TimePeriod.YEAR;
            this.chartPeriod();
        };

        /* chartYear(year, month) - charts an entire year starting from month/year
            Note: month range is 0 - 11. If no args given, returns last twelve months.
        */
        this.chartYear = function chartYear(year, month) {
            this.stat.currentVisual = TimePeriod.YEAR;
            this.stat.currentTimeDivs = TimePeriod.MONTH;
            // no arg call: returns 12 months from current month
            if (arguments.length === 0 || typeof arguments[0] === 'object') {
                year = date.getFullYear() - 1;
                month = date.getMonth() + 1;
            }
            // call with year: returns that year from start of year
            else if (arguments.length === 1) {
                month = 0;
            }
            this.chartPeriod(year, month, 1, 365);
        };

        /* chartMonth(year, month, day) either charts a whole month,
             or charts 28 days back from a specific day.
             Note: month range is 0 - 11 */
        this.chartMonth = function chartMonth(year, month, day) {
            this.stat.currentVisual = TimePeriod.MONTH;
            this.stat.currentTimeDivs = TimePeriod.DAY;
            var period;
            // no arg call: looks at last 28 days
            if (arguments.length === 0 || typeof arguments[0] === 'object') {
                var backdate = new Date();
                backdate.setDate(date.getDate() - 28);
                year = backdate.getFullYear();
                month = backdate.getMonth();
                day = backdate.getDate();
                period = 28;
            }
            // call (year, month): looks at that whole month
            else if (arguments.length === 2) {
                day = 1;
                period = DaysInMonth[month];
            }
            //call(y,m,d): looks for 28 days from specified date
            else if (arguments.length === 3) {
                period = 28;
            }
            this.chartPeriod(year, month, day, period);
        };

        /* chartWeek(year, month, day) is a convenience method for charting a week (7 days) from
            the day specified. If no day is specified, it looks at the current week (i.e. it charts
            from seven days before the current date.
            Note: range of month = 0 - 11
        */
        this.chartWeek = function chartWeek(year, month, day) {
            this.stat.currentVisual = TimePeriod.WEEK;
            this.stat.currentTimeDivs = TimePeriod.DAY;
            // only valid calls are all 3 params filled or none filled.
            // calling with less than three params filled is equivalent with none filled.
            if (arguments.length < 3) {
                // set backdate
                var backdate = new Date();
                backdate.setDate(date.getDate() - 7);
                // pass backdate data into the chart period
                year = backdate.getFullYear();
                month = backdate.getMonth();
                day = backdate.getDate();
            }
            this.chartPeriod(year, month, day, 7);
        };

        /* chartDay(year,month,day) charts an entire day in half hour columns.
            If called with less than three parameters, it charts the current date.
        */
        this.chartDay = function chartDay(year, month, day) {
            this.stat.currentVisual = TimePeriod.DAY;
            this.stat.currentTimeDivs = TimePeriod.HOUR;
            if (arguments.length < 3) {
                year = date.getFullYear();
                month = date.getMonth();
                day = date.getDate();
            }
            this.chartPeriod(year, month, day, 1)
        };

        /* chartBack is supposed to zoom back out of a time period and take
         you one level up. Supposedly it should remember where you were.
         */
        this.chartBack = function chartBack() {
            // -----------------------------
            //FUTURE: finish the back button!!
            // -----------------------------
        }

    }

    /* DataCompiler function constructor.
    An object that compiles the xhr data into the given stat.
    This data compiler object is specifically for the schoolgen programme.
    */
    function DataCompiler(stat) {
        this.stat = stat;

        /* compileGeneralData(xhr) takes a data object and extracts the
        data required for widgets and other future things.
        */
        this.compileGeneralData = function compileGeneralData(xhr) {
            // stat.bestSch will hold the record holding schools.
            // All values are in kwh.
            stat.general = {};
            stat.general.bestSch = {
                year: {
                    name: xhr.BiggestTotalGenerationSchool,
                    id: xhr.BiggestTotalGenerationSchoolID,
                    val: xhr.BiggestTotalGenerationSchoolValue
                },
                week: {
                    name: xhr.Highest7DaySchoolName,
                    id: xhr.Highest7DaySchoolID,
                    val: xhr.Highest7DaySchoolEnergy
                },
                hour: {
                    name: xhr.TopHourSchoolName,
                    id: xhr.TopHourSchoolID,
                    // the api call gives this back in watt-hours
                    val: xhr.TopHourOutput / 1000
                }
            };
            // records will hold info about the record breaking day
            stat.general.records = {
                year: {
                    timestamp: xhr.HighestGenerationDayThisYear,
                    val: xhr.HighestGenerationDayThisYearValue
                },
                total: {
                    timestamp: xhr.HighestDayGeneration,
                    val: xhr.HighestDayGenerationValue
                }
            };
            // egco2 will hold info about energy generated and
            // co2 offset today and for the whole programme.
            stat.general.egco2 = {
                today: {
                    energy: xhr.EnergyGeneratedToday,
                    co2: xhr.CO2SavedToday
                },
                total: {
                    energy: xhr.TotalEnergyGenerated,
                    co2: xhr.TotalCO2Saved
                }
            };
            console.log("compile general data complete");
            console.log(pc.stat);
        }

        /* compileSpecificData(xhr, timeDiv) - takes a data object and uses a
         timeDiv to extract data and assign appropriate date strings.
         */
        this.compileSpecificData = function compileSpecificData(xhr, timeDiv, currentVis) {
            /* stat.spec will hold the period stats for the data*/
            stat.spec = {};
            if (timeDiv === undefined || timeDiv === null) {
                stat.currentTimeDivs = TimePeriod.HOUR;
            }

            // create the functions to be run on each top-level member

            /* kwhGenFunc extracts all the kwhGen fields. */
            var kwhGenFunc = function kwhGenFunc(group) {
                return Math.round(group.kWhGen);
            };

            /* co2SavedFunc extracts CO2Saved fields from the data object*/
            var co2SavedFunc = function co2SavedFunc(group) {
                return Math.round(group.CO2Saved);
            };

            /* dateStringFunc extracts the appropriate dateString from the dataObjects.
                The value of dateFunc changes according to what timeDiv is being run*/
            var dateFunc;
            if (timeDiv === TimePeriod.YEAR) {
                dateFunc = function dateFunc(group) {
                    return group.TimeStamp.substr(6, 4);
                }
            } else if (timeDiv === TimePeriod.MONTH) {
                dateFunc = function dateFunc(group) {
                    var ts = group.TimeStamp;
                    return MonthName[ts.substr(3, 2) - 1] + " " + ts.substr(6, 4);
                }
            } else if (timeDiv === TimePeriod.DAY) {
                dateFunc = function dateFunc(group) {
                    var ts = group.TimeStamp;
                    return ts.substr(0, 2) + " " + MonthName[ts.substr(3, 2) - 1] + " " + ts.substr(6, 4);
                }
            } else {
                dateFunc = function dateFunc(group) {
                    var ts = group.TimeStamp;
                    return ts.substr(11, 5) + " " + ts.substr(0, 2) + " " + MonthName[ts.substr(3, 2) - 1];
                }
            }

            var xdomainFunc;
            if (timeDiv === TimePeriod.YEAR) {
                xdomainFunc = function (group) {
                    return group.TimeStamp.substr(6, 4);
                }
            } else if (timeDiv === TimePeriod.MONTH) {
                xdomainFunc = function (group) {
                    return MonthName[group.TimeStamp.substr(3, 2) - 1];
                }
            } else if (timeDiv === TimePeriod.DAY) {
                xdomainFunc = function (group) {
                    return group.TimeStamp.substr(0, 2);
                }
            } else {
                xdomainFunc = function (group) {
                    return group.TimeStamp.substr(11, 5);
                }
            }

            //mapName tells us what the name will be on the stat.
            kwhGenFunc.mapName = "kwhGen";
            co2SavedFunc.mapName = "co2Saved";
            dateFunc.mapName = "dateString";
            xdomainFunc.mapName = "xdomain";
            /* add your additional statistics here*/

            /* this piece of code actually puts the data onto the stats object*/
            var funcArray = [kwhGenFunc, co2SavedFunc, dateFunc, xdomainFunc];
            funcArray.forEach(function (funcInArr) {
                stat.spec[funcInArr.mapName] = mapToArray(xhr, funcInArr);
            });

            /* 2028 ERROR FIX*/
            if (pc.stat.currentVisual === TimePeriod.LIFETIME) {
                pc.stat.spec.xdomain.pop();
                pc.stat.spec.co2Saved.pop();
                pc.stat.spec.dateString.pop();
                pc.stat.spec.kwhGen.pop();
            }

            // additional field: the sum of the kwh
            pc.stat.spec.kwhSum = d3.sum(pc.stat.spec.kwhGen).toPrecision(4);
            pc.stat.spec.co2Sum = d3.sum(pc.stat.spec.co2Saved).toPrecision(4);

            console.log("compile specific data complete");
            console.log(pc.stat);

            /* utility methods*/
            // mapToArray takes a function and runs it on every top level object on
            // a data object. It then returns an array with all the results.
            function mapToArray(data, func) {
                arr = [];
                for (i = 0; i < data.length; i++) {
                    arr.push(func(data[i]));
                }
                return arr;
            }
        }
    }

    /* ObserverList is the base class for lists of observers. */
    function ObserverList() {
        /* list is an array of observers */
        this.list = [];
        /* add(obs) registers an observer to the array of observers */
        this.add = function (obj) {
            return this.list.push(obj);
        };
        /* count(obs) returns the number of observers registered. */
        this.count = function () {
            return this.list.length;
        };
        /* get(index) returns a specific observer by array index. */
        this.get = function (index) {
            if (index > -1 && index < this.list.length) {
                return this.list[index];
            } else {
                console.log("observer retrieval failed - out of bounds")
                return false;
            }
        };
        /*indexOf(obj, startIndex) gets the index of an observer obj.
         Use startIndex to specify a start location for the search.
         The default startIndex is zero. Returns -1 on failure. */
        this.indexOf = function (obj, startIndex) {
            let i = startIndex;
            while (i < list.length) {
                if (this.list[i] === obj) {
                    return i;
                }
                i++;
            }
            // failed to find the object
            return -1;
        };
        /* removeAt(index) removes an observer at a specific index.
         Important note: this will alter all indices of observers at
         a later position. */
        this.removeAt = function (index) {
            this.list.splice(index, 1);
        }
    }

    /* ChartController is an object that draws and initializes a chart.
        Its update method updates the chart.
    */
    function ChartController() {
        var margin = {
            top: 20,
            right: 40,
            bottom: 40,
            left: 60
        };
        var width = 550 - margin.left - margin.right;
        var height = 425 - margin.top - margin.bottom;
        var scales = this.scales = createScalesNoDomain(height, width);
        var axes = this.axes = createAxes(scales.x, scales.y);
        var chart;

        /* preNotify - kills the current chart and replaces it with a loading animation. */
        this.preUpdate = function preUpdate() {
            destroyChart();
            makeLoader();
        }

        /* notify kills the loading animation, sets the scale for the chart, and then
            draws in the chart using pc.stat.
        */
        this.update = function update() {
            killLoader();
            initializeChart();
            getScaleDomains();
            drawChart();
        }

        /* sets the chart object and initializes it with a grouping svg element.*/
        function initializeChart() {
            chart = d3.select("#kwhGenChart")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        }


        /* drawChart is used in notify to actually create the chart graphic. */
        function drawChart() {
            // set up selection, call axis.x
            var selection = chart.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(axes.x);
            if (pc.stat.currentTimeDivs === TimePeriod.HOUR) {
                selection.selectAll("text")
                    .attr("transform", "rotate(-90)")
                    .attr("x", -22)
                    .attr("y", -4);
            }
            // draws the axis label for x
            selection.append("text")
                .attr("y", 24).attr("x", width + 15).attr("dy", "-0.71 em")
                .style("text-anchor", "end")
                .text(pc.stat.currentTimeDivs);
            // set up y axis and call axis.y, draw axis label
            chart.append("g")
                .attr("class", "y axis")
                .call(axes.y)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 12)
                .attr("dy", "0.71 em")
                .style("text-anchor", "end")
                .text("kWh Generated");

            // sets the kwh generated label at the top
            var sumString = pc.stat.spec.kwhSum + " KWh";
            if (pc.stat.spec.kwhSum > 1000000) {
                sumString = (pc.stat.spec.kwhSum / 1000000) + " GWh";
            } else
            if (pc.stat.spec.kwhSum > 1000) {
                sumString = (pc.stat.spec.kwhSum / 1000) + " MWh";
            }
            document.getElementById("energyGen").innerHTML = sumString;

            // sets up the div for the tooltip. Initially starts at opacity = 0.
            var ttDiv = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            // sets up the columns for the column graph
            // data join + update selection
            var bars = chart.selectAll(".bar")
                .data(pc.stat.spec.kwhGen);
            //enter selection
            bars.enter().append("rect")
                .attr("class", "bar")
                .attr("x", function (d, i) {
                    return scales.x(pc.stat.spec.xdomain[i]);
                })
                .attr("y", function (d) {
                    return scales.y(d);
                })
                .attr("height", function (d) {
                    return height - scales.y(d)
                })
                .attr("width", scales.x.rangeBand());
            // exit selection
            bars.exit().remove();

            createTooltips(bars, ttDiv);
        }

        /* utility method to get tooltips onto each bar.
         bars is the d3 selection and ttDiv is the tooltip div.
        */
        function createTooltips(bars, ttDiv) {
            bars.on("mouseover", createTTOnFunc(createTTContainer(ttDiv)))
                .on("mousemove", null)
                .on("mouseout", createTTOffFunc(createTTContainer(ttDiv)))
                .on("click", changePeriod)

            function createTTContainer(tooltipDiv) {
                return {
                    tt: tooltipDiv,
                    func: function (param, i) {
                        param.html(pc.stat.spec.dateString[i] + "<br> KWH Generated: " +
                                pc.stat.spec.kwhGen[i])
                            .style("left", d3.event.pageX + "px")
                            .style("top", d3.event.pageY + "px");
                    }
                }
            }

            function createTTOnFunc(container) {
                return (function (d, i) {
                    container.tt.transition()
                        .duration(200)
                        .style("opacity", .9);
                    container.func(container.tt, i);
                })
            }

            function createTTOffFunc(container) {
                return (function () {
                    container.tt.transition()
                        .duration(200)
                        .style("opacity", 0);
                })
            }

            function changePeriod(d, i) {
                // get old time div, if already at hour, cancel zoom operation
                var oldTimeDiv = pc.stat.currentTimeDivs;
                var newTimeDiv = decrementTimePeriod(oldTimeDiv);
                if (newTimeDiv === null) {
                    return;
                }
                // destroy tooltip
                var killTooltip = createTTOffFunc(createTTContainer(ttDiv));
                killTooltip();
                // get the new date
                var zoomInDate = pc.stat.spec.dateString[i];
                var year, month, day, finalFunc;
                switch (newTimeDiv) {
                    // zooming into a single month from a year
                    case TimePeriod.MONTH:
                        year = parseInt(zoomInDate);
                        month, day = 0;
                        finalFunc = pc.chartYear.bind(pc, year);
                        break;
                    case TimePeriod.DAY:
                        year = parseInt(zoomInDate.substr(4, 4));
                        month = MonthName.indexOf(zoomInDate.substr(0, 3));
                        day = 0;
                        finalFunc = pc.chartMonth.bind(pc, year, month);
                        break;
                    case TimePeriod.HOUR:
                        year = parseInt(zoomInDate.substr(7, 4));
                        month = MonthName.indexOf(zoomInDate.substr(3, 3));
                        day = parseInt(zoomInDate.substr(0, 2));
                        finalFunc = pc.chartDay.bind(pc, year, month, day);
                        break;
                }
                if (finalFunc === undefined) {
                    console.log("no final func");
                    return;
                }
                finalFunc();

                function decrementTimePeriod(old) {
                    if (old === TimePeriod.YEAR) {
                        return TimePeriod.MONTH;
                    }
                    if (old === TimePeriod.MONTH) {
                        return TimePeriod.DAY;
                    }
                    if (old === TimePeriod.DAY) {
                        return TimePeriod.HOUR;
                    }
                    return null;
                }
            }
        }

        function getScaleDomains() {
            scales.x.domain(pc.stat.spec.xdomain);
            scales.y.domain([0, d3.max(pc.stat.spec.kwhGen)]);
        }

        /* gets rid of all child nodes of the document object known as 'kwhGenChart'*/
        function destroyChart() {
            var rootNode = document.getElementById("kwhGenChart");
            while (rootNode.hasChildNodes()) {
                rootNode.removeChild(rootNode.firstChild);
            }
        }

        /* create scales with the domain not yet set. Returns an object with two children,
         x and y, both d3 scale objects. */
        function createScalesNoDomain(height, width) {
            var xScale = d3.scale.ordinal()
                .rangeRoundBands([0, width], 0.1);
            var yScale = d3.scale.linear()
                .range([height, 0]);
            return {
                x: xScale,
                y: yScale
            };
        }

        /* creates axes objects based on two objects, xScale and yScale. */
        function createAxes(xScale, yScale) {
            var xAxis = d3.svg.axis()
                .scale(xScale).orient("bottom");
            var yAxis = d3.svg.axis()
                .scale(yScale).orient("left");
            return {
                x: xAxis,
                y: yAxis
            };
        }

        /* makeLoader is a function that makes the loading animation visible. */
        function makeLoader() {
            d3.select("#spinLoader").style("display", "block");
        }

        /* makeLoader is a function that makes the loading animation invisible. */
        function killLoader() {
            d3.select("#spinLoader").style("display", "none");
        }

    }


    /* WidgetController makes and updates the widget. */
    function WidgetController() {
        //A configuration object used for all sliders.
        var sliderConfig = this.sliderConfig = {
            autoplay: true,
            delay: 5000,
            infinite: true,
            nav: false,
            arrows: false
        };
        var getSliderData
        var slides1 = []; // current period slides
        var slides2 = []; // whole of schoolgen slides
        var slides3 = []; // record slides
        var slideReservoir1 = {
            e: [], // slideReservoir1.e holds energy related slides for slider 1
            w: [] // slideReservoir1.w holds carbon related slides for slider 1
        }; // holds all slides
        var slidePool1 = {
            e: [],
            w: []
        }; // holds slides that can be used
        initializeSlides();
        //An array of all hooked up sliders
        var sliderList = this.sliderList = initializeSliders();

        this.preUpdate = function preUpdate() {
            //TODO: complete preupdate, populate with a slider fade out
            //clear out slide pool
        }

        /* Widget Controller Interface */
        //update gets all the data from SGS and re-inserts it into the sliders
        this.update = function update() {

            // holds the indices of suitable slides for slidePool.e (energy related).
            // the slide pool itself however is not yet repopulated.
            var clearedSlideIndicesKWH = sgComp.e.threshLevel(pc.stat.spec.kwhSum);
            // array of indices of suitable slides for slidePool.w (weight/carbon related)
            var clearedSlideIndicesCO2 = sgComp.w.threshLevel(pc.stat.spec.co2Sum);

            //   repopulate the slide pool with a subset of suitable slides from the reservoir
            var fillingPool = 'e'   // choose which pool of slides to repopulate
            slidePool1.e = [];      // clear out the pool before refilling it
            clearedSlideIndicesKWH.forEach(reservoirToPool);    // repopulates the pool
            fillingPool = 'w'
            slidePool1.w = [];
            clearedSlideIndicesCO2.forEach(reservoirToPool);

            // Array with div ids (p1-right, p2-right etc) - will be written onto
            // the node later using attr()
            var powerIdArray = ["p1", "p2", "p3", "p4", "p5"];
            var carbonIdArray = ["c1", "c2"];

            // Select 5 slides in the power pool and 2 in the carbon pool, at random.

            // store a random selection of 5 power-related SlideContainers into powerNodes.
            var powerNodes = getRandomNodes(5, slidePool1.e);
            // store a random selection of 2 CO2-related SlideContainers into carbonNodes.
            var carbonNodes = getRandomNodes(2, slidePool1.w);
            // fixedNodes has all the fixed nodes as slides.

            // required for divReplacer to work properly
            var currentSlideArray = powerNodes;
            // replaces each node in the DOM using the powerIdArray, divReplacer, and the currentSlideArray variable.
            powerIdArray.forEach(divReplacer);
            currentSlideArray = carbonNodes;
            carbonIdArray.forEach(divReplacer);

            // TODO: create a fixedNodes array of nodes that are always present
            // TODO: replace all the placeholder strings dynamically.
            // use powerNodes, carbonNodes, and fixedNodes to replace strings

            // replace string placeholders with up to date stats for ALL SLIDERS


            // create string, replace span element with new span element
      /*      var stat = pc.stat.general;
            replace(stat.egco2.total.energy / 1000000, "GWh", sgNames.lt.kwhGen.name);
            replace(stat.egco2.total.co2 / 1000, "t", sgNames.lt.CO2Saved.name);
*/
            // TODO: get update to insert all the object stats into the widgets
            // TODO: update needs to also replace stats in the record sliders too.

            /* utility methods */

            function replaceAllSpans(){
                // TODO
            }

            // Replaces a given span (identified by class name) with a new span,
            //  where the inner html is the value followed by a unit.
            function replaceSpan(value, unit, spanClassName) {
                // create replacer string
                var replacer = '<span class="' + undot(spanClassName) + '">';
                replacer += value.toPrecision(3) + ' ' + unit;
                replacer += '</span>'
                    // replace HTML element with replacer string
                $(replacer).replaceAll(spanClassName)
            }
            // removes the first character from a string if that character is a period.
            function undot(spanClassName) {
                if (spanClassName.charAt(0) === '.') {
                    return spanClassName.substr(1);
                }
                return spanClassName;
            }
            // takes slide e (where e is from array a) from a reservoir and inserts them into pool[i].
            // the reservoir and pool are demarcated by a variable, fillingPool.
            function reservoirToPool (e, i, a){
                // copy reference from slideReservoir to slidePool for each index
                slidePool1[fillingPool][i] = slideReservoir1[fillingPool][e];
            }

            // takes an array of objects and an argument x. Returns an array with x elements
            // from the array taken randomly.
            function getRandomNodes(x, array) {
                // create an array randArray of length = array.length
                let randArray = range(0, array.length - 1);
                // shuffle randArray
                for (var i = 0; i < randArray.length; i++){
                    // select random number from i to length
                    let z = Math.trunc(i + Math.random() * (randArray.length - 1 - i));
                    // swap with i
                    swap(randArray, z, i);
                }
                console.log("shuffledArray")
                console.log(randArray)

                // deal out the nodes
                var returnable = [];
                for (var i = 0; i < x; i ++) {
                    var nextSlide = array[randArray[i]];
                    returnable.push (nextSlide);
                }
                return returnable;
            }

            // function handler - needs currentSlideArray to work
            function divReplacer (v, i, a){
                // get the nodes to replace - these are div elements (p1, p2, p3...)
                var nodeParent = document.getElementById(v);
                var nodeToReplace = document.getElementById( v + '-right' );
                // check that nodeToReplace exists
                if (nodeToReplace === null ) {
                    console.error("Couldn't find node");
                    return;
                }
                // remove old node, attach new node
                nodeParent.removeChild(nodeToReplace);
                console.log(currentSlideArray)
                $(nodeParent).append( currentSlideArray[i].node );
                // rewrite the id to the node, replacing whatever id was attached to that node previously
                $(currentSlideArray[i].node).attr("id", v + "-right");
                // sets the background of the parent node
                nodeParent.style.backgroundImage = currentSlideArray[i].data.bg;
            }
        }

        /* UTILITY METHODS*/
        // sets up sliders and returns the array of sliders.
        function initializeSliders() {
            var slider1 = $('#slider1');
            var slider2 = $('#slider2');
            var slider3 = $('#slider3');
            var sliders = [slider1, slider2, slider3];
            // set up each silder
            sliders.forEach(function (sliderElem) {
                // configuration for slider
                sliderElem.unslider(sliderConfig);
                // gets children of the slider (i.e. left and right children)
                //  and changes HTMLCollection objects to arrays
                var sliderLeft = [].slice.call(sliderElem[0].getElementsByClassName("wg-left"));
                var sliderRight = [].slice.call(sliderElem[0].getElementsByClassName("wg-right"));
                // attaching event listeners
                // stop slider on mouse over
                sliderElem[0].addEventListener("mouseover", createStopSlider(sliderElem));
                // restart slider on mouse out
                sliderElem[0].addEventListener("mouseout", createStartSlider(sliderElem));
                // clicking the left of a slider slides to prev panel
                sliderLeft.forEach(function (wgLeft) {
                    wgLeft.addEventListener("click", createPrevPanel(sliderElem));
                });
                // clicking the right of a slider slides to the next panel
                sliderRight.forEach(function (wgRight) {
                    wgRight.addEventListener("click", createNextPanel(sliderElem));
                });
            });
            return sliders;

            /* CALLBACK FUNCTION FACTORIES */

            function createStopSlider(sliderElem) {
                return function () {
                    sliderElem.data('unslider').stop();
                }
            }

            function createStartSlider(sliderElem) {
                return function () {
                    sliderElem.data('unslider').start();
                }
            }

            function createPrevPanel(sliderElem) {
                return function () {
                    sliderElem.data('unslider').prev();
                }
            }

            function createNextPanel(sliderElem) {
                return function () {
                    sliderElem.data('unslider').next();
                }
            }
        }

        // sets up the slide reservoirs by nodifying all slide objects and
        // storing in the slide reservoir
        function initializeSlides() {
            // fill energy slide reservoir first
            var energyArray = sgComp.e.objects;
            // class for the div element. different between power and carbon divs.
            var classString = "power wg-right";
            // reference holder for what current reservoir we are filling. Crucial for
            // fillReservoir() to work correctly.
            var currentReservoir;
            currentReservoir = 'e';
            // fill in slideReservoir1.e by nodifying items in sgComp.e.objects
            energyArray.forEach(fillReservoir);
            // repeat for carbon divs and slides.
            var carbonArray = sgComp.w.objects;
            classString = "carbon wg-right";
            currentReservoir = 'w'
            console.log(carbonArray);
            carbonArray.forEach(fillReservoir);

            function fillReservoir (val, i, arr) {
                //nodify
                var node = nodifyRight(val, classString);
                //package
                var slide = new SlideContainer(node, val.obj, val);
                //push to reservoir
                slideReservoir1[currentReservoir].push(slide);
            }
            /* creates a node object using the index of the comparison object in the comparison
             object array, as well as a string for classes to be put in. Returns a jquery object with the node. */
            function nodifyRight(cObj, classString) {
                // TODO [x]: finish nodify
                // gets the comparison object
                if (classString === undefined) {
                    console.error("no classes defined for node");
                    classString = "noclass";
                }
                // create the right side div. will replace the div with id=p2-right.
                var $rightDiv = $(document.createElement('div'))
                    .addClass(classString);
                // creates the p element for the #p2-right div
                var rightHTMLString = compStringConcat(cObj.rText, cObj.obj);
                // appends the p element to the right div
                $rightDiv.append(rightHTMLString);
                // updates the margins for the p element
                $($rightDiv[0].childNodes).css({
                    "margin-left": cObj.rText.margin.left,
                    "margin-top": cObj.rText.margin.top
                });
                return $rightDiv;
            }

            /* returns an HTML string including all the spans and line breaks.
            cObj is the text object, while className is the name of the span class*/
            function compStringConcat(textObject, className) {
                var r = "";
                r += "<p>" + textObject.up + "<br />"; // insert upper text, line break
                r += spanify(textObject, className); // insert middle text with spans
                r += textObject.down + "</p>"; // insert bottom text with ending p tag
                return r;
            }

            // returns a span element with the span text and the enclosing span elements
            function spanify(cObj, className) {
                var r = "<span class='" + className + "'>"; //span class="xyz"
                r += "<span class='big'>" // span class="big"
                r += cObj.span // insert your text here
                r += "</span></span>"; // /span /span
                return r;
            }
        }

        /* function constructor for slide container. Holds a node object as well as some data. */
        function SlideContainer(node, name, compObj) {
            /* a DOM node */
            this.node = node;
            /* the span name to be replaced */
            this.name = name;
            /* a reference to the object holding all the data (from the sgComp.e.obj array) */
            this.data = compObj;
        }
    }


    //FUTURE: finish the matrix controller
    /* MatrixController makes and updates the solar power generation matrix. */
    function MatrixController() {
        var margin = {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10
        };
        var width = 980 - margin.left - margin.right;
        var height = 300 - margin.top - margin.bottom;
        var cellSize = 16;
        // make sure to set the domain for color as well
        var color = d3.scale.quantize().range(['#987200', '#9b7500', '#9f7800', '#a37a00', '#a67d00', '#aa8000', '#ae8301', '#b28601', '#b58801', '#b98b01', '#bd8e02', '#c09002', '#c49403', '#c79704', '#cb9a04', '#cf9c05', '#d39f06', '#d6a207', '#daa508', '#dea80a', '#e1ab0b', '#e5ae0d', '#e9b10e', '#ecb510', '#f0b711', '#f3bb13', '#f7bd15', '#fbc117', '#fec419', '#ffc82d', '#ffcd3e', '#ffd04e', '#ffd55d', '#ffd96c', '#ffdc7a', '#ffe089', '#ffe498', '#ffe8a5']);

        this.update = function update() {
            initializeMatrix();
        }

        function initializeMatrix() {
            var svg = d3.select('#matrix').select("svg");
            svg.attr("width", width)
                .attr("height", height);

            color.domain([d3.min(pc.stat.spec.kwhGen), d3.max(pc.stat.spec.kwhGen)]);

            var boxes = svg.selectAll(".cell")
                .data(pc.stat.spec.kwhGen)
                .enter().append("rect")
                .attr("width", cellSize).attr("height", cellSize)
        }
    }

    /* UTILITY METHODS*/

    /* bindButtons does what it says ;)
     */
    function bindButtons() {
        lifetimeBtn.addEventListener("click", pc.chartLifetime.bind(pc));
        yearBtn.addEventListener("click", pc.chartYear.bind(pc));
        monthBtn.addEventListener("click", pc.chartMonth.bind(pc));
        weekBtn.addEventListener("click", pc.chartWeek.bind(pc));
        dayBtn.addEventListener("click", pc.chartDay.bind(pc));
        // FUTURE: finish the back button, part 2
        //    backBtn.addEventListener("click", pc.chartBack.bind(pc));
    }

    /* Returns an array from start to stop, including start and stop. */
    function range(start, stop){
        var r = [];
        for (var i = start; i <= stop; i ++){
            r.push(i);
        }
        return r;
    }

    /* r is the array, i and x are elements you want to swap */
    function swap(r, i, j){
        let x = r[i];
        r[i] = r[j];
        r[j] = x;
        return;
    }

});
