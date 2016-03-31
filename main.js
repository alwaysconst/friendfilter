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
                //Получаем данные из API и сравниваем их с localstorage 
//                localStorage.setItem( 'friends', JSON.stringify( response.response ) ); // записываем данные в localstorage
                
//                addedFriends = JSON.parse( localStorage.getItem( 'friends' ) ); // распарсиваем данные из localstorage
//                console.log(friends);
                
//                localStorage.clear(); // очищаем localstorage
                
/*--------------------ПОЛУЧАЕМ ДАННЫЕ ИЗ API И РАЗНОСИМ ИХ В ПРАВЫЙ И ЛЕВЫЙ СТОЛБЦЫ--------------------*/
                var friendsleft = [];
                    friendsRight = [];
                    allFriends = response.response;
                    addedFriends = JSON.parse( localStorage.getItem( 'friends' ) );
                
                allFriends.forEach(function (allFriends) {
                   if (addedFriends) {
                       var checker = false;

                       for (var i = 0; i < addedFriends.length; i++) {
                            if (allFriends.uid === parseFloat(addedFriends[i].uid)){
                                friendsRight.push(allFriends);
                                checker = true;
                                return;
                            } 
                           else {
                                checker = false;
                            }
                       }
                       
                       if (checker === true) {
                           friendsRight.push(allFriends);
                       }
                       if (checker === false) {
                           friendsleft.push(allFriends);
                       }
                       
                   } else {
                       friendsleft.push(allFriends);
                   }
               })

/*--------------------ВСТАВЛЯЕМ ДАННЫЕ В ШАБЛОН1--------------------*/
                var colLeft = friendItemTemplateLeft.innerHTML,
                    templateFn = Handlebars.compile(colLeft),
                    template = templateFn({list: friendsleft});
                friendList.innerHTML = template;
                
/*--------------------ВСТАВЛЯЕМ ДАННЫЕ В ШАБЛОН2--------------------*/
                var colRight = friendItemTemplateRight.innerHTML,
                    templateFn = Handlebars.compile(colRight),
                    template = templateFn({list: friendsRight});
                friendFilter.innerHTML = template;

                resolve();
            }
        });
    });
}).catch(function(e) {
    alert('Ошибка: ' + e.message);
});

/*--------------------ОБРАБАТЫВАЕМ КЛИК НА "+"--------------------*/
                friendList.onclick = function(event) {
                    var target = event.target; 
                    if (target.tagName != 'SPAN') return;
//                    target.dataset = 'delFriend';
                    target.classList.remove("glyphicon-plus");
                    target.classList.add("glyphicon-remove");
                    friendFilter.insertAdjacentHTML("afterBegin",target.parentNode.outerHTML);
                    target.parentNode.outerHTML = '';
                };
/*--------------------ОБРАБАТЫВАЕМ КЛИК НА "X"--------------------*/
                friendFilter.onclick = function(event) {
                    var target = event.target; 

                    if (target.tagName != 'SPAN') return;
//                    target.dataset = 'addFriend';
                    target.classList.remove("glyphicon-remove");
                    target.classList.add("glyphicon-plus");
                    friendList.insertAdjacentHTML("afterBegin",target.parentNode.outerHTML);
                    target.parentNode.outerHTML = '';
                };
/*--------------------ОБРАБАТЫВАЕМ КЛИК НА "СОХРАНИТЬ"--------------------*/
                buttonSave.onclick = function (event) {
                    
                    uidList = [];
                    
                    newArr = friendFilter.children;
                    for(var i = 0; i < newArr.length ; i++ ) {
                        uidList.push(newArr[i].dataset);
                    }
                    console.log(uidList)
                    localStorage.setItem( 'friends', JSON.stringify( uidList ) );
                }