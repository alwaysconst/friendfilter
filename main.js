new Promise(function(resolve) {
    if (document.readyState === 'complete') {
        resolve();
    } else {
        window.onload = resolve;
    }
}).then(function() {
    return new Promise(function(resolve, reject) {
        VK.init({
            apiId: 5379727
        });

        VK.Auth.login(function(response) {
            if (response.session) {
                resolve(response);
            } else {
                reject(new Error('Не удалось авторизоваться'));
            }
        }, 2);
    });
}).then(function() {
    return new Promise(function(resolve, reject) {
        VK.api('friends.get', {fields:'photo_50,first_name,last_name', order:'name'}, function(response) {
            if (response.error) {
                reject(new Error(response.error.error_msg));
            } else {

                var source = friendItemTemplateLeft.innerHTML,
                    templateFn = Handlebars.compile(source),
                    template = templateFn({list: response.response});

                left.innerHTML = template;

                resolve();
            }
        });
    });
}).catch(function(e) {
    alert('Ошибка: ' + e.message);
});
