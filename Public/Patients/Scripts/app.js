var myApp = angular.module('myApp',['ngRoute']);

var newRecord = false;

myApp.filter('offset', function () {
    return function (input, start) {
        start = parseInt(start, 10);
        return input.slice(start);
    };
});

//For routing purpose
myApp.config(function ($routeProvider) {
    
    $routeProvider.when('/', 
        {
        templateUrl: 'Patients/Views/pateintList.html'
    })
    .when('/new', 
        {
        templateUrl: 'Patients/Views/patientForm.html'
    })
    .when('/edit', 
        {
        templateUrl: 'Patients/Views/patientForm.html'
    }) 
    .when('/login', 
        {
        templateUrl: 'Patients/Views/login.html'
    })
    .when('/signup', 
        {
        templateUrl: 'Patients/Views/register.html'
    })
    .when('/search', 
        {
        templateUrl: 'Patients/Views/searchPatientList.html'
    }) 
    .otherwise({
        redirectTo: '/'
    });
});

myApp.controller('dataControllers', ['$scope', '$http','$location', function ($scope, $http,$location) {
        $scope.currentUser = null;
        
        //For paging
        $scope.itemsPerPage = 5;
        $scope.currentPage = 0;
        $scope.patients = [];
        $scope.addNewVisit = false;
        
          //Setting rage for paging     
        $scope.range = function () {
            var rangeSize = 2;
            var ret = [];
            var start;
            
            start = $scope.currentPage;
            if (start > $scope.pageCount() - rangeSize) {
                start = $scope.pageCount() - rangeSize + 1;
            }
            
            for (var i = start; i < start + rangeSize; i++) {
                ret.push(i);
            }
            return ret;
        };

        //Previous PAge link function
        $scope.prevPage = function () {
            if ($scope.currentPage > 0) {
                $scope.currentPage--;
            }
        };
        
        $scope.prevPageDisabled = function () {
            return $scope.currentPage === 0 ? "disabled" : "";
        };
        
        $scope.pageCount = function () {
            return Math.ceil($scope.patients.length / $scope.itemsPerPage) - 1;
        };
        
        $scope.nextPage = function () {
            if ($scope.currentPage < $scope.pageCount()) {
                $scope.currentPage++;
            }
        };
        
        $scope.nextPageDisabled = function () {
            return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
        };
        
        $scope.setPage = function (n) {
            $scope.currentPage = n;
        };
        
        //To update patient list
        var refresh = function () {
            $http.get('/patientlist').success(function (response) {
                $scope.patients = response;
            });
            $scope.patient = "";
            console.log("JAGRAJ SIDHU");

        };

        refresh();//To update patient list when new patient is added

        $http.get('/getCurrentUser').success(function (response) {            
            
            $scope.currentUser = response.user;
        });
        
        //To update doctor list
        var refreshDoctor = function () {
            $http.get('/doctorList').success(function (response) {
                $scope.doctors = response;
            });
        }
        refreshDoctor();//To update doctor list when new patient is added

        $scope.saveDoctor = function (newdoctor) {
           $http.post('/doctorList', newdoctor).success(function (response) {
                $scope.newdoctor = "";
               $location.path('/');
    
            });
            refreshDoctor();
        }
        
       //Adding new Patient logic
        $scope.addNewPatientClick = function () {
            newRecord = true;
            $scope.patient = "";
            $location.path('new');
            
        };
       
        //Editing Patient Logic
        $scope.onEditClick = function (id) {
            newRecord = false;
            $http.get('/patientlist/' + id).success(function (response) {
                $scope.patient = response;
                $scope.patientVisitJson= JSON.stringify($scope.patient.visits);
                
            });
            
            $location.path('edit');
        };
        
        $scope.addNewPatientVisit = function (a, b) {

            var visits = JSON.parse($scope.patientVisitJson);
            
            visits.push({ "id": Math.ceil(Math.random() * 100000) + "", "complaint": a, "billingamt": b });
            $scope.patient.visits = visits;
            $scope.patientVisitJson = JSON.stringify($scope.patient.visits);
            console.log("Sidhu Brar: " + $scope.patientVisitJson);
           
            $scope.visit.billingamt = "";
            
            $scope.visit.complaint= "";

        }

        $scope.removeVisit = function (id) {
            var visits = JSON.parse($scope.patientVisitJson);
            
            for (var i = 0; i < visits.length; i++) {
                if (visits[i].id == id) {
                    visits.splice(i, 1);
                    break;
                }
            }
            $scope.patient.visits = visits;
            $scope.patientVisitJson = JSON.stringify($scope.patient.visits);
            console.log("Sidhu Brar: " + $scope.patientVisitJson);
        }
        

        //To add or update patient
        $scope.addOrEditPatient = function (person) {
           
            $scope.patient = person;
            if (newRecord == true) {
                //alert("Adding new record");
                person.id = Math.floor((Math.random() * 100000 - 1) + 10001);
                
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth() + 1; //January is 0!                
                var yyyy = today.getFullYear();
                if (dd < 10) {
                    dd = '0' + dd
                }
                if (mm < 10) {
                    mm = '0' + mm
                }
                var today = yyyy + '-' + mm + '-' + dd;                
                person.createdate= today;
               
                $http.post('/patientlist',person).success(function (response) {
                    $location.path('/');
                    refresh();
                });
            }
            else {
                
                $http.put('/patientlist/' + $scope.patient._id, $scope.patient).success(function (response) {
                    $location.path('/');
                    refresh();
                })
            }
           
        };
        
        //On clicking cancel button
        $scope.cancelClick = function () {
            $location.path('/');
        };
        

        $scope.remove = function (id) {
            console.log(id);
            $http.delete('/patientlist/' + id).success(function (response) {
                refresh();
            });
        };
        


        //Login n logout Function
        $scope.logoutUser = function () {
            $scope.currentUser = null;
           
            $http.get('/signout').success(function (response) {
                
                 $location.path('/');
            });
           
        }
    
      
       

    }]);








