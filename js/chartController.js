// chartController.js provides the behavioural control for the energy chart.
// Requires JQuery and D3 plugins.

SGS = {};

apiCallArray = [
    "http://api.schoolgen.co.nz/ProgramCharts/schoolgen/2016", //gets yearly data
    "http://api.schoolgen.co.nz/ProgramCharts/schoolgen/{year}/{month}/{day}/{period}", //gets variable data
    "http://api.schoolgen.co.nz/ProgramCharts/" // gets whole program data
];
$(document).ready(function () {
    // globals
    TimePeriod = {
        HOUR: "hour",
        DAY: "day",
        MONTH: "month",
        YEAR: "year"
    };
    MonthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    DaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    var date = new Date();

    var margin = {
        top: 20,
        right: 40,
        bottom: 40,
        left: 60
    };
    var width = 700 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    var scales = createScalesNoDomain(height, width);
    var axes = createAxes(scales.x, scales.y);

    // initialize the chart
    var chart;

    function makeLoader() {
        d3.select("#spinLoader").style("display", "block");
    }

    function killLoader() {
        d3.select("#spinLoader").style("display", "none");
    }

    function initializeChart() {
        chart = d3.select("#kwhGenChart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    }
    initializeChart();
    // REQUIRES D3.js

    // calls methods for charting each year 2008 - present
    function chartProgramme() {
        d3.json(apiCallArray[0], function (err, xhr) {
            if (err !== null) {
                console.log("failed to complete request");
                return;
            }
            //bind information to SGS
            compileData(xhr, TimePeriod.YEAR);

            // set domain for scales
            scales.x.domain(SGS.year);
            scales.y.domain([0, d3.max(SGS.kwhGen)]);

            // 2 - bind data to charts
            // chart sel, axis, scale
            createEnergyChart(chart, axes, scales);
            //  set the y-axis scaler domain to maximum of whatever the kwhGen data is

        });
    }

    // calls methods for charting the given year
    // you are responsible for calling it with range of month: 0 - 11
    function chartPeriod(year, month, day, period) {
        // default value for current time division
        SGS.currentTimeDivs = SGS.currentTimeDivs || TimePeriod.YEAR;
        // e.g. 0 calls jan
        var monthLabel = MonthName[month];
        // create API string

        var callString = apiCallArray[1].replace(new RegExp("{year}"), year)
            .replace(new RegExp("{month}"), monthLabel)
            .replace(new RegExp("{day}"), day)
            .replace(new RegExp("{period}"), period);
        console.log(callString);
        // pass string into json call
        d3.json(callString, function (err, xhr) {
            if (err !== null) {
                console.log("failed to complete request");
                return;
            } else {
                // compile data from json onto the SGS object
                compileData(xhr, SGS.currentTimeDivs);

                // set domain for scales
                scales.x.domain(SGS[SGS.currentTimeDivs]);
                scales.y.domain([0, d3.max(SGS.kwhGen)]);

                // recreate chart
                createEnergyChart(chart, axes, scales);
            }
        });
    }
    /* puts data onto the SGS global object for the year.
     * @param: data object in form of [ year: [ kwhgen, timestamp, co2saved ...] ... ]
     * @returns: nothing
     * @statechange: SGS now has kwhGen, years, and co2Saved arrays
     */
    function compileData(data, timePeriod) {
        // create array of functions + names to be applied to data
        var getKWHGenerated, getTimePeriods, getCO2Saved, getDateString;


        getKWHGenerated = function (group) {
            return Math.round(group.kWhGen);
        }
        getKWHGenerated.mappedName = "kwhGen";

        getCO2Saved = function (group) {
            return Math.round(group.CO2Saved);
        }
        getCO2Saved.mappedName = "co2Saved";



        if (timePeriod === TimePeriod.YEAR) {
            getTimePeriods = function (group) {
                return group.TimeStamp.substr(6, 4);
            }
        } else if (timePeriod === TimePeriod.MONTH) {
            getTimePeriods = function (group) {
                return MonthName[group.TimeStamp.substr(3, 2) - 1];
            }
        } else if (timePeriod === TimePeriod.DAY) {
            getTimePeriods = function (group) {
                return group.TimeStamp.substr(0, 2);
            }
        } else if (timePeriod === TimePeriod.HOUR) {
            getTimePeriods = function (group) {
                return group.TimeStamp.substr(11, 5);
            }
        }
        getTimePeriods.mappedName = SGS.currentTimeDivs;

        getDateString = function (group) {
            var ts = group.TimeStamp
                // return the string to be used in the tooltip
            if (timePeriod === TimePeriod.YEAR) {
                return ts.substr(6, 4);
            }
            if (timePeriod === TimePeriod.MONTH) {
                return MonthName[ts.substr(3, 2) - 1] + " " + ts.substr(6, 4);
            }
            if (timePeriod === TimePeriod.DAY) {
                return ts.substr(0, 2) + " " + MonthName[ts.substr(3, 2) - 1];
            }
            if (timePeriod === TimePeriod.HOUR) {
                return ts.substr(11, 5) + " " + ts.substr(0, 2) + " " + MonthName[ts.substr(3, 2) - 1];
            }
        }
        getDateString.mappedName = "dateString"

        var funcArray = [getKWHGenerated, getTimePeriods, getCO2Saved, getDateString];
        // attach data to global object SGS by combing through each function
        funcArray.forEach(function (funcInArray) {
            SGS[funcInArray.mappedName] = mapToArray(data, funcInArray);
        });

        // API ERROR: fixes the 2028 error
        if (SGS.currentTimeDivs === TimePeriod.YEAR) {
            SGS.kwhGen.pop();
            SGS[SGS.currentTimeDivs].pop();
            SGS.co2Saved.pop();
        }
    }

    /* creates the actual chart for the yearly chart
     */
    function createEnergyChart(chartSelection, axis, scale) {
        //kill the loading graphic
        killLoader();
        // set x axis, create label for axis
        var selection = chartSelection.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(axis.x);
        if (SGS.currentTimeDivs === TimePeriod.HOUR) {
            selection.selectAll("text")
                .attr("transform", "rotate(-90)")
                .attr("x", -22)
                .attr("y", -4);
        }
        selection.append("text")
            .attr("y", 24).attr("x", width + 30).attr("dy", "0.71 em")
            .style("text-anchor", "end")
            .text(SGS.currentTimeDivs);

        // set y axis, create label for axis
        chartSelection.append("g")
            .attr("class", "y axis")
            .call(axis.y)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 12) // for the year axis label
            .attr("dy", "0.71 em")
            .style("text-anchor", "end")
            .text("kWh Generated");

        // set the kwh generated label at the top
        document.getElementById("energyGen").innerHTML = d3.sum(SGS.kwhGen) / 1000 + " MWh"

        // sets up the div for the tooltip
        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // data join + update selection
        var bars = chart.selectAll(".bar").data(SGS.kwhGen);
        // enter selection
        bars.enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d, i) {
                return scale.x(SGS[SGS.currentTimeDivs][i]);
            })
            .transition().delay(50).attr("y", function (d) {
                return scale.y(d);
            })
            .attr("height", function (d) {
                return height - scale.y(d);
            })
            .attr("width", scale.x.rangeBand());
        // exit selection
        bars.exit().remove();

        var energyChartObjectContainer = function (svgDiv) {
            return {
                div: svgDiv,
                func: function (param, i) {
                    param.html(SGS.dateString[i] + "<br /> KWH Generated: " + SGS.kwhGen[i])
                        .style("left", d3.event.pageX + "px")
                        .style("top", d3.event.pageY + "px");
                }
            }
        }

        /* creates a function for use in event handler, mouse on.
             * @param: objContainer - contains the div for the tooltip and the custom behaviour
             * @param: objContainer.div - the div element for the tooltip
             * @param: objContainer.func - the function with custom behavior in manipulating the div
                    Takes a single element, which is the div.
             */
        function createTooltipOnFunction(objContainer) {
            return (function (d, i) {
                objContainer.div.transition()
                    .duration(200)
                    .style("opacity", .9);
                objContainer.func(objContainer.div, i);
            });
        }
        /* creates a function for use in turning off the tooltip,
         * @param - the div element for the tooltip
         */
        function createTooltipOffFunction(tooltipDiv) {
            return function () {
                tooltipDiv.transition().duration(200).style("opacity", 0);
            }
        }
        bars.on("mouseover", createTooltipOnFunction(energyChartObjectContainer(div)))
            .on("mousemove", null)
            .on("mouseout", createTooltipOffFunction(div));

    }


    /* returns a two-element object of scale objects,
     * @param: height and width of your chart objects.
     * NOTE: domain is not set. Must set the domain when data retrieved.
     * @returns: Object.x = x scaler, Object.y = y scaler.
     */
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

    /* returns a two-element object of axes objects.
     * @param: two scale objects, x and y.
     * @returns: Object: x = xAxis, y = yAxis
     */
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

    /* i don't know how to use the regular map functions */
    function mapToArray(data, func) {
        arr = [];
        for (i = 0; i < data.length; i++) {
            arr.push(func(data[i]));
        }
        return arr;
    }

    /* co-erces elements you pass into this to a number*/
    function typeCoerce(d) {
        d.value = +d.value; // coerce to number
        return d;
    }


    function chartYear(year, month) {
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

    // call this function with range(month: 0 - 11)
    function chartMonth(year, month, day) {
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
        chartPeriod(year, month, day, period);
    }

    // range of month: 0 - 11 where 0 = jan
    function chartWeek(year, month, day) {
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

    function chartDay(year, month, day) {
        if (arguments.length < 3) {
            year = date.getFullYear();
            month = date.getMonth();
            day = date.getDate();
        }
        chartPeriod(year, month, day, 1)
    }

    function destroyEnergySVG() {
        var rootNode = document.getElementById("kwhGenChart");
        while (rootNode.hasChildNodes()) {
            rootNode.removeChild(rootNode.firstChild);
        }
        makeLoader();
    }

    /* --------------------------------- *
     *       script starts here!          *
     *  --------------------------------- */

    function reinitChart() {
        destroyEnergySVG();
        initializeChart();
    }


    //bind buttons
    document.getElementById("chart-lifetime").onclick = function () {
        reinitChart();
        SGS.currentTimeDivs = TimePeriod.YEAR;
        chartProgramme();
    };
    document.getElementById("chart-year").onclick = function () {
        reinitChart();
        SGS.currentTimeDivs = TimePeriod.MONTH;
        chartYear();
    };
    document.getElementById("chart-month").onclick = function () {
        reinitChart();
        SGS.currentTimeDivs = TimePeriod.DAY;
        chartMonth();
    };
    document.getElementById("chart-week").onclick = function () {
        reinitChart();
        SGS.currentTimeDivs = TimePeriod.DAY;
        chartWeek();
    };
    document.getElementById("chart-day").onclick = function () {
        reinitChart();
        SGS.currentTimeDivs = TimePeriod.HOUR;
        chartDay();
    };

    chartProgramme();
    //chartYear(2016);
});
