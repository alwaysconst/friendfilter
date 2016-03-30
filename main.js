new Promise(function (resolve) {
    if (document.readyState === 'complete') {
        resolve();
    } else {
        window.onload = resolve;
    }
}).then(function () {
    return new Promise(function (resolve, reject) {
        VK.init({
            apiId: 5379727
        });

        VK.Auth.login(function (response) {
            if (response.session) {
                resolve(response);
            } else {
                reject(new Error('Не удалось авторизоваться'));
            }
        }, 2);
    });
}).then(function () {
    return new Promise(function (resolve, reject) {
        VK.api('friends.get', {fields: 'photo_50,first_name,last_name', order: 'name'}, function (response) {
            if (response.error) {
                reject(new Error(response.error.error_msg));
            } else {

                var source = friendItemTemplateLeft.innerHTML,
                    templateFn = Handlebars.compile(source),
                    template = templateFn({list: response.response});
                friendList.innerHTML = template;
                
//                friendList.addEventListener('click', function(e){
//                    friendFilter.innerHTML = e.target.parentNode.outerHTML;
//                    
//                });
//                console.log(friendFilter.innerHTML);
                
                friendList.onclick = function(event) {
                    var target = event.target; 

                    if (target.tagName != 'SPAN') return;
                    target.dataset = 'delFriend';
                    target.classList.remove("glyphicon-plus");
                    target.classList.add("glyphicon-remove"); friendFilter.insertAdjacentHTML("beforeEnd",target.parentNode.outerHTML);
                    target.parentNode.outerHTML = '';
                };
                
                friendFilter.onclick = function(event) {
                    var target = event.target; 

                    if (target.tagName != 'SPAN') return;
                    target.dataset = 'addFriend';
                    target.classList.remove("glyphicon-remove");
                    target.classList.add("glyphicon-plus"); friendList.insertAdjacentHTML("beforeEnd",target.parentNode.outerHTML);
                    target.parentNode.outerHTML = '';
                };
                
//                var friendArr = [];
//                friendList.addEventListener('click', 
//                function () {
//                friendArr.push(document.getElementById('friendListItem')),
//                    
//                    friendFilter.insertAdjacentHTML("beforeEnd", friendArr.innerHTML);
//                    console.log(friendArr);
//                })
                 
                
                
                
                
                
                resolve();
            }
        });
    });
}).catch(function(e) {
    alert('Ошибка: ' + e.message);
});