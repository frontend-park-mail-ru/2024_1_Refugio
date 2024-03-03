(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['header.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"header\">\n    <div class=\"header__logo\">\n        "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"logo") || (depth0 != null ? lookupProperty(depth0,"logo") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"logo","hash":{},"data":data,"loc":{"start":{"line":3,"column":8},"end":{"line":3,"column":16}}}) : helper)))
    + "\n    </div>\n    <div class=\"header__search\">\n        Поиск\n    </div>\n    <div class=\"header__menu\">\n        Меню\n        <div class=\"header__dropdown\">\n            <div class=\"header__settings\">\n                Настройки\n            </div>\n            <div class=\"header__profile\">\n                Профиль\n            </div>\n        </div>\n    </div>\n</div>";
},"useData":true});
})();