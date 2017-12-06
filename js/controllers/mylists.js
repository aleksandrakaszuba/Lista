myApp.controller('ListsController', ['$scope', '$rootScope', '$firebaseAuth', '$firebaseArray',
    function($scope, $rootScope, $firebaseAuth, $firebaseArray) {

        var ref = firebase.database().ref();
        var auth = $firebaseAuth();

        auth.$onAuthStateChanged(function(authUser) {
            if (authUser) {
                var todolistsRef = ref.child('users').child(authUser.uid).child('todolists');
                var todolistInfo = $firebaseArray(todolistsRef);

                $scope.todolists = todolistInfo;
 
                todolistInfo.$loaded().then(function(data) {
                    $rootScope.numberOfLists = todolistInfo.length;
                });

                todolistInfo.$watch(function(data) {
                    $rootScope.numberOfLists = todolistInfo.length;
                });


                $scope.addMyList = function() {
                    todolistInfo.$add({ //add fire base method
                        name: $scope.todolistname,
                        date: firebase.database.ServerValue.TIMESTAMP
                    }).then(function() {
                        $scope.todolistname = '';
                    });
                }

                $scope.deleteMyList = function(key) {
                    todolistInfo.$remove(key);
                }

            }
        });
    }
]);