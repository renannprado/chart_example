"use strict";

// creating the angular app
var chartExampleApp = angular.module("chartExampleApp", ["ngRoute", "ngResource"]);

chartExampleApp.controller("NavController", function navigationController($scope, SalesInfoFactory)
{
    SalesInfoFactory.getSalesInformation(123,"asd", "asd2").then(function(response)
    {
       console.log(response);        
    });
});

chartExampleApp.factory('SalesInfoFactory', function salesInfoFactory($http)
{
    var salesInfoFactory =
    {
        getSalesInformation: function(year, category, subcategory)
        {
            return $http.get("/assets/nets-sales.json");        
        }
    };
    
    return salesInfoFactory;
});
