"use strict";

// creating the angular app
var chartExampleApp = angular.module("chartExampleApp", ["ngRoute", "ngResource"]);

chartExampleApp.controller("NavController", function navigationController($scope, SalesInfoFactory)
{  
    $scope.init = function()
    {
        $scope.availableYears = SalesInfoFactory.getAvailableYearReports();        
        $scope.availableCategories = [];
        $scope.availableSubCategories = [];
        $scope.reportInfo = { };
    };   
    
    $scope.onYearSelect = function(selectedYear)
    {
        $scope.availableCategories = SalesInfoFactory.getCategoryByYear(selectedYear);
        $scope.reportInfo.selectedYear = selectedYear;
    };
    
    $scope.onCategoryChange = function(selectedCategoryId)
    {
        $scope.availableSubCategories = SalesInfoFactory.getSubCategoryByCategory(selectedCategoryId);
        $scope.reportInfo.selectedCategoryId = selectedCategoryId;
    };
    
    $scope.onSubCategoryChange = function(selectedSubCategoryId)
    {
        $scope.reportInfo.selectedSubCategoryId = selectedSubCategoryId;
        SalesInfoFactory.getSalesInformation(123,"asd", "asd2").then(function(response)
        {
           console.log(response);
        });
        
        console.log($scope.reportInfo);
    };
    
    
    $scope.init();
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
        getSalesInformation: function(year, category, subcategory)
        {
            return $http.get("assets/nets-sales.json");        
        }
    };
    
    return salesInfoFactory;
});
