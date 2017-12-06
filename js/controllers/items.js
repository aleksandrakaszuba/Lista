myApp.controller('ItemsController', ['$scope', '$rootScope', '$location', '$routeParams', '$firebaseObject', '$firebaseArray',
    function($scope, $rootScope, $location, $routeParams, $firebaseObject, $firebaseArray) {

        var ref, todoList;

        $scope.whichlist = $routeParams.mId;
        $scope.whichuser = $routeParams.uId;

        //reference to parent list
        refL = firebase.database().ref()
            .child('users').child($scope.whichuser)
            .child('todolists').child($scope.whichlist);
        var currentList = $firebaseObject(refL);

        currentList.$loaded().then(function(data) {
            $scope.listname = currentList.name;
            console.log(currentList.name);
        }); 
        
        //reference to toto list
        ref = firebase.database().ref()
            .child('users').child($scope.whichuser)
            .child('todolists').child($scope.whichlist)
            .child('todolistitems');

        todosList = $firebaseArray(ref);
        $scope.todos = todosList;
  

        //reference to done list
        refD = firebase.database().ref()
            .child('users').child($scope.whichuser)
            .child('todolists').child($scope.whichlist)
            .child('donelistitems');
        donesList = $firebaseArray(refD);
        $scope.dones = donesList;

        /*$scope.order = 'itemname';
        $scope.direction = null;
        $scope.query = '';
        $scope.recordId='';*/

        $scope.addItem = function() {
                $firebaseArray(ref).$add({
                    item: $scope.todoitem,
                    date: firebase.database.ServerValue.TIMESTAMP
                }).then(function() {
                    $location.path('/todo/' + $scope.whichuser + '/' +
                        $scope.whichlist)
                }); //$add
                console.log("added item");
            } //addCheckin
        $scope.deleteItem = function(id) {
            todosList.$remove(id);
        }
        $scope.deleteDonesItem = function(id) {
            donesList.$remove(id);
        }
        $scope.completeItem = function(id) {
            var obj = $firebaseArray(ref);
            obj.$loaded()
                .then(function(data) {
                    $firebaseArray(refD).$add(obj[id]).then(function() {
                        $location.path('/todo/' + $scope.whichuser + '/' +
                            $scope.whichlist)
                    });
                })
            todosList.$remove(id);
        }
        $scope.uncompleteItem = function(id) {
            var obj = $firebaseArray(refD);
            obj.$loaded()
                .then(function(data) {
                    $firebaseArray(ref).$add(obj[id]).then(function() {
                        $location.path('/todo/' + $scope.whichuser + '/' +
                            $scope.whichlist)
                    });
                })
            donesList.$remove(id);
        }
    }
]); //myApp.controller