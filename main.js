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
                resolve(response);
            }
        });
    });
}).then(function (response) {
    if (response.error) {
        reject(new Error(response.error.error_msg));
    } else {
/*--------------------ПОЛУЧАЕМ ДАННЫЕ ИЗ API И РАЗНОСИМ ИХ В ПРАВЫЙ И ЛЕВЫЙ СТОЛБЦЫ--------------------*/
                var friendsRight = [],
                    allFriends = response.response,
                    addedFriends = JSON.parse(localStorage.getItem('friends'));
                
                allFriends = allFriends.filter(function (friend) {
                    if (addedFriends) {
                        if (addedFriends.indexOf(friend.uid + "") > -1) {
                            friendsRight.push(friend);
                            return false; 
                        }   
                    }
                    return true;
                })

/*--------------------ВСТАВЛЯЕМ ДАННЫЕ В ШАБЛОН1--------------------*/
                var colLeft = friendItemTemplateLeft.innerHTML,
                    templateFn = Handlebars.compile(colLeft),
                    template = templateFn({list: allFriends});
                friendList.innerHTML = template;
                
/*--------------------ВСТАВЛЯЕМ ДАННЫЕ В ШАБЛОН2--------------------*/
                var colRight = friendItemTemplateRight.innerHTML,
                    templateFn = Handlebars.compile(colRight),
                    template = templateFn({list: friendsRight});
                friendFilter.innerHTML = template;
    }
})
    
    .catch(function(e) {
    alert('Ошибка: ' + e.message);
});

/*--------------------ОБРАБАТЫВАЕМ КЛИК НА "+"--------------------*/
friendList.onclick = function(event) {
    var target = event.target; 
    if (target.tagName != 'SPAN') return;
    target.classList.remove("glyphicon-plus");
    target.classList.add("glyphicon-remove");
    friendFilter.insertBefore(target.parentNode, friendFilter.firstElementChild);
};

/*--------------------ОБРАБАТЫВАЕМ КЛИК НА "X"--------------------*/
friendFilter.onclick = function(event) {
    var target = event.target; 
    if (target.tagName != 'SPAN') return;
    target.classList.remove("glyphicon-remove");
    target.classList.add("glyphicon-plus");
    friendList.insertBefore(target.parentNode, friendList.firstElementChild);
};

/*--------------------ОБРАБАТЫВАЕМ КЛИК НА "СОХРАНИТЬ"--------------------*/
buttonSave.onclick = function (event) {
    var uidList = [],
        uidArr = friendFilter.children;
    for(var i = 0; i < uidArr.length ; i++ ) {
        uidList.push(uidArr[i].dataset.uid);
    }
    localStorage.setItem( 'friends', JSON.stringify( uidList ) );
}

/*--------------------DRAG & DROP--------------------*/
var dragableLi
function dragStart(ev) {
    ev.dataTransfer.effectAllowed='move';
    ev.dataTransfer.setData("text/html", ev.target.closest("li").getAttribute("data-uid"));
    dragableLi = ev.target.closest("li");
    return true;
}
function dragEnter(ev) {
    event.preventDefault();
    return true;
}
function dragOver(ev) {
    event.preventDefault();
}
function dragDrop(ev) {
    var data = ev.dataTransfer.getData("text/html");
    ev.target.closest("ul").insertBefore(document.getElementById(data), ev.target.closest("ul").firstChild);
    if (ev.target.closest("ul").id === "friendFilter") {
        dragableLi.lastElementChild.classList.remove("glyphicon-plus");
        dragableLi.lastElementChild.classList.add("glyphicon-remove");
    } else if (ev.target.closest("ul").id === "friendList") {
        dragableLi.lastElementChild.classList.remove("glyphicon-remove");
        dragableLi.lastElementChild.classList.add("glyphicon-plus");
    }
    ev.stopPropagation();
    return false;
}

/*--------------------ПОИСК ПО ФИО--------------------*/

document.addEventListener("input", function (e) {
    var inputLeftSearch = e.target.value.trim();
        leftList = document.getElementById(e.target.dataset.list).children;
    
        for (var i = 0; i < leftList.length; i++) {
                leftList[i].classList.remove("hide");
            var currentLi = leftList[i].innerText.toLowerCase();
            if (!(currentLi.indexOf(inputLeftSearch) > -1)) {
                leftList[i].classList.add("hide");
            }
        }
    }
) 