VK.init({
    apiId: 5379727
    });
VK.Auth.login(function(response) {
    if (response.session) {
        console.log('всё ок!');
    } else {
        alert('Не удалось авторизоваться');
    }
}, 2);