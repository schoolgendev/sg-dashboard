// pageController is responsible for updating the dashboard.
// Uses a publish/subscribe kind of architecture between sgStats and
// the various dashboard components (e.g. widgets, charts...)
glob = this;
$(document).ready(function () {

    /* GLOBAL VARIABLES*/

    // holds names for classes for page
    var SgNames = {};
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
    var SgCompare = {
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
    var ApiCallArray = [
        "http://api.schoolgen.co.nz/ProgramCharts/schoolgen/2016", //gets yearly data
        "http://api.schoolgen.co.nz/ProgramCharts/schoolgen/{year}/{month}/{day}/{period}", //variable period
        "http://api.schoolgen.co.nz/ProgramCharts/" // gets schoolgen specific statistics
    ];
    /* pc is the page controller for the widgets and charts and stuff.
     register with the pc to gain notification access. */
    var pc = new PageController();
    var dc = new DataCompiler(pc.statObj);
    var lifetimeBtn = document.getElementById("btn-lifetime");
    var yearBtn = document.getElementById("btn-year");
    var monthBtn = document.getElementById("btn-month");
    var weekBtn = document.getElementById("btn-week");
    var dayBtn = document.getElementById("btn-day");
    bindButtons();
    var cc = new ChartController();
    console.log(cc);
    var wc = new WidgetController();
    // TODO: link cc and wc with the pc
    // TODO: figure out why chart isn't being drawn
    pc.register(cc);
    pc.chartPeriod(2016, 01, 1, 01);


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
        var statObj = this.statObj = new SgStats();
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
                if (typeof obsList.list[i].update === 'function') {
                    obsList.list[i].update();
                }
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
         Makes use of the top-level dc (data compiler) and the statObj.
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
                dc.compileSpecificData(xhr, pc.statObj.currentTimeDivs, pc.statObj.currentVisual);
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
            this.statObj.currentVisual = TimePeriod.LIFETIME;
            this.statObj.currentTimeDivs = TimePeriod.YEAR;
            this.chartPeriod();
        };

        /* chartYear(year, month) - charts an entire year starting from month/year
            Note: month range is 0 - 11. If no args given, returns last twelve months.
        */
        this.chartYear = function chartYear(year, month) {
            this.statObj.currentVisual = TimePeriod.YEAR;
            this.statObj.currentTimeDivs = TimePeriod.MONTH;
            // no arg call: returns 12 months from current month
            if (arguments.length === 0 || typeof arguments[0] === 'object') {
                year = date.getFullYear() - 1;
                month = date.getMonth();
            }
            // call with year: returns that year from start of year
            if (arguments.length === 1) {
                month = 0;
            }
            this.chartPeriod(year, month, 1, 365);
        };

        /* chartMonth(year, month, day) either charts a whole month,
             or charts 28 days back from a specific day.
             Note: month range is 0 - 11 */
        this.chartMonth = function chartMonth(year, month, day) {
            this.statObj.currentVisual = TimePeriod.MONTH;
            this.statObj.currentTimeDivs = TimePeriod.DAY;
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
            this.statObj.currentVisual = TimePeriod.WEEK;
            this.statObj.currentTimeDivs = TimePeriod.DAY;
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
            this.statObj.currentVisual = TimePeriod.DAY;
            this.statObj.currentTimeDivs = TimePeriod.HOUR;
            if (arguments.length < 3) {
                year = date.getFullYear();
                month = date.getMonth();
                day = date.getDate();
            }
            this.chartPeriod(year, month, day, 1)
        };

    }

    /* DataCompiler function constructor.
    An object that compiles the xhr data into the given statObj.
    This data compiler object is specifically for the schoolgen programme.
    */
    function DataCompiler(statObj) {
        this.statObj = statObj;

        /* compileGeneralData(xhr) takes a data object and extracts the
        data required for widgets and other future things.
        */
        this.compileGeneralData = function compileGeneralData(xhr) {
            // statObj.bestSch will hold the record holding schools.
            // All values are in kwh.
            statObj.general = {};
            statObj.general.bestSch = {
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
            statObj.general.records = {
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
            statObj.general.egco2 = {
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
            console.log(pc.statObj);
        }

        /* compileSpecificData(xhr, timeDiv) - takes a data object and uses a
         timeDiv to extract data and assign appropriate date strings.
         */
        this.compileSpecificData = function compileSpecificData(xhr, timeDiv, currentVis) {
            /* statObj.spec will hold the period stats for the data*/
            statObj.spec = {};
            if (timeDiv === undefined || timeDiv === null) {
                statObj.currentTimeDivs = TimePeriod.HOUR;
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
            }
            else if (timeDiv === TimePeriod.MONTH) {
                dateFunc = function dateFunc(group) {
                    var ts = group.TimeStamp;
                    return MonthName[ts.substr(3, 2) - 1] + " " + ts.substr(6, 4);
                }
            }
            else if (timeDiv === TimePeriod.DAY) {
                dateFunc = function dateFunc(group) {
                    var ts = group.TimeStamp;
                    return ts.substr(0, 2) + " " + MonthName[ts.substr(3, 2) - 1] + " " + ts.substr(6, 4);
                }
            }
            else {
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
            }
            else if (timeDiv === TimePeriod.MONTH) {
                xdomainFunc = function (group) {
                    return MonthName[group.TimeStamp.substr(3, 2) - 1];
                }
            }
            else if (timeDiv === TimePeriod.DAY) {
                xdomainFunc = function (group) {
                    return group.TimeStamp.substr(0, 2);
                }
            }
            else  {
                xdomainFunc = function (group) {
                    return group.TimeStamp.substr(11, 5);
                }
            }

            //mapName tells us what the name will be on the statObj.
            kwhGenFunc.mapName = "kwhGen";
            co2SavedFunc.mapName = "co2Saved";
            dateFunc.mapName = "dateString";
            xdomainFunc.mapName = "xdomain";
            /* add your additional statistics here*/

            /* this piece of code actually puts the data onto the stats object*/
            var funcArray = [kwhGenFunc, co2SavedFunc, dateFunc, xdomainFunc];
            funcArray.forEach(function (funcInArr) {
                statObj.spec[funcInArr.mapName] = mapToArray(xhr, funcInArr);
            });

            console.log("compile specific data complete");
            console.log(pc.statObj);

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

    /* ObserverList is the base class for lists of observers.*/
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
        console.log("making chart");

        //TODO: finish chart controller
        var margin = {
            top: 20,
            right: 40,
            bottom: 40,
            left: 60
        };
        var width = 700 - margin.left - margin.right;
        var height = 500 - margin.top - margin.bottom;
        var scales = this.scales = createScalesNoDomain(height, width);
        var axes = this.axes = createAxes(scales.x, scales.y);
        var chart;

        /* preNotify - kills the current chart and replaces it with a loading animation. */
        this.preUpdate = function preUpdate() {
            destroyChart();
            makeLoader();
        }

        /* notify kills the loading animation, sets the scale for the chart, and then
            draws in the chart using pc.statObj.
        */
        this.update = function update() {
            console.log("chart notify started");
            killLoader();
            initializeChart();
            getScaleDomains();
            drawChart();
            console.log("chart notify complete");
        }

        /* drawChart is used in notify to actually create the chart graphic. */
        function drawChart(){
            // set up selection, call axis.x
            var selection = chart.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(axes.x);
            if (pc.statObj.currentTimeDivs === TimePeriod.HOUR){
                selection.selectAll("text")
                    .attr("transform", "rotate(-90)")
                    .attr("x", -22)
                    .attr("y", -4);
            }
            // draws the axis label for x
            selection.append("text")
                .attr("y", 24).attr("x", width + 30).attr("dy", "0.71 em")
                .style("text-anchor", "end")
                .text(pc.statObj.currentTimeDivs);
            // set up y axis and call axis.y, draw axis label
            chart.append("g")
                .attr("class", "y axis")
                .call(axes.y)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 12) // TODO: figure out what "for the axis label" means
                .attr("dy", "0.71 em")
                .style("text-anchor", "end")
                .text("kWh Generated");

            // sets the kwh generated label at the top
            document.getElementById("energyGen").innerHTML = d3.sum(pc.statObj.spec.kwhGen) + " KWh";

            // sets up the div for the tooltip. Initially starts at opacity = 0.
            var ttDiv = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            // sets up the columns for the column graph
            // data join + update selection
            var bars = chart.selectAll(".bar")
                .data(pc.statObj.spec.kwhGen);
            //enter selection
            bars.enter().append("rect")
                .attr("class", "bar")
                .attr("x", function (d, i){
                    return scales.x( pc.statObj.spec.xdomain[i] );
                })
                .attr("y", function (d) {
                    return scales.y(d);
                })
                .attr("height", function (d){
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
        function createTooltips(bars, ttDiv){
            //TODO: fill in the tool tip methods
            bars.on("mouseover", createTTOnFunc(createTTContainer(ttDiv)))
                .on("mousemove", null)
                .on("mouseout", createTTOffFunc(createTTContainer(ttDiv)))
                .on("click", changePeriod)

            function createTTContainer(tooltipDiv){
                return {
                    tt: tooltipDiv,
                    func: function (param, i) {
                        param.html(pc.statObj.spec.dateString[i] + "<br> KWH Generated: " +
                                  pc.statObj.spec.kwhGen[i])
                            .style("left", d3.event.pageX + "px")
                            .style("top", d3.event.pageY + "px");
                    }
                }
            }
            function createTTOnFunc(container){
                return (function (d, i) {
                    container.tt.transition()
                        .duration(200)
                        .style("opacity", .9);
                    container.func(container.tt, i);
                })
            }
            function createTTOffFunc(container){
                return (function () {
                    container.tt.transition()
                        .duration(200)
                        .style("opacity", 0);
                })
            }
            function changePeriod(d, i){
                // get old time div, if already at hour, cancel zoom operation
                var oldTimeDiv = pc.statObj.currentTimeDivs;
                var newTimeDiv = decrementTimePeriod(oldTimeDiv);
                if (newTimeDiv === null){
                    return;
                }
                // destroy tooltip
                var killTooltip = createTTOffFunc(createTTContainer(ttDiv));
                killTooltip();
                // get the new date
                var zoomInDate = pc.statObj.spec.dateString[i];
                var year, month, day, finalFunc;
                switch(newTimeDiv){
                    // zooming into a single month from a year
                    case TimePeriod.MONTH:
                        year = parseInt(zoomInDate);
                        month, day = 0;
                        finalFunc = pc.chartYear.bind(pc, year);
                        break;
                    case TimePeriod.DAY:
                        year = parseInt(zoomInDate.substr(4,4));
                        month = MonthName.indexOf(zoomInDate.substr(0,3));
                        day = 0;
                        finalFunc = pc.chartMonth.bind(pc, year, month);
                        break;
                    case TimePeriod.HOUR:
                        year = parseInt(zoomInDate.substr(7,4));
                        month = MonthName.indexOf(zoomInDate.substr(3,3));
                        day = parseInt(zoomInDate.substr(0,2));
                        finalFunc = pc.chartDay.bind(pc, year, month, day);
                        break;
                }
                if (finalFunc === undefined){
                    console.log("no final func");
                    return;
                }
                finalFunc();

                function decrementTimePeriod(old){
                    if (old === TimePeriod.YEAR){ return TimePeriod.MONTH; }
                    if (old === TimePeriod.MONTH){ return TimePeriod.DAY; }
                    if (old === TimePeriod.DAY){ return TimePeriod.HOUR; }
                    return null;
                }
            }
        }

        function getScaleDomains(){
            scales.x.domain(pc.statObj.spec.xdomain);
            scales.y.domain([0, d3.max(pc.statObj.spec.kwhGen)]);
        }

        /* sets the chart object and initializes it with a grouping svg element.*/
        function initializeChart() {
            chart = d3.select("#kwhGenChart")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
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

    /* WidgetController makes and updates the widget*/
    function WidgetController() {
        //TODO: start widget controller
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
    }

});
