/**
 * Created by superman90 on 9/13/16.
 */

var app = angular.module('app', ['ngAnimate', 'ngTouch', 'ui.grid']);

app.controller('MainCtrl', ['$scope', '$http', 'uiGridConstants', function ($scope, $http, uiGridConstants) {
        var today = new Date();
        var nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);

        $scope.highlightFilteredHeader = function( row, rowRenderIndex, col ) {//, colRenderIndex
            if( col.filters[0].term ){
                return 'header-filtered';
            } else {
                return '';
            }
        };

        $scope.gridOptions = {
            enableFiltering: true,
            onRegisterApi: function(gridApi){
                $scope.gridApi = gridApi;
            },
            columnDefs: [
                // default
                { field: 'name', headerCellClass: $scope.highlightFilteredHeader },
                // pre-populated search field
                { field: 'gender', filter: {
                    term: '1',
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: [ { value: '1', label: 'male' }, { value: '2', label: 'female' }, { value: '3', label: 'unknown'}, { value: '4', label: 'not stated' }, { value: '5', label: 'a really long value that extends things' } ]
                },
                    cellFilter: 'mapGender', headerCellClass: $scope.highlightFilteredHeader },
                // no filter input
                { field: 'company', enableFiltering: false, filter: {
                    noTerm: true,
                    condition: function(searchTerm, cellValue) {
                        return cellValue.match(/a/);
                    }
                }},
                // specifies one of the built-in conditions
                // and a placeholder for the input
                {
                    field: 'email',
                    filter: {
                        condition: uiGridConstants.filter.ENDS_WITH,
                        placeholder: 'ends with'
                    }, headerCellClass: $scope.highlightFilteredHeader
                },
                // custom condition function
                {
                    field: 'phone',
                    filter: {
                        condition: function(searchTerm, cellValue) {
                            var strippedValue = (cellValue + '').replace(/[^\d]/g, '');
                            return strippedValue.indexOf(searchTerm) >= 0;
                        }
                    }, headerCellClass: $scope.highlightFilteredHeader
                },
                // multiple filters
                { field: 'age', filters: [
                    {
                        condition: uiGridConstants.filter.GREATER_THAN,
                        placeholder: 'greater than'
                    },
                    {
                        condition: uiGridConstants.filter.LESS_THAN,
                        placeholder: 'less than'
                    }
                ], headerCellClass: $scope.highlightFilteredHeader},
                // date filter
                { field: 'mixedDate', cellFilter: 'date', width: '15%', filter: {
                    condition: uiGridConstants.filter.LESS_THAN,
                    placeholder: 'less than',
                    term: nextWeek
                }, headerCellClass: $scope.highlightFilteredHeader
                },
                { field: 'mixedDate', displayName: "Long Date", cellFilter: 'date:"longDate"', filterCellFiltered:true, width: '15%'
                }
            ]
        };

        $http.get('/500_complex.json')
            .success(function(data) {
                $scope.gridOptions.data = data;
                $scope.gridOptions.data[0].age = -5;

                data.forEach( function addDates( row, index ){
                    row.mixedDate = new Date();
                    row.mixedDate.setDate(today.getDate() + ( index % 14 ) );
                    row.gender = row.gender==='male' ? '1' : '2';
                });
            });

        $scope.toggleFiltering = function(){
            $scope.gridOptions.enableFiltering = !$scope.gridOptions.enableFiltering;
            $scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
        };
    }])
    .filter('mapGender', function() {
        var genderHash = {
            1: 'male',
            2: 'female'
        };

        return function(input) {
            if (!input){
                return '';
            } else {
                return genderHash[input];
            }
        };
    });