hereApp.filter('removeTag', function() {
    return function(input, uppercase) {
        return input.replace(/<[^>]+>/gm, '');;
    };
})