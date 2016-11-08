const twitterStream = angular.module('myApp', ['chart.js']);

twitterStream.controller("mainCtrl", ['$scope', 'socket',
function ($scope, socket) {
  //chart labels
  $scope.labels = ["#VoteTrump", "#ImWithHer", "#JohnsonWeld", "#ItsInOurHands"];
  //chart colors
  $scope.colors = ['#6c6a6c','#000000','#7FFD1F','#EC872A', '#9527C2'];
  //intial data values
  $scope.voters = [0,0,0,0];

  socket.on('newTweet', function (tweet) {
    $scope.tweet = tweet.text;
    $scope.user = tweet.user.screen_name;
    //parse source from payload
    var source = tweet.source.split('>')[1].split('<')[0].split(' ')[2];
    //all hashtags in the tweet
    var hashtags = tweet.entities.hashtags.map(function(el){
      return el.text.toLowerCase();
    });

    //check source and increment for #votetrump tweets
    if (hashtags.includes('votetrump')) {
      $scope.voters[0]++;
    } else if (hashtags.includes('imwithher')) {
      $scope.voters[1]++;
    } else if (hashtags.includes('johnsonweld')) {
      $scope.voters[2]++;
    } else if (hashtags.includes('itsinourhands')) {
      $scope.voters[3]++;
    }

    //check source and increment for #imwithher tweets
    // else if (hashtags.includes('imwithher')) {
    //   switch (source) {
    //     case 'iPhone': $scope.clintonData[0]++;
    //     break;
    //     case 'iPad': $scope.clintonData[1]++;
    //     break;
    //     case 'Android': $scope.clintonData[2]++;
    //     break;
    //     case 'Web': $scope.clintonData[3]++;
    //     break;
    //     default: $scope.clintonData[4]++;
    //   }
    // }
  });
}
]);


/*---------SOCKET IO METHODS (careful)---------*/

twitterStream.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
});
