$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});
$("#menu-toggle-2").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled-2");
    $('#menu ul').hide();
});

function initMenu() {
    $('#menu ul').hide();
    $('#menu ul').children('.current').parent().show();
    //$('#menu ul:first').show();
    $('#menu li a').click(
        function() {
            var checkElement = $(this).next();
            if((checkElement.is('ul')) && (checkElement.is(':visible'))) {
                return false;
            }
            if((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
                $('#menu ul:visible').slideUp('normal');
                checkElement.slideDown('normal');
                return false;
            }
        }
    );
}
$(document).ready(function() {initMenu();});


//AngularJS
var app = angular.module("myApp", ['angularUtils.directives.dirPagination','ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ngStorage']);
app.controller("myController", function ($rootScope, $scope, $http, $localStorage) {

    Array.prototype.indexOf = function(val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) return i;
        }
        return -1;
    };
    Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };

    //$localStorage.$reset();
    if($localStorage.legisFavorArray == null){
        $localStorage.legisFavorArray = new Array();
    }
    if($localStorage.billFavorArray == null){
        $localStorage.billFavorArray = new Array();
    }
    if($localStorage.commFavorArray == null){
        $localStorage.commFavorArray = new Array();
    }
    //legis favor click
    $scope.legisFavorAddClicked = function(id){
        legisFavorArray = $localStorage.legisFavorArray;
        for(var i = 0; i < legisFavorArray.length; i++){
            if(legisFavorArray[i] == id){
                legisFavorArray.remove(id);
                $localStorage.legisFavorArray = legisFavorArray;
                return;
            }
        }
        legisFavorArray.push(id);
        $localStorage.legisFavorArray = legisFavorArray;
        for(var i = 0; i < legisFavorArray.length; i++){
            console.log(i + ':' + legisFavorArray[i]);
        }
    }
    //bill favor click
    $scope.billFavorAddClicked = function(id){
        var actualID = id.toLowerCase();

        billFavorArray = $localStorage.billFavorArray;

        for(var i = 0; i < billFavorArray.length; i++){
            if(billFavorArray[i] == actualID){
                billFavorArray.remove(actualID);
                $localStorage.billFavorArray = billFavorArray;
                return;
            }
        }
        billFavorArray.push(actualID);
        $localStorage.billFavorArray = billFavorArray;
        for(var i = 0; i < billFavorArray.length; i++){
            console.log(i + ':' + billFavorArray[i]);
        }
    }
    //comm favor click
    $scope.commFavorAddClicked = function(id){

        commFavorArray = $localStorage.commFavorArray;

        for(var i = 0; i < commFavorArray.length; i++){
            if(commFavorArray[i] == id){
                commFavorArray.remove(id);
                $localStorage.commFavorArray = commFavorArray;
                return;
            }
        }
        commFavorArray.push(id);
        $localStorage.commFavorArray = commFavorArray;
        for(var i = 0; i < commFavorArray.length; i++){
            console.log(i + ':' + commFavorArray[i]);
        }
    }
    //legis del click
    $scope.legisFavorDelClicked = function(id){
        legisFavorArray = $localStorage.legisFavorArray;
        legisFavorArray.remove(id);
        //document.getElementById(id).className = "glyphicon glyphicon-star-empty";
        $localStorage.legisFavorArray = legisFavorArray;
        $scope.favorLegisRefresh();
        for(var i = 0; i < legisFavorArray.length; i++){
            console.log(i + ':' + legisFavorArray[i]);
        }
    }
    //bill del click
    $scope.billFavorDelClicked = function(id){
        var newId = id.toLowerCase();
        billFavorArray = $localStorage.billFavorArray;
        billFavorArray.remove(newId);
        //document.getElementById(id).className = "glyphicon glyphicon-star-empty";
        $localStorage.billFavorArray = billFavorArray;
        $scope.favorBillRefresh();
        for(var i = 0; i < billFavorArray.length; i++){
            console.log(i + ':' + billFavorArray[i]);
        }
    }
    //comm del click
    $scope.commFavorDelClicked = function(id){
        commFavorArray = $localStorage.commFavorArray;
        commFavorArray.remove(id);
        //document.getElementById(id).className = "glyphicon glyphicon-star-empty";
        $localStorage.commFavorArray = commFavorArray;
        $scope.favorCommRefresh();
        for(var i = 0; i < commFavorArray.length; i++){
            console.log(i + ':' + commFavorArray[i]);
        }
    }

    //favor all refresh
    $scope.favorRefresh = function(){
        $scope.favorLegisRefresh();
        $scope.favorBillRefresh();
        $scope.favorCommRefresh();
    }

    //legis favor refresh
    $scope.favorLegisRefresh = function(){
        legisFavorArray = $localStorage.legisFavorArray;
        legisFavorDataArray = new Array();
        for(var i = 0; i < legisFavorArray.length; i++){
            $http({
                method: 'GET',
                url: 'http://jiaweiliuhw8-env.us-west-2.elasticbeanstalk.com',
                params:{
                    'type':'LegisFavor',
                    'id': legisFavorArray[i],
                    'urlType':2
                }
            }).then(function (response) {
                $.each(response.data.results, function (i, d) {
                    if(d.district == null){
                        d.district = 'N.A.'
                    } else {
                        var tmp = d.district;
                        d.district = 'District '+tmp;
                    }
                    if(d.chamber == 'house'){
                        d.showSenate = false;
                        d.chamber = ' House'
                    }
                    if(d.chamber == 'senate'){
                        d.showSenate = true;
                        d.chamber = ' Senate'
                    }
                    if(d.party == 'R'){
                        d.showRParty = true;
                    }
                    if(d.party == 'D'){
                        d.showRParty = false;
                    }
                });
                legisFavorDataArray.push(response.data.results[0]);
            });
        }
        $scope.legisFavorDataArray = legisFavorDataArray;
    }

    //bill favor refresh
    $scope.favorBillRefresh = function(){
        billFavorArray = $localStorage.billFavorArray;
        billFavorDataArray = new Array();
        for(var i = 0; i < billFavorArray.length; i++){
            $http({
                method: 'GET',
                url: 'http://jiaweiliuhw8-env.us-west-2.elasticbeanstalk.com',
                params:{
                    'type':'BillFavor',
                    'id': billFavorArray[i],
                    'urlType':2
                }
            }).then(function (response) {
                $.each(response.data.results, function (i, d) {
                    d.bill_id = d.bill_id.toUpperCase();
                    d.bill_type = d.bill_type.toUpperCase();
                    if(d.chamber == 'house'){
                        d.showSenate = false;
                        d.chamber = ' House'
                    }
                    if(d.chamber == 'senate'){
                        d.showSenate = true;
                        d.chamber = ' Senate'
                    }
                });
                billFavorDataArray.push(response.data.results[0]);
            });
        }
        $scope.billFavorDataArray = billFavorDataArray;
    }

    //comm favor refresh
    $scope.favorCommRefresh = function(){
        commFavorArray = $localStorage.commFavorArray;
        commFavorDataArray = new Array();
        for(var i = 0; i < commFavorArray.length; i++){
            $http({
                method: 'GET',
                url: 'http://jiaweiliuhw8-env.us-west-2.elasticbeanstalk.com',
                params:{
                    'type':'CommFavor',
                    'id': commFavorArray[i],
                    'urlType':2
                }
            }).then(function (response) {
                $.each(response.data.results, function (i, d) {
                    if(d.chamber == 'house'){
                        d.chamber = ' House'
                    }
                    if(d.chamber == 'senate'){
                        d.chamber = ' Senate'
                    }
                });
                commFavorDataArray.push(response.data.results[0]);
            });
        }
        $scope.commFavorDataArray = commFavorDataArray;
    }


    //State Legis
    $http({
        method: 'GET',
        url: 'http://jiaweiliuhw8-env.us-west-2.elasticbeanstalk.com',
        params:{
            'type':'Legislators1',
            'urlType':2
        }
    }).then(function (response) {
        $scope.total = response.data.count;
        $.each(response.data.results, function (i, d) {
            if(d.district == null){
                d.district = 'N.A.'
            } else {
                var tmp = d.district;
                d.district = 'District '+tmp;
            }
            if(d.chamber == 'house'){
                d.showSenate = false;
                d.chamber = ' House'
            }
            if(d.chamber == 'senate'){
                d.showSenate = true;
                d.chamber = ' Senate'
            }
            if(d.party == 'R'){
                d.showRParty = true;
            }
            if(d.party == 'D'){
                d.showRParty = false;
            }
        });
        $scope.stateLegislators = response.data.results;
    });

    //House Legis
    $http({
        method: 'GET',
        url: 'http://jiaweiliuhw8-env.us-west-2.elasticbeanstalk.com',
        params:{
            'type':'Legislators2',
            'urlType':2
        }
    }).then(function (response) {
        $scope.total = response.data.count;
        $.each(response.data.results, function (i, d) {
            if(d.district == null){
                d.district = 'N.A.'
            } else {
                var tmp = d.district;
                d.district = 'District '+tmp;
            }
            if(d.chamber == 'house'){
                d.showSenate = false;
                d.chamber = ' House'
            }
            if(d.chamber == 'senate'){
                d.showSenate = true;
                d.chamber = ' Senate'
            }
            if(d.party == 'R'){
                d.showRParty = true;
            }
            if(d.party == 'D'){
                d.showRParty = false;
            }
        });
        $scope.houseLegislators = response.data.results;
    });

    //Senate Legis
    $http({
        method: 'GET',
        url: 'http://jiaweiliuhw8-env.us-west-2.elasticbeanstalk.com',
        params:{
            'type':'Legislators3',
            'urlType':2
        }
    }).then(function (response) {
        $scope.total = response.data.count;
        $.each(response.data.results, function (i, d) {
            if(d.district == null){
                d.district = 'N.A.'
            } else {
                var tmp = d.district;
                d.district = 'District '+tmp;
            }
            if(d.chamber == 'house'){
                d.showSenate = false;
                d.chamber = ' House'
            }
            if(d.chamber == 'senate'){
                d.showSenate = true;
                d.chamber = ' Senate'
            }
            if(d.party == 'R'){
                d.showRParty = true;
            }
            if(d.party == 'D'){
                d.showRParty = false;
            }
        });
        $scope.senateLegislators = response.data.results;
    });

    //Active Bill
    $http({
        method: 'GET',
        url: 'http://jiaweiliuhw8-env.us-west-2.elasticbeanstalk.com',
        params:{
            'type':'Bills1',
            'urlType':2
        }
    }).then(function (response) {
        $scope.total = response.data.count;
        $.each(response.data.results, function (i, d) {
            d.bill_id = d.bill_id.toUpperCase();
            d.bill_type = d.bill_type.toUpperCase();
            if(d.chamber == 'house'){
                d.showSenate = false;
                d.chamber = ' House'
            }
            if(d.chamber == 'senate'){
                d.showSenate = true;
                d.chamber = ' Senate'
            }
        });
        $scope.activeBills = response.data.results;
    });

    //New Bill
    $http({
        method: 'GET',
        url: 'http://jiaweiliuhw8-env.us-west-2.elasticbeanstalk.com',
        params:{
            'type':'Bills2',
            'urlType':2
        }
    }).then(function (response) {
        $scope.total = response.data.count;
        $.each(response.data.results, function (i, d) {
            d.bill_id = d.bill_id.toUpperCase();
            d.bill_type = d.bill_type.toUpperCase();
            if(d.chamber == 'house'){
                d.showSenate = false;
                d.chamber = ' House'
            }
            if(d.chamber == 'senate'){
                d.showSenate = true;
                d.chamber = ' Senate'
            }
        });
        $scope.newBills = response.data.results;
    });

    //House Committee
    $http({
        method: 'GET',
        url: 'http://jiaweiliuhw8-env.us-west-2.elasticbeanstalk.com',
        params:{
            'type':'Committees1',
            'urlType':2
        }
    }).then(function (response) {
        $scope.total = response.data.count;
        $.each(response.data.results, function (i, d) {
            if(d.chamber == 'house'){
                d.showSenate = false;
                d.chamber = ' House'
            }
            if(d.chamber == 'senate'){
                d.showSenate = true;
                d.chamber = ' Senate'
            }
            if(d.chamber == 'joint'){
                d.chamber = 'Joint'
            }
            if(d.office == null){
                d.office = 'N.A.'
            }
        });
        $scope.houseCommittees = response.data.results;
    });

    //Senate Committee
    $http({
        method: 'GET',
        url: 'http://jiaweiliuhw8-env.us-west-2.elasticbeanstalk.com',
        params:{
            'type':'Committees2',
            'urlType':2
        }
    }).then(function (response) {
        $scope.total = response.data.count;
        $.each(response.data.results, function (i, d) {
            if(d.chamber == 'house'){
                d.showSenate = false;
                d.chamber = ' House'
            }
            if(d.chamber == 'senate'){
                d.showSenate = true;
                d.chamber = ' Senate'
            }
            if(d.chamber == 'joint'){
                d.chamber = 'Joint'
            }
            if(d.office == null){
                d.office = 'N.A.'
            }
        });
        $scope.senateCommittees = response.data.results;
    });

    //Joint Committee
    $http({
        method: 'GET',
        url: 'http://jiaweiliuhw8-env.us-west-2.elasticbeanstalk.com',
        params:{
            'type':'Committees3',
            'urlType':2
        }
    }).then(function (response) {
        $scope.total = response.data.count;
        $.each(response.data.results, function (i, d) {
            if(d.chamber == 'house'){
                d.showSenate = false;
                d.chamber = ' House'
            }
            if(d.chamber == 'senate'){
                d.showSenate = true;
                d.chamber = ' Senate'
            }
            if(d.chamber == 'joint'){
                d.chamber = 'Joint'
            }
            if(d.office == null){
                d.office = 'N.A.'
            }
        });
        $scope.jointCommittees = response.data.results;
    });

    //legis view detail click
    $scope.legisViewDetailsClicked = function(id){
        $rootScope.idClicked = id;
        //Legislator Detail
        $http({
            method: 'GET',
            url: 'http://jiaweiliuhw8-env.us-west-2.elasticbeanstalk.com',
            params: {
                'type': 'LegislatorsDetail',
                'id': $rootScope.idClicked,
                'urlType': 2
            }
        }).then(function (response) {
            $scope.details = response.data.results[0];
            if ($scope.details.chamber == 'house') {
                $scope.details.chamber = 'House';
            }
            if ($scope.details.chamber == 'senate') {
                $scope.details.chamber = 'Senate';
            }
            if ($scope.details.party == 'R') {
                $scope.details.party = 'Republican';
                $scope.details.showRParty = true;
            }
            if ($scope.details.party == 'D') {
                $scope.details.party = 'Democrat';
                $scope.details.showRParty = false;
            }
            if ($scope.details.twitter_id == null) {
                $scope.showTwitter = false;
            } else {
                $scope.showTwitter = true;
            }
            if ($scope.details.facebook_id == null) {
                $scope.showFacebook = false;
            } else {
                $scope.showFacebook = true;
            }
            var momentStartDate = moment($scope.details.term_start);
            $scope.details.term_start = momentStartDate.format("MMM DD YYYY");
            var momentEndDate = moment($scope.details.term_end);
            $scope.details.term_end = momentEndDate.format("MMM DD YYYY");
            var momentNow = moment();
            var percentage = momentNow.diff(momentStartDate, 'days') / momentEndDate.diff(momentStartDate, 'days');
            console.log(percentage);
            $scope.details.progressBarVal = Math.round(percentage * 100 + 1);
            var momentBirthday = moment($scope.details.birthday);
            $scope.details.birthday = momentBirthday.format("MMM DD YYYY");
        });
        ////Legislator Details Committee
        $http({
            method: 'GET',
            url: 'http://jiaweiliuhw8-env.us-west-2.elasticbeanstalk.com',
            params:{
                'type':'LegislatorsDetailCommittee',
                'id': $rootScope.idClicked,
                'urlType':2
            }
        }).then(function (response) {
            $scope.total = response.data.count;
            $.each(response.data.results, function (i, d) {
                if(d.chamber == 'house'){
                    d.chamber = ' House'
                }
                if(d.chamber == 'senate'){
                    d.chamber = ' Senate'
                }
            });
            $scope.committee = response.data.results;
        });
        //Legislator Details Bill
        $http({
            method: 'GET',
            url: 'http://jiaweiliuhw8-env.us-west-2.elasticbeanstalk.com',
            params:{
                'type':'LegislatorsDetailBill',
                'id': $rootScope.idClicked,
                'urlType':1
            }
        }).then(function (response) {
            $scope.total = response.data.count;
            $.each(response.data.results, function (i, d) {
                d.bill_id = d.bill_id.toUpperCase();
                d.bill_type = d.bill_type.toUpperCase();
            });
            $scope.bill = response.data.results;
        });
    };
    //bill view detail click
    $scope.billViewDetailsClicked = function(id){
        $rootScope.idClicked = id.toLowerCase();
        //bill detail
        $http({
            method: 'GET',
            url: 'http://jiaweiliuhw8-env.us-west-2.elasticbeanstalk.com',
            params:{
                'type':'BillDetail',
                'id': $rootScope.idClicked,
                'urlType':2
            }
        }).then(function (response) {
            $scope.total = response.data.count;
            $.each(response.data.results, function (i, d) {
                d.bill_id = d.bill_id.toUpperCase();
                d.bill_type = d.bill_type.toUpperCase();
                if(d.chamber == 'house'){
                    d.chamber = 'House'
                }
                if(d.chamber == 'senate'){
                    d.chamber = 'Senate'
                }
                if(d.history.active == true){
                    d.history.active = 'Active'
                }
                if(d.history.active == false){
                    d.history.active = 'New'
                }
            });
            $scope.bill = response.data.results[0];
        });
    };

    $scope.commSetStyle = function (id) {
        commFavorArray = $localStorage.commFavorArray;
        for(var i = 0; i < commFavorArray.length; i++){
            if(commFavorArray[i] == id){
                return 'yellow';
            }
        }
        return 'white';
    };

    $scope.billSetStyle = function (id) {
        if(id == undefined){
            return 'white';
        }
        billFavorArray = $localStorage.billFavorArray;
        for(var i = 0; i < billFavorArray.length; i++){
            if(billFavorArray[i] == id.toLowerCase()){
                return 'yellow';
            }
        }
        return 'white';
    };

    $scope.legisSetStyle = function (id) {
        if(id == undefined){
            return 'white';
        }
        legisFavorArray = $localStorage.legisFavorArray;
        for(var i = 0; i < legisFavorArray.length; i++){
            if(legisFavorArray[i] == id){
                return 'yellow';
            }
        }
        return 'white';
    };
});




