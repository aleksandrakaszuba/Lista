myApp.factory('Authentication',
  ['$rootScope', '$location', '$firebaseObject', '$firebaseAuth',
  function($rootScope, $location, $firebaseObject, $firebaseAuth) {

  var ref = firebase.database().ref(); //reference to the database
  var auth = $firebaseAuth(); //variable for authentification
  var myObject;

//getting a current user with an observer on Auth object, does he have any information 
  auth.$onAuthStateChanged(function(authUser) {
    if(authUser) {
      //user signed in
      var userRef = ref.child('users').child(authUser.uid);
      var userObj = $firebaseObject(userRef);
      $rootScope.currentUser = userObj;// pass info about current user to the scope
    } else {
      //no user is signed in
      $rootScope.currentUser = '';
    }
  });

  myObject = {
    login: function(user) {//fed by user reg controller
      auth.$signInWithEmailAndPassword(//firebase method
        user.email,
        user.password
      ).then(function(user) {
        $location.path('/mylists');
      }).catch(function(error) {
        $rootScope.message = error.message;
      }); //signInWithEmailAndPassword
    }, //login

    logout: function() {
      return auth.$signOut();
    }, //logout

    requireAuth: function() {
      return auth.$requireSignIn();
    }, //require Authentication

    register: function(user) {
      auth.$createUserWithEmailAndPassword( //firebase method
        user.email,
        user.password
      ).then(function(regUser) {
        var regRef = ref.child('users')//all user info
          .child(regUser.uid).set({//user id firebase creates autmatically
            date: firebase.database.ServerValue.TIMESTAMP,//time of registration
            regUser: regUser.uid,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email
          }); //userinfo
          myObject.login(user);
      }).catch(function(error) { 
      //firebase catch method for handing errors
       // An error happened.
        $rootScope.message = error.message;
      }); //createUserWithEmailAndPassword
    } //register

  }; //return


  return myObject;

}]); //factory
