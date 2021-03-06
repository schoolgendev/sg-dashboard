// pageController is responsible for updating the dashboard.
// Uses a publish/subscribe kind of architecture between sgStats and
// the various dashboard components (e.g. widgets, charts...)
glob = this;
$(document).ready(function () {

    /* GLOBAL VARIABLES*/
    var util = new Utilities();
    // sgObjects has all the objects you want to compare to
    var sgComp = {
        // ENERGY: taken from rob's spreadsheet
        e: {
            /* the objects that we are comparing the energy levels to */
            objects: [
                // object 0 - smartphone battery, 0.01
                {
                    obj: "batt-phone",
                    val: 0.01,
                    bg: "url('img/smart-phone.jpg')",
                    topcolor: "#fecf2d",
                    bottomcolor: "#FFFFFF",
                    lText: {
                        margin: {
                            top: "null",
                            left: "null"
                        }
                    },
                    rText: {
                        margin: {
                            top: "20px",
                            right: "20px"
                        },
                        up: "Recharge",
                        span: "",
                        down: "smartphones!"
                    },
                    tooltip: "A smartphone battery need 10 Watt-hours of energy to fully charge."
                },
                // 1 tablet, 0.02
                {
                    obj: "batt-tablet",
                    val: 0.02,
                    bg: "url('img/tablet-wg-bg.jpg')",
                    topcolor: "#fecf2d",
                    bottomcolor: "#FFFFFF",
                    lText: {
                        margin: {
                            top: "null",
                            left: "null"
                        }
                    },
                    rText: {
                        margin: {
                            top: "20px",
                            right: "20px"
                        },
                        up: "Recharge",
                        span: "",
                        down: "tablets!"
                    },
                    tooltip: "A tablet battery needs 20 Watt-hours of energy to fully charge."
                },
                // 2 chromebook, 0.04 kwh
                {
                    obj: "batt-chromebook",
                    val: 0.04,
                    bg: "url('img/laptop-wg-bg.jpg')",
                    topcolor: "#fecf2d",
                    bottomcolor: "#FFFFFF",
                    lText: {
                        margin: {
                            top: "null",
                            left: "null"
                        }
                    },
                    rText: {
                        margin: {
                            top: "20px",
                            right: "20px"
                        },
                        up: "Recharge",
                        span: "",
                        down: "Chromebooks!"
                    },
                    tooltip: "One chromebook battery needs about 40 Watt-hours of energy to fully charge."
                },
                // 3 tdf cyc 40kmph, 0.230
                {
                    obj: "ebikes",
                    val: 0.4,
                    bg: "url('img/ebike-wg-bg.jpg')",
                    topcolor: "#fecf2d",
                    bottomcolor: "#FFFFFF",
                    lText: {
                        margin: {
                            top: "null",
                            left: "null"
                        }
                    },
                    rText: {
                        margin: {
                            top: "20px",
                            right: "20px"
                        },
                        up: "Recharge",
                        span: " ",
                        down: "e-bikes"
                    },
                    tooltip: "A typical electric bike battery stores around 400 Watt-hours of energy"
                },
                // 4 home batt enphase, 1.2 kwh
                {
                    obj: "home-batt-enphase",
                    val: 1.2,
                    bg: "url('img/home-batt.jpg')",
                    topcolor: "#fecf2d",
                    bottomcolor: "#FFFFFF",
                    lText: {
                        margin: {
                            top: "null",
                            left: "null"
                        }
                    },
                    rText: {
                        margin: {
                            top: "20px",
                            right: "20px",
                        },
                        up: "Recharge",
                        span: "",
                        down: "Enphase Home Batteries"
                    },
                    tooltip: "Based on a 1.2 kilowatt-hour Enphase battery"
                },
                // 5 tnt, 1.2 per kg
                {
                    obj: "TNT-kg",
                    val: 1.2,
                    bg: "url('img/tnt-wg-bg.jpg')",
                    topcolor: "#fecf2d",
                    bottomcolor: "#FFFFFF",
                    precision: 0,
                    lText: {
                        margin: {
                            top: "null",
                            left: "null"
                        }
                    },
                    rText: {
                        margin: {
                            top: "20px",
                            right: "20px"
                        },
                        up: "Energy in",
                        span: " kg",
                        down: " of TNT!"
                    },
                    tooltip: "1kg of TNT stores 1.2 kilowatt-hours of energy, which is released explosively!"
                },
                // 6 coal, 4kwh per kg
                {
                    obj: "coal-kg",
                    val: 4,
                    bg: "url('img/coal-wg-bg.jpg')",
                    topcolor: "#fecf2d",
                    bottomcolor: "#FFFFFF",
                    precision: 0,
                    lText: {
                        margin: {
                            top: "null",
                            left: "null"
                        }
                    },
                    rText: {
                        margin: {
                            top: "20px",
                            right: "20px"
                        },
                        up: "Heat from",
                        span: " kg",
                        down: "of burning coal"
                    },
                    tooltip: "1kg of coal stores 4 kilowatt-hours of energy"
                },
                // 7 home batt panasonic, 0.8
                {
                    obj: "home-batt-panasonic",
                    val: 8.0,
                    bg: "url('img/home-batt.jpg')",
                    topcolor: "#fecf2d",
                    bottomcolor: "#FFFFFF",
                    precision: 0,
                    lText: {
                        margin: {
                            top: "null",
                            left: "null"
                        }
                    },
                    rText: {
                        margin: {
                            top: "20px",
                            right: "20px"
                        },
                        up: "Recharge",
                        span: "",
                        down: "Panasonic home batteries!"
                    },
                    tooltip: "Home battery stores up to 8 kilowatt-hours of electrical energy"
                },
                // 8 km driven tdf cyclist - 0.0057 km per kwh (5.7km per wh)
                // Above is incorrect: should have divided by val
                // 1 km uses only 0.0057 kwh
                // invert val to get correct answer ie 1/0.0057 = 175
                {
                    obj: "MULTIPLY-km-driven-tdf-cyclist",
                    val: 175,
                    bg: "url('img/tour_cyclist.jpg')",
                   topcolor: "#fecf2d",
                    bottomcolor: "#FFFFFF",
                    precision: 2,
                    lText: {
                        margin: {
                            top: "null",
                            left: "null"
                        }
                    },
                    rText: {
                        margin: {
                            top: "20px",
                            right: "20px"
                        },
                        up: "Energy used by 1 Tour de France cyclist going",
                        span: " km",
                        down: ""
                    },
                    tooltip: "Living things use chemical potential energy"
                },
                // 9 tdf cyclist, 21.2
                {
                    obj: "tdf-cyclist-total",
                    val: 21.2,
                    bg: "url('img/tour_cyclist.jpg')",
                    topcolor: "#fecf2d",
                    bottomcolor: "#FFFFFF",
                    precision: 2,
                    lText: {
                        margin: {
                            top: "null",
                            left: "null"
                        }
                    },
                    rText: {
                        margin: {
                            top: "20px",
                            right: "20px"
                        },
                        up: "Energy used by",
                        span: " ",
                        down: "cyclists racing the whole Tour de France"
                    },
                    tooltip: "A distance of more than 3500 km, each rider uses a bit over 21 kWh of food energy to do the course"
                },
                // object 10 - km driven tesla, 6.25 km per kwh
                {
                    obj: "MULTIPLY-km-driven-tesla",
                    val: 6.25,
                    bg: "url('img/tesla-ecar.jpg')",
                   topcolor: "#fecf2d",
                    bottomcolor: "#FFFFFF",
                    precision: 0,
                   lText: {
                        margin: {
                            top: "null",
                            left: "null"
                        }
                    },
                    rText: {
                        margin: {
                            top: "20px",
                            right: "20px"
                        },
                        up: "Drive an electric car",
                        span: " km",
                        down: ""
                    },
                    tooltip: "Based on the Tesla Model S"
                },
                // 11 tesla batt charges, 90
                {
                    obj: "tesla-battery",
                    val: 90,
                    bg: "url('img/tesla-ecar.jpg')",
                    topcolor: "#fecf2d",
                    bottomcolor: "#FFFFFF",
                    precision: 0,
                    lText: {
                        margin: {
                            top: "null",
                            left: "null"
                        }
                    },
                    rText: {
                        margin: {
                            top: "20px",
                            right: "20px"
                        },
                        up: "Recharge a Tesla electric car",
                        span: " times",
                        down: ""
                    },
                    tooltip: "Based on the Tesla Model S (P85D model)"
                },
                // Train full power 1520 kW, 110km/h, 373 seated and standing passengers
                // note: objects beginning with MULTIPLY must be multiplied
                {
                    obj: "hours-driven-train",
                    val: 1520,
                    bg: "url('img/etrain.jpg')",
                    topcolor: "#fecf2d",
                    bottomcolor: "#FFFFFF",
                    precision: 0,
                    lText: {
                        margin: {
                            top: "null",
                            left: "null"
                        }
                    },
                    rText: {
                        margin: {
                            top: "20px",
                            right: "20px"
                        },
                        up: "Travel on an Electric train for",
                        span: " hours",
                        down: "at 110 km/h"
                    },
                    tooltip: "Based on Auckland's AMA electric train (3 cars) at maximum power"
                },
                // 13 TNT t, 1200
                {
                    obj: "TNT-tonne",
                    val: 1200,
                    bg: "url('img/tnt-wg-bg.jpg')",
                    topcolor: "#fecf2d",
                    bottomcolor: "#FFFFFF",
                    precision: 0,
                   lText: {
                        margin: {
                            top: "null",
                            left: "null"
                        }
                    },
                    rText: {
                        margin: {
                            top: "20px",
                            right: "20px"
                        },
                        up: "Energy in ",
                        span: " tonnes",
                        down: "of TNT!"
                    },
                    tooltip: "1 tonne of TNT stores 1.2 megawatt-hours of energy - released explosively!"
                },
                // 14 nz houses, 600
                {
                    obj: "nz-houses-month",
                    val: 583,
                    bg: "url('img/house-dark-bg.jpg')",
                   topcolor: "#fecf2d",
                    bottomcolor: "#FFFFFF",
                    precision: 0,
                    lText: {
                        margin: {
                            top: "null",
                            left: "null"
                        }
                    },
                    rText: {
                        margin: {
                            top: "20px",
                            right: "20px"
                        },
                        up: "Enough energy to run",
                        span: " houses",
                        down: "for a month!"
                    },
                    tooltip: "Electrical energy, not including energy from gas, wood etc."
                },
                // object 15 - oil barrels, 1.7k
                /*{
                    obj: "oil-barrels",
                    val: 1700,
                    bg: "url('img/oil-wg-bg.png')",
                    topcolor: "#AAAAAA",
                    bottomcolor: "#4F4F4F",
                    precision: 3,
                    lText: {
                        smallprint: ""
                    },
                    rText: {
                        up: "Equivalent to",
                        span: " barrels",
                        downrightf oil!"
                    },
                    tooltip: "Default title"
                },  */
                // 15 nz generation, 1.7k
                {
                    obj: "nz-generation-seconds",
                    val: 1716,
                    bg: "url('img/nz-map.jpg')",
                   topcolor: "#fecf2d",
                    bottomcolor: "#FFFFFF",
                    precision: 3,
                    lText: {
                        margin: {
                            top: "null",
                            left: "null"
                        }
                    },
                    rText: {
                        margin: {
                            top: "20px",
                            right: "20px"
                        },
                        up: "Run all of NZ's electricity grid for",
                        span: "",
                        down: "seconds"
                    },
                    tooltip: "The whole of NZ uses HUGE amounts of energy every second - you would need a lot of solar panels for this!"
                },
                // 16 nz houses, 7k. Do not delete/comment out.
                {
                    obj: "nz-houses-year",
                    val: 7000,
                    bg: "url('img/nz-map.jpg')",
                    topcolor: "#fecf2d",
                    bottomcolor: "#FFFFFF",
                    precision: 3,
                    lText: {
                        margin: {
                            top: "null",
                            left: "null"
                        }
                    },
                    rText: {
                        margin: {
                            top: "20px",
                            right: "20px"
                        },
                        up: "Enough electricity to run",
                        span: " houses",
                        down: "in NZ for a year!"
                    },
                    tooltip: "Electrical energy, not including energy from gas, wood etc."
                },
                // 17 nz generation, 102k
                {
                    obj: "nz-generation-minutes",
                    val: 102986,
                    bg: "url('img/nz-map.jpg')",
                   topcolor: "#fecf2d",
                    bottomcolor: "#FFFFFF",
                    precision: 3,
                    lText: {
                        margin: {
                            top: "null",
                            left: "null"
                        }
                    },
                    rText: {
                        margin: {
                            top: "20px",
                            right: "20px"
                        },
                        up: "Run all of NZ electricity grid for",
                        span: "",
                        down: "minutes"
                    },
                    tooltip: "The whole of NZ uses HUGE amounts of energy every second - you would need a lot of solar panels for this!"
                },
                // 18 wind turbine, 4k
                {
                    obj: "ge-wind-turbine-days",
                    val: 4110,
                    bg: "url('img/wind-turbine.jpg')",
                    topcolor: "#fecf2d",
                    bottomcolor: "#FFFFFF",
                    precision: 3,
                    lText: {
                        margin: {
                            top: "null",
                            left: "null"
                        }
                    },
                    rText: {
                        margin: {
                            top: "20px",
                            right: "20px"
                        },
                        up: "Generation from one Genesis wind turbine for",
                        span: "",
                        down: "days!"
                    },
                    tooltip: "A single Genesis Energy wind turbine produces 4,100kWh on an average day"
                },
                // 19 wind turbine, 125k
                {
                    obj: "ge-wind-turbine-month",
                    val: 125000,
                    bg: "url('img/wind-turbine.jpg')",
                    topcolor: "#fecf2d",
                    bottomcolor: "#FFFFFF",
                    precision: 3,
                    lText: {
                        margin: {
                            top: "null",
                            left: "null"
                        }
                    },
                    rText: {
                        margin: {
                            top: "20px",
                            right: "20px"
                        },
                        up: "Generation from 1 Genesis wind turbine for",
                        span: "",
                        down: "months!"
                    },
                    tooltip: "One Genesis wind turbine produces 125,000 kWh in an average month"
                },
                // 20 - electric train for 39 hours
                {
                    obj: "days-driven-etrain",
                    val: 36480,
                    bg: "url('img/etrain.jpg')",
                    topcolor: "#fecf2d",
                    bottomcolor: "#FFFFFF",
                    precision: 3,
                    lText: {
                        margin: {
                            top: "null",
                            left: "null"
                        }
                    },
                    rText: {
                        margin: {
                            top: "20px",
                            right: "20px"
                        },
                        up: "Travel on an Electric train for",
                        span: " days",
                        down: "at 110 km/h!"
                    },
                    tooltip: "Based on a full Auckland's AMA electric train (3 cars) at maximum power"
                }
            ],
            /* also returns an array of numbers corresponding to comparison objects,
             but does it in a lazy way.*/
            threshLevel: function threshLevel(x) {
                var slideIndexArray = [];
                sgComp.e.objects.forEach(function (v, i, a) {
                    var widgetNumber;
                    if (v.obj.indexOf('MULTIPLY') >= 0){
                        widgetNumber = x * v.val;
                    } else {
                        widgetNumber = x / v.val;
                    }
                    if (widgetNumber > 10 && widgetNumber < 2500000){
                        slideIndexArray.push(i);
                    }
                });
                return slideIndexArray;
            }
        },
        // WEIGHT : taken from http://www.bluebulbprojects.com/measureofthings/
        w: {
            objects: [
                {
                    obj: "wg-cow",
                    val: 680,
                    bg: "url('img/cow.jpg')",
                   topcolor: "#fecf2d",
                    bottomcolor: "#FFFFFF",
                    lText: {
                        margin: {
                            top: "null",
                            left: "null"
                        }
                    },
                    rText: {
                        margin: {
                            top: "20px",
                            right: "20px"
                        },
                        up: "Gas equals the mass of",
                        span: " cows!",
                        down: ""
                    },
                    tooltip: "Based on a 680 kg cow."
                },
                {
                    obj: "wg-car",
                    val: 1300, // mass in kg
                    bg: "url('img/normal-car2.png')",
                   topcolor: "#fecf2d",
                    bottomcolor: "#FFFFFF",
                    lText: {
                        margin: {
                            top: "null",
                            left: "null"
                        }
                    },
                    rText: {
                        margin: {
                            top: "20px",
                            right: "20px"
                        },
                        up: "Gas equals the mass of",
                        span: " cars!",
                        down: ""
                    },
                    tooltip: "Compared to the weight of a 2016 Toyota Corolla"
                },
                {
                    obj: "wg-elephant",
                    val: 7500, //one elephant = ~7.5 t
                    bg: "url('img/elephant.jpg')",
                   topcolor: "#fecf2d",
                    bottomcolor: "#FFFFFF",
                    lText: {
                        margin: {
                            top: "null",
                            left: "null"
                        }
                    },
                    rText: {
                        margin: {
                            top: "20px",
                            right: "20px"
                        },
                        up: "Gas equals the mass of",
                        span: " elephants!",
                        down: ""
                    },
                    tooltip: "One African Elephant weighs around 7.5 tonnes"
                },
                {
                    obj: "wg-blue-whale",
                    val: 105000, //one blue whale = ~105 t
                    bg: "url('img/blue-whale.jpg')",
                   topcolor: "#fecf2d",
                    bottomcolor: "#FFFFFF",
                    lText: {
                        margin: {
                            top: "null",
                            left: "null"
                        }
                    },
                    rText: {
                        margin: {
                            top: "20px",
                            right: "20px"
                        },
                        up: "Gas equals the mass of",
                        span: " Blue Whales!",
                        down: ""
                    },
                    tooltip: "Average Blue Whale weighs about 105 tonnes"
                },
                {
                    obj: "wg-house",
                    val: 156000, //single level, unfurnished, 149 sq m = ~156 t
                    bg: "url('img/house-dark-bg.jpg')",
                    topcolor: "#fecf2d",
                    bottomcolor: "#FFFFFF",
                    lText: {
                        margin: {
                            top: "null",
                            left: "null"
                        }
                    },
                    rText: {
                        margin: {
                            top: "20px",
                            right: "20px"
                        },
                        up: "Gas equals the mass of",
                        span: " houses!",
                        down: ""
                    },
                    tooltip: "Even a single level, unfurnished house is pretty heavy!"
                },
                //5 (zero indexed)
                {
                    obj: "co2-car",
                    val: 2000,
                    bg: "url('img/normal-car2.png')",
                    topcolor: "#fecf2d",
                    bottomcolor: "#FFFFFF",
                    lText: {
                        margin: {
                            top: "null",
                            left: "null"
                        }
                    },
                    rText: {
                        margin: {
                            top: "20px",
                            right: "20px"
                        },
                        up: "Equivalent to taking ",
                        span: " cars",
                        down: "off the road for a year!"
                    },
                    tooltip: "One car emits about 2000 kg of carbon dioxide gas a year (depends on model and driving)"
                },
                // 6
                {
                    obj: "wg-kiwifruit",
                    val: 0.1,
                    bg: "url('img/kiwifruit-wg-bg.jpg')",
                    topcolor: "#fecf2d",
                    bottomcolor: "#FFFFFF",
                    lText: {
                        margin: {
                            top: "null",
                            left: "null"
                        }
                    },
                    rText: {
                        margin: {
                            top: "20px",
                            right: "20px"
                        },
                        up: "Gas equals the mass of",
                        span: "",
                        down: "kiwifruit"
                    },
                    tooltip: "Based on a 100g (0.1 kg) kiwifruit"
                },
                // 7
                {
                    obj: "wg-avocado",
                    val: 0.215,
                    bg: "url('img/Avocado.jpg')",
                   topcolor: "#fecf2d",
                    bottomcolor: "#FFFFFF",
                    lText: {
                        margin: {
                            top: "null",
                            left: "null"
                        }
                    },
                    rText: {
                        margin: {
                            top: "20px",
                            right: "20px"
                        },
                        up: "Gas equals the mass of",
                        span: "",
                        down: "avocados"
                    },
                    tooltip: "Based on a 215 gram (0.215 kg) avocado"
                }
            ],
            threshLevel: function threshLevel(x) {
                var slideIndexArray = [];
                sgComp.w.objects.forEach(function (v, i, a) {
                    var widgetNumber = x / v.val;
                    if (widgetNumber > 2 && widgetNumber < 100000){
                        slideIndexArray.push(i);
                    }
                });
                return slideIndexArray;
            }
        }
    };
    // returns an array of numbers with plus at end and minus taken out.

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
    pc.register(new ChartController());
    pc.register(new WidgetController());
    pc.register(new EGTextController());
    pc.chartDay();


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
        /* sgStats is the subject object*/
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
            console.err("observer removal failed");
        };

        /*preNotify() triggers preupdate mechanism for all registered observers*/
        var preNotify = this.preNotify = function () {
            console.log("====================================================================");
            console.log("======================= RUNNING PRENOTIFY ==========================");
            console.log("====================================================================");
            let i, obsCount = obsList.count();
            // cycle through observers, call preUpdate()
            for (i = 0; i < obsCount; i++) {
                if (typeof obsList.list[i].preUpdate === 'function') {
                    obsList.list[i].preUpdate();
                }
            }
        };

        /* notify() triggers the update mechanism for all registered observers. */
        var notify = this.notify = function () {
            console.log("====================================================================");
            console.log("======================== RUNNING NOTIFY ============================");
            console.log("====================================================================");
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

        /* PAGE CONTROLLER INTERFACE */

        /* chartPeriod(year, month, day, period) - gets the data using an API call
         for a given period, before calling notify on everything.
         If called with no parameters, the data period is the entire lifetime of schoolgen.
         Makes use of the top-level dc (data compiler) and the stat.
         Must set currentVisual and currentTimeDivs for this to work correctly,
          note that this is already done by the common interface methods (chartYear, chartDay etc)
         */
        this.chartPeriod = function chartPeriod(year, month, day, period) {
            var lifetimeStatCallFinished = false;
            // a signal variable for the AJAX request with callString1
            var programStatCallFinished = false;
            // a signal variable for the AJAX request with callString2
            var periodStatCallFinished = false;
            // callString1 and 2 are the URLs for the AJAX requests further down.
            // callString1 is for the general data
            var callString1 = ApiCallArray[2];
            var callString2;
            date = new Date(year, month, day);

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
            d3.json(ApiCallArray[0], lifetimeHandler);
            // 3. on success - throw data into sgStats
            // 4. use callback to trigger observer.notify() - this will e.g. kill the loader,
            //      redraw the graph, and replace the slider spans.

            /* AJAX ERROR/SUCCESS HANDLERS */
            // generalStatHandler is the callback method for callArray[2]
            function generalStatHandler(err, xhr) {
                //handle error
                if (err !== null) {
                    console.err("failed to complete request for general stats");
                    console.err(err);
                    return;
                }
                // compile in the general data
                dc.compileGeneralData(xhr);
                // if both calls finished, run notify
                programStatCallFinished = true;
                if (allCallsFinished()) {
                    pc.notify();
                }
            }
            // periodStatHandler is the callback method for callArray[0 or 1]
            function periodStatHandler(err, xhr) {
                //handle error
                if (err !== null) {
                    console.err("failed to complete request for specific stats");
                    console.err(err);
                    return;
                }
                // compile stats
                dc.compileSpecificData(xhr, pc.stat.currentTimeDivs, pc.stat.currentVisual);
                // run notify when both calls finish
                periodStatCallFinished = true;
                if (allCallsFinished()) {
                    pc.notify();
                }
            }

            function lifetimeHandler (err, xhr) {
                if (err !== null) {
                    console.err("failed to complete request for 2017 stats");
                    console.err(err);
                    return;
                }
                const co2Factor = 0.12;
                const co2Saved2016 = 190119;
                const kwhGenerated2016 = 1370287;
                // 0 indexed - starts at 2007. 2017 is index 10.
                var kwhGenerated2017 = xhr[10].kWhGen;
                var co2Saved2017 = co2Factor * kwhGenerated2017;
                var totalCO2Saved = co2Saved2017 + co2Saved2016;
                var totalKWhGenerated = kwhGenerated2016 + kwhGenerated2017;

                dc.compileLifetimeCO2(totalCO2Saved, totalKWhGenerated);

                lifetimeStatCallFinished = true;
                if (allCallsFinished()) {
                    pc.notify();
                }
            }

            function allCallsFinished(){
                return programStatCallFinished &&
                    periodStatCallFinished &&
                    lifetimeStatCallFinished;
            }
            /* UTILITY METHODS*/
            /* generateCallString(year, month, day, period) uses ApiCallArray[1] to
                create a new string to be used in an API call for a specified period.
            */
            function generateCallString(year, month, day, period) {
                // returnable is the string that will eventually be returned.
                var returnable = ApiCallArray[1];
                // month label is the required month name for the api.
                var monthLabel = MonthName[month];
                // this replaces all the generic {time} labels with the actual values.
                returnable = returnable.replace(new RegExp("{year}"), year)
                    .replace(new RegExp("{month}"), monthLabel)
                    .replace(new RegExp("{day}"), day)
                    .replace(new RegExp("{period}"), period);
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
                date = new Date();
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
                date = new Date();
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
                date = new Date();
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
                date = new Date();
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
            console.warn("chart back to be implemented")
        }

        /* zoom into a date */
        this.zoomIn = function zoomIn(year, month, day) {
            if (stat.currentTimeDivs === TimePeriod.YEAR ){
                this.chartYear(year, month);
                return;
            }
            else if (stat.currentTimeDivs === TimePeriod.MONTH ){
                //chart month (jan 1, jan 2, jan 3...)
                this.chartMonth(year, month)
                return;
            }
            else if (stat.currentTimeDivs === TimePeriod.DAY ){
                //chart day (3:00, 3:30, 4:00, 4:30...)
                this.chartDay(year, month, day);
            }
            else {
                return null;
            }
        }

        /* zoom out of a date */
        this.zoomOut = function zoomOut(year, month, day) {
            var backdate = new Date(year, month + 1, day)
            if (stat.currentVisual === TimePeriod.DAY){
                // zoom out means call chartWeek possibly? or chartMonth?
                backdate.setDate(backdate.getDate() - 3);
                this.chartWeek(backdate.getFullYear(), backdate.getMonth() - 1, backdate.getDate());
            }
            else if (stat.currentVisual === TimePeriod.WEEK){
                // zoom out means call chart month
                backdate.setDate(backdate.getDate() - 14);
                this.chartMonth(backdate.getFullYear(), backdate.getMonth() - 1, backdate.getDate());
            }
            else if (stat.currentVisual === TimePeriod.MONTH){
                // call chart year
                backdate.setMonth( backdate.getMonth() - 6);
                this.chartYear(backdate.getFullYear(), backdate.getMonth());
            }
            else if (stat.currentVisual === TimePeriod.YEAR) {
                // call chartLifetime
                this.chartLifetime();
            }
            else if (stat.currentVisual === TimePeriod.LIFETIME) {
                // do nothing, return null
                console.warn("furtherest zoom reached");
                return null;
            }
            else {
                console.warn("cannot zoom out");
                return null;
            }
        }

    }

    /* DataCompiler function constructor.
    An object that compiles the data into the given stat.
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
            if (! stat.general) {
                stat.general = {};
            }
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
            if (! stat.general.egco2){
                stat.general.egco2 = {};
            }
            stat.general.egco2.today = {
                    energy: xhr.EnergyGeneratedToday,
                    co2: xhr.CO2SavedToday
            }
                // total gets set in compileLifetimeCO2
            console.log("compile general data complete");
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

            /* dateFunc extracts the appropriate dateString from the dataObjects.
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

            var timestampFunc = function (group) {
                return group.TimeStamp;
            }

            //mapName tells us what the name will be on the stat.
            kwhGenFunc.mapName = "kwhGen";
            co2SavedFunc.mapName = "co2Saved";
            dateFunc.mapName = "dateString";
            xdomainFunc.mapName = "xdomain";
            timestampFunc.mapName = "timestamp"
                /* add your additional statistics here*/

            /* this piece of code actually puts the data onto the stats object*/
            var funcArray = [kwhGenFunc, co2SavedFunc, dateFunc, xdomainFunc, timestampFunc];
            funcArray.forEach(function (funcInArr) {
                stat.spec[funcInArr.mapName] = mapToArray(xhr, funcInArr);
            });

            /* 2028 ERROR FIX*/
            if (pc.stat.currentVisual === TimePeriod.LIFETIME) {
                var pcs = pc.stat.spec;
                pcs.xdomain.pop();
                pcs.co2Saved.pop();
                pcs.dateString.pop();
                pcs.kwhGen.pop();
                pcs.timestamp.pop()
            }

            // additional field: the sum of the kwh
            pc.stat.spec.kwhSum = +d3.sum(pc.stat.spec.kwhGen).toPrecision(4);
            pc.stat.spec.co2Sum = +d3.sum(pc.stat.spec.co2Saved).toPrecision(4);

            console.log("compile specific data complete");

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

        this.compileLifetimeCO2 = function compileLifetimeCO2(co2, kwh){
            if (! stat.general){
                stat.general = {};
            }
            if (! stat.general.egco2){
                stat.general.egco2 = {};
            }
            stat.general.egco2.total = {
                energy: kwh,
                co2: co2
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
                console.err("observer retrieval failed - out of bounds")
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
        // boolean flag, true if chart already drawn, false if not yet drawn
        var init = false;
        var zoomInArray = [];
        var margin = {
            top: 20,
            right: 40,
            bottom: 40,
            left: 60
        };
        var width = 525 - margin.left - margin.right;
        var height = 450 - margin.top - margin.bottom;
        var parseDate = d3.time.format("%d-%m-%Y %H:%M").parse;
        // set up chart
        var chart = d3.select("#kwhGenChart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        // range for the scales
        var chartRange = {
            x: [0, width],
            y: [height, 0],
        };
        // scales for the data
        var chartScale = {
            x: d3.time.scale(),
            y: d3.scale.linear(),
            w: d3.scale.ordinal() //sorts out the width of the bars
        };
        var dataDomain = {}; // domain for the data
        var dataAccessor = []; // array holding a new mapped array
        var chartDomain = {}; // domain for the chart. See updateScales for assignment.
        // axes use the scales and are for the chart
        // hook scales to axes
        var axes = {
            x: d3.svg.axis()
                .scale(chartScale.x)
                .orient("bottom")
                .ticks(4),
            y: d3.svg.axis()
                .scale(chartScale.y)
                .orient("left")
                .ticks(6)
            };

        var ttDiv = d3.select('.chart').append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // hook ranges to scales
        chartScale.x.range(chartRange.x);
        chartScale.y.range(chartRange.y);
        chartScale.w.rangeRoundBands(chartRange.x, 0.1);

        drawChart();

        /* creates and compiles the chart */
        function drawChart() {
            // create x axis
            chart.append("g")
                .attr("class", "x axis x-axis")
                .attr("transform", "translate(0," + height + ")");
            // create y axis
            chart.append("g")
                .attr("class", "y axis y-axis");
        }

        /* updates the domain, sets the scale's domains as well */
        function updateScales() {
            dataDomain.x = pc.stat.spec.timestamp;
            dataDomain.y = pc.stat.spec.kwhGen;
            chartDomain.x = d3.extent(dataDomain.x, function (d) {
                return parseDate(d);
            });
            chartDomain.y = [0, d3.max(dataDomain.y)];
            chartDomain.w = [0, dataDomain.x.length];
            // this assigns the chart scale domains.
            // See the root of object for assignment of chart scale ranges.
            chartScale.x.domain(chartDomain.x);
            chartScale.y.domain(chartDomain.y);
            chartScale.w.domain(dataDomain.x);
            // creates a new data accessor object
            dataAccessor = dataDomain.y.map(function (v, i, a) {
                return {
                    time: dataDomain.x[i],
                    kwh: dataDomain.y[i]
                };
            });
        }

        /* hooks up axes with scales and redraws them */
        function updateAxes() {
            axes.x.scale(chartScale.x);
            axes.y.scale(chartScale.y);
            d3.select('.x-axis')
                .transition().duration(600)
                .call(axes.x.tickSize(-height, 0, 0))
            d3.select('.y-axis')
                .transition().duration(600)
                .call(axes.y
                  .tickSize(-width, 0, 0)
                  .tickFormat(function (d) {
                if (pc.stat.currentTimeDivs === TimePeriod.YEAR || pc.stat.currentTimeDivs === TimePeriod.MONTH){
                    return d/1000;
                } else {
                    return d;
                }
              }));
            // remove path tag with class "domain" to get rid of y-axis
            d3.selectAll(".y-axis").select(".domain").remove();
            chart.selectAll(".y-axis-label").remove();
            chart.append("text")
                .attr("transform", "rotate(-90)")
                .attr("class", "y-axis-label")
                .attr("y", 0 - margin.left)
                .attr("x", 0 - (height/2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .html(function (){
                    if (pc.stat.currentTimeDivs === TimePeriod.YEAR ||
                       pc.stat.currentTimeDivs === TimePeriod.MONTH) {
                        return "<tspan>ENERGY</tspan> MWh";
                    } else {
                        return "<tspan>ENERGY</tspan> kWh";
                    }
            });
        }

        /* updates the rectangles on the chart representing the data */
        function updateRects() {
            // use the kwhgen for data domain
            var bars = chart.selectAll('.bar')
                // for dataAccessor's assignment see updateScales()
                .data(dataAccessor);

            // EXIT SELECTION
            bars.exit()
                .transition().duration(250)
                .attr("y", height)
                .attr("height", 0)
                .remove();

            // ENTER SELECTION
            bars.enter().append("rect")
                .attr("class", "bar")
                .attr("x", function (d, i) {
                    return chartScale.w(d.time);
                })
                .attr("width", function (d, i) {
                    return chartScale.w.rangeBand();
                })
                .attr("height", 0)
                .attr("y", height)
                .transition().delay(250).duration(300)
                .attr("y", function (d) {
                    return chartScale.y(d.kwh);
                })
                .attr("height", function (d) {
                    return height - chartScale.y(d.kwh);
                });


            // UPDATE SELECTION
            bars.attr("class", "bar")
                .transition().duration(250)
                .attr("y", height)
                .attr("height", 0)
                .transition()
                // x position depends on scaling from dates to pixels
                .attr("x", function (d, i) {
                    return chartScale.w(d.time);
                })
                // height of rect extends downwards. use height and scale.
                .attr("width", function (d, i) {
                    return chartScale.w.rangeBand();
                })
                .transition().duration(300)
                .attr("y", function (d) {
                    return chartScale.y(d.kwh);
                })
                .attr("height", function (d) {
                    return height - chartScale.y(d.kwh);
                });

        }

        /* Puts event handlers for click events and mouseovers onto the bars */
        function attachEventHandlers() {
            var bars = chart.selectAll('.bar');
            var ttc = new TooltipController();

            // we should probably add in e.g. a 'zoomIn' and a 'zoomOut' function
            // to the PageController object to further separate views and logic
            // and enhance reusability
            bars.on("mouseover", mouseOnBar)
                .on("mousemove", null)
                .on("mouseout", mouseOffBar)
                .on("click", chartClickHandler)

            /* EVENT HANDLER WRAPPER METHODS*/
            function mouseOnBar(d, i){
                ttc.on(d, i);
            }

            function mouseOffBar(d, i){
                ttc.off(d, i);
            }

            /* wrapping object for tooltip methods */
            function TooltipController() {
                /* handler for tooltip on */
                this.on = function tooltipOn(d, i) {
                    ttDiv.transition().duration(100)
                        .style("opacity", 0.9);
                    var ttText;
                    if (pc.stat.currentTimeDivs === TimePeriod.HOUR || pc.stat.currentTimeDivs === TimePeriod.DAY){
                        ttText = d.kwh + " kWh";
                    } else {
                        ttText = Math.floor(d.kwh/1000) + " MWh";
                    }
                    ttDiv.html("<strong>" + formatDate(d.time) + "</strong><hr><br>" +
                            ttText)
                        .style("left", Math.floor(chartScale.x(parseDate(d.time))) + "px")
                        .style("top", height + margin.bottom + 4 + "px");
                }

                /* handler for tooltip off */
                this.off = function tooltipOff(d, i) {
                    ttDiv.transition().duration(100)
                        .style("opacity", 0);
                }

                /* formats the date according to currentTimeDivs */
                function formatDate(date) {
                    var dateFormat;
                    var dateParse = "%d-%m-%Y %H:%M"
                    date = d3.time.format(dateParse).parse(date);
                    var timeDivs = pc.stat.currentTimeDivs;
                    if (timeDivs === TimePeriod.YEAR) {
                        dateFormat = "%Y"
                    } else if (timeDivs === TimePeriod.DAY) {
                        dateFormat = "%d %b %Y";
                    } else if (timeDivs === TimePeriod.MONTH) {
                        dateFormat = "%b %Y";
                    } else {
                        dateFormat = "%H:%M %d %b";
                    }
                    return d3.time.format(dateFormat)(date);
                }

            }

            function chartClickHandler(d, i) {
                var t = breakDate(d);
                if (d3.event.shiftKey){
                    // TODO: do the shift action (start selection or zoom into period)
                    console.log("shift clicked");
                    if (zoomInArray.length === 0){
                        // push a new date onto the array
                        // provide some sort of visual feedback
                        console.log("first date set");
                    }
                    else {
                        // push date onto array
                        // work out the period
                        // call chartPeriod with the start date and the period length
                        console.log("second date set, zoom in");
                    }
                }
                else if (d3.event.altKey){
                    pc.zoomOut(t.year, t.month, t.day);
                }
                else {
                    console.log(d);
                    ttc.off(d, i);
                    pc.zoomIn(t.year, t.month, t.day);
                }
            }

            function breakDate(d){
                // date is in form of dd-mm-yyyy HH:MM
                var year, month, day;
                year = + d.time.substr(6,4);
                month = + d.time.substr(3,2) - 1;
                day = + d.time.substr(0,2);
                return { year: year, month: month, day: day };
            }

        }

        /* called while API call occuring but before data comes through */
        this.preUpdate = function preUpdate() {
            // makes the loader
            d3.select('#spinLoader').attr('style', 'display:absolute');
            zoomInArray = [];
        }

        /* called on data change*/
        this.update = function update() {
            // kills the loader animation
            d3.select("#spinLoader").attr('style', 'display:none');
            updateScales();
            updateAxes();
            updateRects();
            attachEventHandlers();
        }

    }


    /* WidgetController makes and updates the widget. */
    function WidgetController() {
        //A configuration object used for all sliders.
        var sliderConfig = this.sliderConfig = {
            autoplay: true,
            delay: 5000,
            infinite: false,
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
            var fillingPool = 'e' // choose which pool of slides to repopulate
            slidePool1.e = []; // clear out the pool before refilling it
            clearedSlideIndicesKWH.forEach(reservoirToPool); // repopulates the pool
            fillingPool = 'w'
            slidePool1.w = [];
            clearedSlideIndicesCO2.forEach(reservoirToPool);

            // Array with div ids (p1-right, p2-right etc) - will be written onto
            // the node later using attr()
            var powerIdArray = ["p1", "p2", "p3", "p4", "p5"];
            var carbonIdArray = ["c1", "c2"];

            // Select 5 slides in the power pool and 2 in the carbon pool, at random.

            // store a random selection of 5 power-related SlideContainers into powerSlideContainers.
            var powerSlideContainers = getRandomNodes(5, slidePool1.e);
            // store a random selection of 2 CO2-related SlideContainers into carbonSlideContainers.
            var carbonSlideContainers = getRandomNodes(2, slidePool1.w);
            // fixedSlideContainers has all the fixed nodes as slides.
            // required for divReplacer to work properly
            var currentSlideArray = powerSlideContainers;
            // replaces each node in the DOM using the powerIdArray, divReplacer, and the currentSlideArray variable.
            powerIdArray.forEach(divReplacer);
            currentSlideArray = carbonSlideContainers;
            carbonIdArray.forEach(divReplacer);

            replaceAllSpans();
            resetSliderHandlers();


            /* utility methods */

            function replaceAllSpans() {
                //fixed class names.
                var houseEnergyValue = $.grep(sgComp.e.objects, function(elem){
                    return elem.obj === 'nz-houses-year'
                })[0].val;
                var carCO2Value = $.grep(sgComp.w.objects, function(elem){
                    return elem.obj === 'co2-car'
                })[0].val;
                var fcn = [
                    /* needs desperate refactoring */
                    //0
                    {
                        name: ".sum-kwhGen",
                        val: pc.stat.spec.kwhSum
                    },
                    //1
                    {
                        name: ".sum-co2",
                        val: pc.stat.spec.co2Sum
                    },
                    //2
                    {
                        name: ".lt-kwhGen",
                        val: pc.stat.general.egco2.total.energy
                    },
                    //3
                    {
                        name: ".lt-CO2",
                        val: pc.stat.general.egco2.total.co2
                    },
                    //4
                    {
                        name: ".lt-schools",
                        val: 92
                    },
                    //5
                    {
                        name: ".lt-money-saved",
                        val: "100,000"
                    },
                    //6
                    {
                        name: ".record-day-whole-programme",
                        val: pc.stat.general.records.total.timestamp
                    },
                    //7
                    {
                        name: ".record-day-generation",
                        val: pc.stat.general.records.total.val
                    },
                    //8
                    {
                        name: ".record-school-last-hour",
                        val: pc.stat.general.bestSch.hour.name
                    },
                    //9
                    {
                        name: ".record-gen-last-hour",
                        val: pc.stat.general.bestSch.hour.val
                    },
                    //10
                    {
                        name: ".record-school-last-week",
                        val: pc.stat.general.bestSch.week.name
                    },
                    //11
                    {
                        name: ".record-gen-last-week",
                        val: pc.stat.general.bestSch.week.val
                    },
                    //12
                    {
                        name: ".record-school-last-year",
                        val: pc.stat.general.bestSch.year.name
                    },
                    //13
                    {
                        name: ".record-gen-last-year",
                        val: pc.stat.general.bestSch.year.val
                    },
                    //14
                    {
                        name: ".lt-houses",
                        val: pc.stat.general.egco2.total.energy /
                            houseEnergyValue
                    },
                    //15
                    {
                        name: ".lt-carsCO2",
                        val: pc.stat.general.egco2.total.co2 /
                            carCO2Value
                    }
                ];

                /* plz refactor */

                // kwh sliders
                [0, 2, 7, 9, 11, 13].forEach(function (x) {
                    replaceNumericalSpan(Number(Math.floor(fcn[x].val)), 'kWh', fcn[x].name);
                });
                // co2 slider divs
                [1, 3].forEach(function (x) {
                    replaceNumericalSpan(Number(Math.floor(fcn[x].val)), 'kg', fcn[x].name);
                });
                replaceSpan(fcn[4].val, 'schools', fcn[4].name, true);
                replaceSpan(fcn[5].val, '$', fcn[5].name, true, true);
                // records
                replaceDateSpan(fcn[6].val, fcn[6].name);
                [8, 10, 12, 14, 15].forEach(function (x) {
                    replaceSpan(fcn[x].val, "", fcn[x].name, true);
                });
                [14, 15].forEach(function (x) {
                    replaceSpan(fcn[x].val, "", fcn[x].name, 0);
                });

                sgComp.e.objects.forEach(comparatorReplacer.bind(this, pc.stat.spec.kwhSum));
                sgComp.w.objects.forEach(comparatorReplacer.bind(this, pc.stat.spec.co2Sum));

                function comparatorReplacer(sumData, x) {
                    var comparatorValue = x.val;
                    // if start of the className has MULTIPLY, create reciprocal of comparator
                    if (x.obj.match(/^MULTIPLY/)) {
                        comparatorValue = 1 / comparatorValue;
                    }
                    // divide sum by comparator
                    var newValue = sumData / comparatorValue;
                    // replace spans of className with new value
                    replaceNumericalSpan(newValue, "", x.obj);
                }

                function replaceNumericalSpan(value, unit, spanClassName){

                    if (pc.stat.currentTimeDivs === TimePeriod.MONTH || pc.stat.currentTimeDivs === TimePeriod.YEAR ){
                        if (spanClassName === ".sum-kwhGen"){
                            value /= 1000;
                            unit = 'MWh';
                        }
                        else if (spanClassName === ".sum-co2" ) {
                            value /= 1000;
                            unit = 'tonnes';
                        }
                    }
                    if ( spanClassName === ".lt-kwhGen" ){
                        value /= 1000;
                        unit = 'MWh';
                    }
                    if (spanClassName === ".lt-CO2"){
                        value /= 1000;
                        unit = 'tonnes';
                    }
                    var formatValue = d3.format(',')
                    value = formatValue(Math.round(value));
                    var replacer = '<span class="' + undot(spanClassName) + '">';
                    replacer += value + " " + unit;
                    replacer += '</span>';
                    $(replacer).replaceAll(redot(spanClassName));
                }

                //replaces date spans
                function replaceDateSpan(dateString, spanClassName) {
                    var replacer = '<span class="' + undot(spanClassName) + '">';
                    replacer += dateString.substr(8, 2) + " ";
                    replacer += MonthName[+dateString.substr(5, 2) - 1] + ", ";
                    replacer += dateString.substr(0, 4) + '</span>'
                    $(replacer).replaceAll(spanClassName);
                }

                // Replaces a given span (identified by class name) with a new span,
                //  where the inner html is the value followed by a unit.
                // TODO: PROBLEMS SO MANY PROBLEMS REPLACE THIS SOON
                function replaceSpan(value, unit, spanClassName, noFixPrecision, prefixUnit) {
                    // create replacer string
                    var replacer = '<span class="' + undot(spanClassName) + '">';
                    if (prefixUnit) {
                        replacer += unit + '';
                    }
                    if (noFixPrecision === true) {
                        replacer += value;
                    } else if (typeof noFixPrecision === 'number' && noFixPrecision !== 0) {
                        replacer += value.toPrecision(noFixPrecision);
                    } else if (noFixPrecision === 0) {
                        replacer += value.toFixed(0);
                    } else {
                        replacer += value.toPrecision(3)
                    }
                    if (!prefixUnit) {
                        replacer += ' ' + unit;
                    }
                    replacer += '</span>'
                    $(replacer).replaceAll(redot(spanClassName))
                }
                // removes the first character from a string if that character is a period.
                function undot(spanClassName) {
                    if (spanClassName.charAt(0) === '.') {
                        return spanClassName.substr(1);
                    }
                    return spanClassName;
                }

                function redot(spanClassName) {
                    if (spanClassName.charAt(0) !== '.') {
                        return "." + spanClassName;
                    }
                    return spanClassName;
                }
            }

            // takes slide e (where e is from array a) from a reservoir and inserts them into pool[i].
            // the reservoir and pool are demarcated by a variable, fillingPool.
            function reservoirToPool(e, i, a) {
                // copy reference from slideReservoir to slidePool for each index
                slidePool1[fillingPool][i] = slideReservoir1[fillingPool][e];
            }

            // takes an array of objects and an argument x. Returns an array with x elements
            // from the array taken randomly.
            function getRandomNodes(x, array) {
                //BUG: DOESN'T SHUFFLE THE FINAL ELEMENT
                // create an array randArray of length = array.length
                let randArray = util.range(0, array.length - 1);
                // shuffle randArray
                for (var i = 0; i < randArray.length; i++) {
                    // select random number from i to length
                    let z = Math.floor(i + Math.random() * (randArray.length - i));
                    // swap with i
                    util.swap(randArray, z, i);
                }
                // deal out the nodes
                var returnable = [];
                for (var i = 0; i < x; i++) {
                    var nextSlide = array[randArray[i]];
                    returnable.push(nextSlide);
                }
                return returnable;
            }

            // function handler - needs currentSlideArray to work
            function divReplacer(v, i, a) {
                // get the nodes to replace - these are div elements (p1, p2, p3...)
                var nodeParent = document.getElementById(v);

                var leftNode = document.getElementById(v + '-left');
                leftNode.style.color = currentSlideArray[i].data.topcolor;
                console.log(currentSlideArray[i].data);
                
                var nodeToReplace = document.getElementById(v + '-right');
                // check that nodeToReplace exists
                if (nodeToReplace !== null) {
                    nodeParent.removeChild(nodeToReplace);
                }
                // attach new node
                try {
                     $(nodeParent).append(currentSlideArray[i].node);
                    // rewrite the id to the node, replacing whatever id was attached to that node previously
                    $(currentSlideArray[i].node).attr("id", v + "-right");
                    // sets the background of the parent node
                    nodeParent.style.backgroundImage = currentSlideArray[i].data.bg;
                    nodeParent.style.height = "160px";
                    nodeParent.style.color = currentSlideArray[i].data.bottomcolor;
                } catch (err) {
                    console.error(err);
                }

                try {
                    console.log("adding tooltip: " + currentSlideArray[i].data.tooltip)
                    $(nodeParent).attr("title", currentSlideArray[i].data.tooltip);
                } catch (err) {
                    console.error(err);
                }
            }

            /* Resets handlers for slider 1 (the top slider with the dynamic slides) */
            function resetSliderHandlers() {
                var scf = new SliderCallbackFactory();
                var slider = $('#slider1');
                var sliderRight = [].slice.call(slider[0].getElementsByClassName("wg-right"));
                // only the right div was replaced - only redo right div
                sliderRight.forEach(function (wgRight) {
                    wgRight.onclick = scf.next(slider);
                });
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
                var scf = new SliderCallbackFactory();
                // stop slider on mouse over
                sliderElem[0].addEventListener("mouseover", scf.stop(sliderElem), true);
                // restart slider on mouse out
                sliderElem[0].addEventListener("mouseout", scf.start(sliderElem), true);
                // clicking the left of a slider slides to prev panel
                sliderLeft.forEach(function (wgLeft) {
                    wgLeft.onclick = scf.prev(sliderElem);
                });
                // clicking the right of a slider slides to the next panel
                sliderRight.forEach(function (wgRight) {
                    wgRight.onclick = scf.next(sliderElem);
                });
            });
            return sliders;

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
            carbonArray.forEach(fillReservoir);

            function fillReservoir(val, i, arr) {
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
                return $rightDiv;
            }

            /* returns an HTML string including all the spans and line breaks.
            cObj is the text object, while className is the name of the span class*/
            function compStringConcat(textObject, className) {
                var r = "<p>" + textObject.up + " "; // insert upper text, line break
                r += spanify(textObject, className); // insert middle text with spans
                r += " " + textObject.down + "</p>"; // insert bottom text with ending p tag
                return r;
            }

            // returns a span element with the span text and the enclosing span elements
            function spanify(cObj, className) {
                var r = " <span class='" + className + "'>"; //span class="xyz"
                r += "</span> " + cObj.span; + " " // insert your text here
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

        /* Callback function factory. Used for mouseout/mouseover/click events on sliders. */
        function SliderCallbackFactory() {
            this.stop = function createStopSlider(sliderElem) {
                return function () {
                    sliderElem.data('unslider').stop();
                }
            }
            this.start = function createStartSlider(sliderElem) {
                return function () {
                    sliderElem.data('unslider').start();
                }
            }
            this.prev = function createPrevPanel(sliderElem) {
                return function () {
                    sliderElem.data('unslider').prev();
                    sliderElem.data('unslider').stop();
                }
            }
            this.next = function createNextPanel(sliderElem) {
                return function () {
                    sliderElem.data('unslider').next();
                    sliderElem.data('unslider').stop();
                }
            }

        }
    }

    // changes the text above the chart
    function EGTextController(){
        var energyGen = document.getElementById('energyGen');
        var currentDate = document.getElementById('currentDate');
        var energyTooltip = document.getElementById('energy-tooltip')

        var kwhString = "1 kilowatt-hour is the unit of ENERGY on your electricity bill."
        var mwhString = "1 Megawatt-hour = 1000 kilowatt-hours"
        this.update = function () {
            // set upper level text
            energyGen.textContent = util.cutKWHSum(pc.stat.spec.kwhSum);
            currentDate.textContent = util.getCurrentDateString();
            // set tooltip text
            var timeDivs = pc.stat.currentTimeDivs;
            if (timeDivs === TimePeriod.HOUR || timeDivs === TimePeriod.DAY){
                energyTooltip.textContent = kwhString;
            }
            else if (timeDivs === TimePeriod.MONTH || timeDivs === TimePeriod.YEAR) {
                energyTooltip.textDecoration = mwhString;
            }
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


    function Utilities() {
        /* Returns an array from start to stop, including start and stop. */
        this.range = function range(start, stop) {
            var r = [];
            for (var i = start; i <= stop; i++) {
                r.push(i);
            }
            return r;
        };

        /* r is the array, i and x are elements you want to swap */
        this.swap = function swap(r, i, j) {
            let x = r[i];
            r[i] = r[j];
            r[j] = x;
            return;
        };

        /* returns an array of numbers. kind of like range. used in sgComp object. */
        this.slideArray = function slideArray(start, stop, plus, minus) {
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

        /* Takes a number and an array of units to cut via 1000s */
        this.cutKWHSum = function cutKWHSum(x) {
            //take x, if more than 1000, divide by 1000 and increase unit magnitude.
            // repeat while x > 1000
            var prefixArray = ['kWh', 'MWh', 'GWh'];
            var prefixIndex = 0;
            /*if (x > 1000) {
                x = x / 1000;
                prefixIndex++;
            }*/
            var timeDivs = pc.stat.currentTimeDivs;

            if (timeDivs === TimePeriod.DAY || timeDivs === TimePeriod.HOUR){
                prefixIndex = 0;
            } else if (timeDivs === TimePeriod.MONTH || timeDivs === TimePeriod.YEAR){
                x /= 1000;
                prefixIndex = 1;
            }
            return Math.round(x) + " " + prefixArray[prefixIndex];
        }

        this.getCurrentDateString = function getCurrentDateString (){
            var ts =  pc.stat.spec.timestamp;
            var parse = d3.time.format("%d-%m-%Y %H:%M").parse;
            var format = d3.time.format("%d %b %Y")
            if (pc.stat.currentVisual === TimePeriod.DAY) {
                return format(new Date(parse(ts[0])));
            }
            else {
                return format(new Date(parse(ts[0]))) + " - " + format(new Date(parse(ts[ts.length - 1])));
            }
        }
    }

});
