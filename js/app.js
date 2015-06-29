"use strict";

// creating the angular app
var chartExampleApp = angular.module("chartExampleApp", ["ngRoute", "ngResource"]);

chartExampleApp.controller("NavController", function navigationControllerFunction($rootScope, $scope, SalesInfoFactory)
{  
    $scope.init = function()
    {
        $scope.availableYears = SalesInfoFactory.getAvailableYearReports();        
        $scope.availableCategories = [];
        $scope.availableSubCategories = [];
        $scope.reportLoadParams = { };
    };   
    
    $scope.onYearSelect = function(selectedYear)
    {
        $scope.availableCategories = SalesInfoFactory.getCategoryByYear(selectedYear);
        $scope.reportLoadParams.selectedYear = selectedYear;
    };
    
    $scope.onCategoryChange = function(selectedCategoryId)
    {
        $scope.availableSubCategories = SalesInfoFactory.getSubCategoryByCategory(selectedCategoryId);
        $scope.reportLoadParams.selectedCategoryId = selectedCategoryId;
    };
    
    $scope.onSubCategoryChange = function(selectedSubCategoryId)
    {
        $scope.reportLoadParams.selectedSubCategoryId = selectedSubCategoryId;
        
        $rootScope.$emit("onFinishedSelection", $scope.reportLoadParams);        
    };
    
    $scope.init();
});

chartExampleApp.controller("CirclesController", function circleControllerFunction($rootScope, $scope, SalesInfoFactory)
{
    $scope.circles = { };
    $scope.circles.radius = 100;
    $scope.circles.leftMargin = 20;
    $scope.reportData = [];
    $scope.selectedCircle = -1;
    $scope.reportParameters = null;
    
    $scope.onCircleClick = function(index)
    {
        if (index !== $scope.selectedCircle)
        {
            $scope.selectedCircle = index;
            $rootScope.$emit("onCircleSelection", {
                    "parameters": $scope.reportParameters,
                    "data": $scope.reportData[$scope.selectedCircle]
                }
            );
        }
    };
    
    $rootScope.$on("onFinishedSelection", function(evt, params)
    {
        $scope.reportParameters = params;
        
        SalesInfoFactory.getSalesInformation(params.selectedYear, params.selectedCategoryId, params.selectedSubCategoryId).then(function(response)
        {
            $scope.reportData = response.data;
            // set a default selected circle
            $scope.onCircleClick(0);
        });
    });
});

chartExampleApp.controller("BarChartController", function circleControllerFunction($rootScope, $scope, SalesInfoFactory)
{
    $scope.show = false;
    
    $rootScope.$on("onCircleSelection", function (evt, params)
    { 
        $scope.show = true;
        $scope.report = params;
        
        var 
            workingDataSet = $scope.report.data.country_data.yearly_distribution,
            svgWidth = document.getElementById("barChart").clientWidth,
            svgHeight = document.getElementById("barChart").clientHeight,
            barWidth = 20,
            svg = d3.select("#barChart > svg"),
            padding = 5;
        
        // refactoring the substring call to a member method of the workingDataSet json
        for (var i = 0; i < workingDataSet.length; i++)
        {
            workingDataSet[i].getSalesNumber = function()
            {
                return this.sales.substring(0, this.sales.length - 1);
            };
        }
      
        // cleaning the svg for the new chart
        svg.remove();
        svg = d3.select("#barChart").append("svg");        
        
        var margin = {top: 50, right: 20, bottom: 50, left: 50},
            width = svgWidth - margin.left - margin.right,
            height = svgHeight - margin.top - margin.bottom;
        
        var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
        var y = d3.scale.linear().range([height, 0]);

        var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");
        
        var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .ticks(10);
        
        // svg receives the g element back because everything should be under this element so the transform is applied to all
        svg = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                
        x.domain(workingDataSet.map(function(d) { return d.quarter; }));
        y.domain([0, d3.max(workingDataSet, function(d) { return d.getSalesNumber(); })]);
        
        svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", "-.55em")
                .attr("transform", "rotate(-90)");
        
        svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Sales");
        
        svg.selectAll("bar")
                .data(workingDataSet)
                .enter().append("rect")
                .style("fill", "steelblue")
                .attr("x", function (d) 
                {
                    return x(d.quarter) + 20; // +20 not to cover the "Sales" text in the Y axis
                })
                .attr("width", x.rangeBand() - 20) // -20 so the bars don't get too big
                .attr("y", function (d) 
                {
                    return y(d.getSalesNumber()); 
                })
                .attr("height", function (d) {
                    return height - y(d.getSalesNumber());
                });
    });
});

chartExampleApp.controller("InformationTableController", function circleControllerFunction($rootScope, $scope, SalesInfoFactory)
{
    $scope.show = false;
    
    $rootScope.$on("onCircleSelection", function (evt, params)
    { 
          $scope.show = true;
          $scope.report = params;
    });
});

chartExampleApp.directive("salesCircle", function()
{
    return {
        restrict: "E",
        templateUrl: "assets/reportCircle.html"
    };
});

chartExampleApp.factory('SalesInfoFactory', function salesInfoFactory($http)
{
    var salesInfoFactory =
    {
        /**
         * 
         * @returns {Array}
         */
        getAvailableYearReports: function()
        {
            return [
                { year: 2012 },
                { year: 2013 },
                { year: 2014 }
            ];
        },
        /**
         * 
         * @param {type} year
         * @returns {Array}
         */
        getCategoryByYear: function (year)
        {
            return [
                { categoryId: 1, categoryName: "Category 1" },
                { categoryId: 2, categoryName: "Category 2" },
                { categoryId: 3, categoryName: "Category 3" }                
            ]; 
        },
        /**
         * 
         * @param {type} categoryId
         * @returns {Array}
         */
        getSubCategoryByCategory: function (categoryId)
        {
            return [
                { subCategoryId: 1, subCategoryName: "Sub-Category 1" },
                { subCategoryId: 2, subCategoryName: "Sub-Category 2" },
                { subCategoryId: 3, subCategoryName: "Sub-Category 3" }                
            ]; 
        },
        /**
         * Simulating a web service that list the 
         * @param {type} year
         * @param {type} category
         * @param {type} subcategory
         * @returns {unresolved}
         */
        getSalesInformation: function(year, categoryId, subCategoryId)
        {
            return $http.get("assets/nets-sales.json");        
        }
    };
    
    return salesInfoFactory;
});