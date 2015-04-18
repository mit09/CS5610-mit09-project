var app = angular.module("ToastServiceApp", []);

app.factory('ToastService', function ($mdToast) {
    
    var showSimpleToast = function (msg, top_bol, bottom_bol) {

        var toastPosition = {
            bottom: false,
            top: true,
            left: false,
            right: true
        };
        

        var toastPos = Object.keys(toastPosition)
          .filter(function (pos) { return toastPosition[pos]; })
          .join(' ');

        $mdToast.show(
          $mdToast.simple()
            .content(msg)
            .position(toastPos)
            .hideDelay(3000)
        );
    }
    return {
        /*Expose the function*/
        showSimpleToast: showSimpleToast
    };
});