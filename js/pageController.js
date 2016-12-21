// pageController is responsible for updating the dashboard.
// Uses a publish/subscribe kind of architecture between sgStats and
// the various dashboard components (e.g. widgets, charts...)
(function () {

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

    /* PageController constructor function*/
    function PageController(){
        /* SUBJECT/OBSERVER-RELATED LOGIC */

        /* sgStats is the subject for the observers */
        this.sgStats = {};
        /* obsList is the list of observers for the subject. */
        this.obsList = new ObserverList();
        /* register (observer) pushes a new observer object to the observation list. */
        this.register = function(observer){
            this.obsList.add(observer);
        }
        /* deregister (observer) removes a given observing object from the observer list. */
        this.deregister = function(observer){
            let index = this.obsList.indexOf(observer, 0);
            if (index != -1 ){
                this.obsList.removeAt(index);
                return;
            }
            // removal failed - couldn't find the observing object in the list.
            console.log("observer removal failed");
        }
        /* notify() triggers the update mechanism for all registered observers. */
        this.notify = function(){
            // cycle through observers, call update()
            let i, obsCount = this.obsList.count();
            for (i = 0; i < obsCount; i++){
                if (typeof obsList[i].update === 'function'){
                    obsList[i].update();
                }
            }
        }
        /*preNotify() triggers preupdate mechanism for all registered observers*/
        this.preNotify = function(){
            let i, obsCount = this.obsList.count();
            // cycle through observers, call preUpdate()
            for (i = 0; i < obsCount; i++){
                if (typeof obsList[i].preUpdate === 'function'){
                    obsList[i].preUpdate();
                }
            }
        }

        /* PAGE CONTROLLER INTERFACE */

        /* chartPeriod(year, month, day, period) - gets the data using an API call
         for a given period, before calling notify on everything.
         */
        this.chartPeriod (year, month, day, period){
            //TODO: finish chartPeriod
            // general workflow
            // 1. call observer.preNotify() - this will e.g. kill the graph and launch the loader
            this.preNotify();
            // 2. make API call. will need to make two API calls.
            // 3. on success - throw data into sgStats
            // 4. use callback to trigger observer.notify() - this will e.g. kill the loader,
            //      redraw the graph, and replace the slider spans.
        }

        /* chartYear(year, month) - charts an entire year starting from month/year
            Note: month range is 0 - 11.
        */
        this.chartYear = function (year, month) {
            // no arg call: returns current year from start
            if (arguments.length === 0) {
                year = date.getFullYear();
                month = 0;
            }
            // call with year: returns that year from start of year
            if (arguments.length === 1) {
                month = 0;
            }
            chartPeriod(year, month, 1, 365);
        }
        /* chartMonth(year, month, day) either charts a whole month,
         or charts 28 days back from a specific day.
         Note: month range is 0 - 11 */
        this.chartMonth = function (year, month, day) {
            var period;
            // no arg call: looks at last 28 days
            if (arguments.length === 0) {
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
        }
        /* chartWeek(year, month, day) is a convenience method for charting a week (7 days) from
            the day specified. If no day is specified, it looks at the current week (i.e. it charts
            from seven days before the current date.
            Note: range of month = 0 - 11
        */
        this.chartWeek = function (year, month, day) {
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
            chartPeriod(year, month, day, 7);
        }
        /* chartDay(year,month,day) charts an entire day in half hour columns.
        If called with less than three parameters, it charts the current date.
        */
        this.chartDay = function (year, month, day) {
            if (arguments.length < 3) {
                year = date.getFullYear();
                month = date.getMonth();
                day = date.getDate();
            }
            chartPeriod(year, month, day, 1)
        }

    }

    /* ObserverList is the base class for lists of observers.*/
    function ObserverList(){
        /* obsList is an array of observers */
        this.obsList = [];
        /* add(obs) registers an observer to the array of observers */
        this.add = function(obj){
            return this.obsList.push (obj);
        };
        /* count(obs) returns the number of observers registered. */
        this.count = function(){
            return this.obsList.length;
        };
        /* get(index) returns a specific observer by array index. */
        this.get = function (index){
            if (index > -1 && index < obsList.length ){
                return this.obsList[ index ];
            }
            else {
                console.log( "observer retrieval failed - out of bounds" )
                return false;
            }
        };
        /*indexOf(obj, startIndex) gets the index of an observer obj.
         Use startIndex to specify a start location for the search.
         The default startIndex is zero. Returns -1 on failure. */
        this.indexOf = function (obj, startIndex){
            let i = startIndex;
            while ( i < obsList.length ){
                if (this.obsList[i] === obj){
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
        this.removeAt = function (index){
            this.obsList.splice(index, 1);
        }
    }


    /* BUTTONS AND HANDLERS */
    var lifetimeBtn = document.getElementById("btn-lifetime");
    var yearBtn = document.getElementById("btn-year");
    var monthBtn = document.getElementById("btn-month");
    var weekBtn = document.getElementById("btn-week");
    var dayBtn = document.getElementById("btn-day");

    function bindButtons() {
        //TODO: bind button actions
    }

})();
