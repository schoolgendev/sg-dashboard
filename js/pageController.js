// pageController is responsible for updating the dashboard.
// Uses a publish/subscribe kind of architecture between sgStats and
// the various dashboard components (e.g. widgets, charts...)
(function () {
    // global variables
    var SgStats, // holds statistics being subscribed to by dashboard components
        SgNames,
        SgCompare, // holds comparators for widgets.
        ApiCallArray, // holds general form API strings
        TimePeriod, // holds time divisions. Used in the chart.
        MonthName, // holds month names in an array. Used in the chart.
        DaysInMonth, // holds the number of days in each month. Used in the chart.
        date,
        sliders; // holds references to slider objects. Used for each widget.

    // holds names for classes for page
    SgNames = {};
    SgCompare = {
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
    // used for AJAX calls - remember to replace variable sections
    ApiCallArray = [
        "http://api.schoolgen.co.nz/ProgramCharts/schoolgen/2016", //gets yearly data
        "http://api.schoolgen.co.nz/ProgramCharts/schoolgen/{year}/{month}/{day}/{period}", //variable period
        "http://api.schoolgen.co.nz/ProgramCharts/" // gets schoolgen specific statistics
    ];
    TimePeriod = {
        HOUR: "hour",
        DAY: "day",
        WEEK: "week",
        MONTH: "month",
        YEAR: "year",
        LIFETIME: "lifetime"
    };
    MonthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    DaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    date = new Date();

    /* BUTTONS AND HANDLERS */
    var lifetimeBtn = document.getElementById("btn-lifetime"),
        yearBtn = document.getElementById("btn-year"),
        monthBtn = document.getElementById("btn-month"),
        weekBtn = document.getElementById("btn-week"),
        dayBtn = document.getElementById("btn-day");

    function bindButtons(){
        var i;
        var handlerFactory = new HandlerFactory(); //TODO: make the handler factory
        var buttons = [dayBtn, weekBtn, monthBtn, yearBtn, lifetimeBtn];
        for (i = 0; i < buttons.length; i++){
            buttons[i].onclick = handlerFactory.createHandler(TimePeriod[i]);
        }

        function HandlerFactory() {
            this.createHandler = function (timePeriod, startDate, period){
                if (arguments.length > 1){
                    console.log("Not yet implemented start date/period handling.");
                }
                // figure out what time divisions are needed.

                // runnable is the function that will be returned.
                var runnable = function(){
                    // kill chart
                    // set up the loader
                    // set the time division
                    SgStats.currentGraphPeriod = timePeriod;
                    // make an API call. On API call success:
                    d3.json(apiCallString, function (err, xhr){
                        // kill loader
                        // set up chart
                        // replace widget numbers
                    })
                }
                return runnable;
            };
        }
    }

    /* CHART RELATED
    var date,
        chartMargin,
        chartWidth,
        chartHeight,
        chart,
        scales,
        axes;

    date = new Date();
    chartMargin = {
        top: 20,
        right: 40,
        bottom: 40,
        left: 60
    };
    width = 700 - margin.left - margin.right;
    height = 500 - margin.top - margin.bottom;
    scales = createScalesNoDomain(height, width);
    axes = createAxes(scales.x, scales.y);

*/
    /* Spin Loader functions.
     * Assumes presence of #spinloader element in DOM.*/
    function makeLoader() {
        //TODO: fix display problem for the loaded spin block.
        d3.select("#spinLoader").style("display", "block");
    }
    function killLoader() {
        d3.select("#spinLoader").style("display", "none");
    }


})();
