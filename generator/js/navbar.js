$(document).ready(function() {
    let current_page = window.location.pathname.split('/').pop();

    let links = {
        "generate.html": {
            "name": "🎴 RPG Cards Generator",
            "desc": "Based on <a class='text-success' href='https://rpg-cards.vercel.app/'>crobi</a>'s work"
        },
        "epic-generator.html": {
            "name": "Epic💯Boons",
            "desc": "Tabletop Simulator tool used for <a class='text-success' href='https://github.com/Zavian/Tabletop-Simulator-Scripts/tree/master/Commander%20Gen%202'>this</a> project"
        },
        "homebrew-spell-maker.html": {
            "name": "📖 Homebrew Spell Maker",
            "desc": "A tool to help you create homebrew spells for <a class='text-success' href='https://github.com/Daniel-van-der-Poel/The-Clean-Sheet'>this</a> dnd sheet"
        },
        "potion-maker.html": { "name": "💦 Potion Maker" },
        "gw2editor.html": {
            "name": "🐲 Guild Wars 2 Logo Editor",
            "desc": "Thanks to <a class='text-success' href='https://nailek.net/'>nailek</a> and <a class='text-success' href='https://gw2.properdave.com/'>properdave</a> for their awesome resources."
        }
    };
    let navbar = $("<nav style='height:50px' class='navbar navbar-expand-lg navbar-dark bg-dark'></nav>");

    //if (current_page == "generate.html") {
    //    navbar.attr("style", "margin-bottom:0px!important;margin-top:20px;")
    //    navbar.addClass('fixed-bottom')
    //}

    let container = $("<div class='container-fluid'></div>");
    let brand = $(`<a class='navbar-brand' href='#'>${links[current_page].name}</a>`);
    let toggler = $("<button class='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarNavAltMarkup' aria-controls='navbarNavAltMarkup' aria-expanded='false' aria-label='Toggle navigation'></button>");
    let toggler_icon = $("<span class='navbar-toggler-icon'></span>");
    let collapse = $("<div class='collapse navbar-collapse' id='navbarNavAltMarkup'></div>");
    let nav = $("<div class='navbar-nav'></div>");

    // foreach link in links with both link and name
    for (let link in links) {
        let item = $("<a class='nav-item nav-link' href='" + link + "'>" + links[link].name + "</a>");
        if (link != current_page) {
            nav.append(item);
        }
    }



    // for (let i = 0; i < links.length; i++) {
    //     let link = $(`<a class='nav-link' href='${links[i]}'>${links[i].split('.')[0]}</a>`);
    //     if (current_page == links[i]) {
    //         link.addClass("active");
    //     }
    //     if (current_page != links[i])
    //         nav.append(link);
    // }

    toggler.append(toggler_icon);
    collapse.append(nav);
    container.append(brand);
    container.append(toggler);
    container.append(collapse);
    navbar.append(container);

    if (links[current_page].desc) {
        let span = $(`<span class="navbar-text" style="font-size:18px;color:white;text-align:right;width:100%">${links[current_page].desc}</span>`);
        navbar.append(span)
    }
    $("body").prepend(navbar);

    //if (current_page == "generate.html") {
    //    $("body").append(navbar);
    //} else
    //    $("body").prepend(navbar);
});