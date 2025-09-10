document.addEventListener('DOMContentLoaded', function() {
  const collapsableNav = document.querySelector('#collapsable-nav');
  const toggleCollapse = document.querySelector('#toggle-collapse');

  document.addEventListener('click', function(event) {
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


(function (global) {
  const dc = {}

  const homeHtml = "snippets/home-snippet.html";
  const allCategoriesUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
  const categoriesTitleHtml = "snippets/categories-title-snippet.html";
  const categoryHtml = "snippets/category-snippet.html";
  const menuItemsUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";
  const menuItemsTitleHtml = "snippets/menu-items-title.html";
  const menuItemHtml = "snippets/menu-item.html";

  const insertHtml = (selector, html) => {
    const targetItem = document.querySelector(selector)    
    targetItem.innerHTML = html
  }

  const showLoading = (selector) => {
    var html = "<div class='center'>"
    html += "<img src='public/loader.gif'></div>"
    insertHtml(selector, html)
  }

  const insertProperty = (string, propName, propValue) => {
    const propToReplace = `{{${propName}}}` 
    string = string.replace(new RegExp(propToReplace, "g"), propValue)
    return string
  }

  const switchMenuToActive = () => {
    const navHomeButton = document.querySelector("#navHomeButton")
    var classes = navHomeButton.className
    classes = classes.replace(new RegExp("active", "g"), "")
    navHomeButton.className = classes

    var classes = navHomeButton.className
    if ( classes.indexOf("active") == -1 ) {
      classes += "active"
      navHomeButton.className = classes
    }
  }

  document.addEventListener("DOMContentLoaded", (event) => {

    showLoading("#main-content")
    $ajaxUtils.sendGetRequest(
      homeHtml,
      (responseText) => {
        document.querySelector("#main-content").innerHTML = responseText
      },
      false
    )
  })

  dc.loadMenuCategories = () => {
    showLoading("#main-content")
    $ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowCategoriesHTML)
  }

  dc.loadMenuItems = (categoryShort) => {
    showLoading("#main-content")

    $ajaxUtils.sendGetRequest(
      menuItemsUrl + categoryHtml + ".json",
      buildAndShowMenuItemsHTML
    )
  }

  function buildAndShowCategoriesHTML(categories) {

    $ajaxUtils.sendGetRequest(
      categoriesTitleHtml,
      (categoriesTitleHtml) => {

        $ajaxUtils.sendGetRequest(
          categoryHtml,
          (categoryHtml) => {

            switchMenuToActive()

            const categoriesViewHtml = buildCategoriesViewHtml(
              categories,
              categoriesTitleHtml,
              categoryHtml
            )

            insertHtml("#main-content", categoriesViewHtml)
          },
          false
        )
      },
      false
    )
  }

  function buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml) {
    var finalHtml = categoriesTitleHtml
    finalHtml +=  "<section class='row0'>"

    for ( category of categories ) {
      var html = categoryHtml
      const name = category.name
      const short_name = category.short_name

      html = insertProperty(html, "name", name)
      html = insertProperty(html, "short_name", short_name)
      finalHtml += html
    } 
    
    finalHtml += "</section>"
    return finalHtml
  }

  function buildAndShowMenuItemsHTML (categoryMenuItems) {
    $ajaxUtils.sendGetRequest(
      menuItemsTitleHtml,
      (menuItemsTitleHtml) => {

        $ajaxUtils.sendGetRequest(
          menuItemHtml,
          (menuItemHtml) => {

            switchMenuToActive()

            const menuItemsViewHtml = buildMenuItemsViewHtml(
              categoryMenuItems,
              menuItemsTitleHtml,
              menuItemHtml
            )

            insertHtml("#main-content", menuItemsViewHtml)
          },
          false
        )
      },
      false
    )
  }

  function buildMenuItemsViewHtml(categoryMenuItems, menuItemsTitleHtml, menuItemHtml) {
    menuItemsTitleHtml = insertProperty(
      menuItemsTitleHtml,
      "name",
      categoryMenuItems.category.name
    )

    menuItemsTitleHtml  = insertProperty(
      menuItemsTitleHtml,
      "especial_instructions",
      categoryMenuItems.category.especial_instructions
    )
    
    var finalHtml = menuItemsTitleHtml
    finalHtml += "<section class='row'>"

    const menuItems = categoryMenuItems.menu_items 
    const catShortName = categoryMenuItems.category.short_name

    for (item of menuItems  ) {
      var html = menuItemHtml
      html = insertProperty(html, "short_name", item.short_name);
      html = insertProperty(html, "catShortName", catShortName);
      html = insertItemPrice(html, "price_small", item.price_small);
      html = insertItemPortionName(
        html,
        "small_portion_name",
        item.small_portion_name
      )
      html = insertItemPrice(
        html,
        "price_large",
        item.price_large
      )
      html = insertItemPortionName(
        html,
        "large_portion_name",
        item.large_portion_name
      )
      html = insertProperty(html, "name", item.name)
      html = insertProperty(html, "description", item.description)

      // if (i % 2 != 0) {
      //   html +=
      //     "<div class='clearfix visible-lg-block visible-md-block'></div>";
      // }

      finalHtml += html
    }

    finalHtml += "</section>"
    return finalHtml
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
}) (window)