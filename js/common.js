"use strict";

function Component(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            this[prop] = obj[prop];
        }
    }

    this._order = 0;
}

Component.prototype.setView = function (view, data) {
    this.htmlView = view;
    if (data) {
        this.data = data;
    }
};

Component.prototype.setOrder = function (order) {
    if (typeof order === "number" || (typeof order === "string" && +order)) {
        this._order = +order;
    }
};

Component.prototype.render = function () {
    this.component = document.createElement(this.parent);
    this.component.innerHTML = this.htmlView.replace(/{\w*}/g, replacer.bind(this));
    
    return this.component;
};


Component.prototype.renderS = function(){

};


function replacer(str) {
    str = str.replace(/{|}/g, "");

    switch (this.parent) {
        case "header":
        case "footer":
            return this[str];
            break;

        case "nav" :
            return this.renderSubItem(this.data, str);
            break;

        case "main" :
            return this.Articles(this.data, str);
            break;

    }
};


Component.prototype.delete = function () {
    this.component.remove();
};

Component.prototype.Articles = function (article, str) {
    var articleItem = "";

    for (var key in article) {
        articleItem += '<'+ str + '><a href="'
            + article[key]['url']
            + '">'
            + article[key]['name']
            + '</a> '
            + article[key]['text']
            + '</' + str + '>';
    }

    return articleItem;
};

Component.prototype.renderSubItem = function (item, str) {
    var menuItem = "";
    var menuSubitem;

    for (var key in item) {
        menuSubitem = "";

        if (item[key]['items']) {
            menuSubitem = '<ul class="submenu">' + this.renderSubItem(item[key]['items']) + '</ul>';
        }

        menuItem += '<' + str + '><a href="' + item[key]['url'] + '">' + item[key]['name'] + '</a>' + menuSubitem + '</' + str + '>';
    }

    return menuItem;
};

function renderPage() {
    var arr = [];

    for (var i = 0; i < arguments.length; i++) {
        arr.push(arguments[i]);
    }

    arr.sort(compareOrder);

    arr.forEach(function (component) {
        document.body.appendChild(component.render());
        console.log(component["parent"] + " rendered");
    });

    function compareOrder(component1, component2) {
        if (component1["_order"] > component2["_order"]) return 1;
        if (component1["_order"] < component2["_order"]) return -1;
    }
}

//////////////////////////////////////////////
/////////////////////////////////////////////

var componentHeader = new Component({parent: 'header', url: './img/logo.png', title: 'Рога и Копыта'});
var componentMenu = new Component({parent: 'nav'});
var componentArticles = new Component({parent: 'main'});
var componentFooter = new Component({parent: 'footer', text: '&#169; Копирайты'});
var viewHeader = '<h1><img src="{url}" alt="{title}"/>{title}</h1>';
var viewMenu = '<ul>{li}</ul>';
var viewArticle = '<section>{article}</section>';
var viewFooter = '<p><small>{text}</small</p>';
var dataMenu = [
    {
        name: 'Главная',
        url: '#'
    },
    {
        name: 'O нас',
        url: '#',
        items: [
            {
                name: 'Кто мы', url: '#', items: [
                    {
                        name: 'Рога', url: '#', items: [
                            {name: 'Большие', url: '#'},
                            {name: 'Маленькие', url: '#'}
                        ]
                    },
                    {
                        name: 'Копыта', url: '#', items: [
                            {name: 'Парные', url: '#'},
                            {name: 'Непарные', url: '#'}
                        ]
                    }
                ]
            },
            {name: 'Где мы', url: '#'},
            {name: 'Откуда', url: '#'}
        ]
    },
    {
        name: 'Контакты',
        url: '#'
    }
];
var dataArticle = [
    {name: 'Статья 1', url: '#', text: 'Some text for you'},
    {name: 'Статья 2', url: '#', text: 'Some text for you'},
    {name: 'Статья 3', url: '#', text: 'Some text for you'}
];

componentHeader.setView(viewHeader);
componentMenu.setView(viewMenu, dataMenu);
componentArticles.setView(viewArticle, dataArticle);
componentFooter.setView(viewFooter);

renderPage(componentHeader, componentMenu, componentArticles, componentFooter);