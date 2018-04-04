"use strict";

function Component(obj) {
    for (var prop in obj) {
        this[prop] = obj[prop];
    }

    this.order = 0;
}

Component.prototype.setView = function (view, data = null) {
    this.htmlView = view;
    data ? this.data = data : null;
};

Component.prototype.setOrder = function (order) {
    this.order = order;
};

Component.prototype.render = function () {

    this.component = document.createElement(this.parent);
    this.component.innerHTML = this.htmlView.replace(/{\w*}/g, replacer.bind(this));

    return this.component;

    function replacer(str) {
        str = str.replace(/{|}/g, "");

        switch (this.parent) {
            case "header":
            case "footer":
                return this[str];
                break;

            case "nav" :
                return this.renderSubItem(this.data);
                break;

            case "main" :
                return this.Articles(this.data);
                break;

        }
    };
};


Component.prototype.delete = function () {
    this.component.remove();
};

Component.prototype.Articles = function (article) {
    var articleItem = "";

    for (var key in article) {
        articleItem += '<article><a href="'
            + article[key]['url']
            + '">'
            + article[key]['name']
            + '</a><p>'
            + article[key]['text']
            + '</p></article>';
    }

    return articleItem;
};

Component.prototype.renderSubItem = function (item) {
    var menuItem = "";

    for (var key in item) {
        var menuSubitem = "";

        if (item[key]['items']) {
            menuSubitem = '<ul class="submenu">' + this.renderSubItem(item[key]['items']) + '</ul>';
        }

        menuItem += '<li><a href="' + item[key]['url'] + '">' + item[key]['name'] + '</a>' + menuSubitem + '</li>';
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
        if (component1["order"] > component2["order"]) return 1;
        if (component1["order"] < component2["order"]) return -1;
    }
}

//////////////////////////////////////////////
/////////////////////////////////////////////

var componentHeader = new Component({parent: 'header', url: './../img/logo.png', title: 'Рога и Копыта'}),
    componentMenu = new Component({parent: 'nav'}),
    componentArticles = new Component({parent: 'main'}),
    componentFooter = new Component({parent: 'footer', text: '&#169; Копирайты'}),
    viewHeader = '<h1><img src="{url}" alt="{title}"/>{title}</h1>',
    viewMenu = '<ul>{li}</ul>',
    viewArticle = '<section>{article}</section>',
    viewFooter = '<p><small>{text}</small</p>',
    dataMenu = [
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
    ],
    dataArticle = [
        {name: 'Статья 1', url: '#', text: 'Some text for you'},
        {name: 'Статья 2', url: '#', text: 'Some text for you'},
        {name: 'Статья 3', url: '#', text: 'Some text for you'}
    ];

componentHeader.setView(viewHeader);
componentMenu.setView(viewMenu, dataMenu);
componentArticles.setView(viewArticle, dataArticle);
componentFooter.setView(viewFooter);

renderPage(componentHeader, componentMenu, componentArticles, componentFooter);