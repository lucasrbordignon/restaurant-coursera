"use strict"

import { getHtml, getJson } from "./http.js";

document.addEventListener('DOMContentLoaded', function () {
  const collapsableNav = document.querySelector('#collapsable-nav');
  const toggleCollapse = document.querySelector('#toggle-collapse');

  document.addEventListener('click', function (event) {
    const screenWidth = window.innerWidth;
    const clickOutSide =
      screenWidth < 992 &&
      !collapsableNav.contains(event.target) &&
      !toggleCollapse.contains(event.target);

    const isMenuOpen = !toggleCollapse.classList.contains('collapsed');

    if (clickOutSide && isMenuOpen) {
      toggleCollapse.click()
    }
  });
});

const homeHtml = "snippets/home-snippet.html";
const allCategoriesUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
const categoriesTitleHtml = "snippets/categories-title-snippet.html";
const categoryHtml = "snippets/category-snippet.html";
const menuItemsUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";
const menuItemsTitleHtml = "snippets/menu-items-title.html";
const menuItemHtml = "snippets/menu-item.html";

(function (global) {
  const dc = {}
  
  const insertHtml = (selector, html) => {
    const targetItem = document.querySelector(selector)
    targetItem.innerHTML = html
  }

  const showLoading = (selector) => {
    var html = "<div class='d-flex justify-content-center'>"
    html += "<img class='center' src='public/loader2.gif'></div>"
    insertHtml(selector, html)
  }

  const insertProperty = (string, propName, propValue) => {
    const propToReplace = `{{${propName}}}`
    string = string.replace(new RegExp(propToReplace, "g"), propValue)
    return string
  }

  document.addEventListener("DOMContentLoaded", async () => {
    showLoading("#main-content");
    const homeHtmlContent = await getHtml(homeHtml);
    document.querySelector("#main-content").innerHTML = homeHtmlContent;
  });

  dc.loadMenuCategories = async () => {
    showLoading("#main-content");
    try {
      const categories = await getJson(allCategoriesUrl);
      await buildAndShowCategoriesHTML(categories);
    } catch (error) {
      console.error('Failed to load menu categories:', error);
    }
  }

  dc.loadMenuItems = async (categoryShort) => {
    showLoading("#main-content");
    try {
      const menuItems = await getJson(menuItemsUrl + categoryShort + ".json");
      await buildAndShowMenuItemsHTML(menuItems);
    } catch (error) {
      console.error('Failed to load menu items:', error);
    }
  }

  async function buildAndShowCategoriesHTML(categories) {
    const [categoriesTitleContent, categoryHtmlContent] = await Promise.all([
      getHtml(categoriesTitleHtml),
      getHtml(categoryHtml)
    ]);

    const categoriesViewHtml = buildCategoriesViewHtml(
      categories,
      categoriesTitleContent,
      categoryHtmlContent
    );

    insertHtml("#main-content", categoriesViewHtml);
  }

  function buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml) {
    var finalHtml = categoriesTitleHtml
    finalHtml += "<section id='menu-categories' class='row g-3'>"

    for (let category of categories) {
      var html = categoryHtml
      const { name, short_name } = category;

      html = insertProperty(html, "name", name);
      html = insertProperty(html, "short_name", short_name);
      finalHtml += html;
    }

    finalHtml += "</section>";
    return finalHtml;
  }

  async function buildAndShowMenuItemsHTML(categoryMenuItems) {
    const [menuItemsTitleContent, menuItemHtmlContent] = await Promise.all([
      getHtml(menuItemsTitleHtml),
      getHtml(menuItemHtml)
    ]);

    const menuItemsViewHtml = buildMenuItemsViewHtml(
      categoryMenuItems,
      menuItemsTitleContent,
      menuItemHtmlContent
    );

    insertHtml("#main-content", menuItemsViewHtml);
  }

  function buildMenuItemsViewHtml(categoryMenuItems, menuItemsTitleHtml, menuItemHtml) {
    menuItemsTitleHtml = insertProperty(
      menuItemsTitleHtml,
      "name",
      categoryMenuItems.category.name
    );

    menuItemsTitleHtml = insertProperty(
      menuItemsTitleHtml,
      "special_instructions",
      categoryMenuItems.category.special_instructions
    );

    var finalHtml = menuItemsTitleHtml;
    finalHtml += "<section class='row g-4 justify-content-center text-center text-sm-start'>";

    const menuItems = categoryMenuItems.menu_items;
    const catShortName = categoryMenuItems.category.short_name;

    for (let item of menuItems) {
      var html = menuItemHtml;
      html = insertProperty(html, "short_name", item.short_name);
      html = insertProperty(html, "catShortName", catShortName);
      html = insertItemPrice(html, "price_small", item.price_small);
      html = insertItemPortionName(
        html,
        "small_portion_name",
        item.small_portion_name
      );
      html = insertItemPrice(
        html,
        "price_large",
        item.price_large
      );
      html = insertItemPortionName(
        html,
        "large_portion_name",
        item.large_portion_name
      );
      html = insertProperty(html, "name", item.name);
      html = insertProperty(html, "description", item.description);

      finalHtml += html;
    }

    finalHtml += "</section>";
    return finalHtml;
  }

  function insertItemPrice(html, pricePropName, priceValue) {
    if (!priceValue) {
      return insertProperty(html, pricePropName, "");
    }
    priceValue = "$" + priceValue.toFixed(2);
    html = insertProperty(html, pricePropName, priceValue);
    return html;
  }

  function insertItemPortionName(html, portionPropName, portionValue) {
    if (!portionValue) {
      return insertProperty(html, portionPropName, "");
    }
    portionValue = "(" + portionValue + ")";
    html = insertProperty(html, portionPropName, portionValue);
    return html;
  }

  global.$dc = dc
})(window)