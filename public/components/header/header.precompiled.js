(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['header.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"header__logo\">\n    Лого\n</div>\n<div class=\"header__search\">\n    Поиск\n</div>\n<div class=\"header__menu\">\n    Меню\n    <div class=\"header__dropdown\">\n        <div class=\"header__settings\">\n            Настройки\n        </div>\n        <div class=\"header__profile\">\n            Профиль\n        </div>\n    </div>\n</div>";
},"useData":true});
})();