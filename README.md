# rpg-cards

RPG spell/item/monster card generator, edited by Zavian. This is just a way to implement a more online version of the website.
The main modification from [crobi's](https://crobi.github.io/rpg-cards/generator/generate.html) version is that this one has a way to automatically upload
the cards to the internet to be able to use it in programs such as tabletop simulator or other virtual tabletops.

# preview

Click [here](https://zavian.github.io/generator/generate.html) for a live preview of this generator.

# status of the project

I will probably do changes to this awesome tool, implementing new commands and things similar to that, but be aware that there won't
be too many changes and they will be very sparse in time.

# FAQ

-   What browsers are supported?
    -   A modern browser (Chrome, Firefox, Edge, Safari). The generator has some issues on IE.
-   Cards are generated without icons and background colors, what's wrong?
    -   Enable printing backround images in your browser print dialog
-   I can't find an icon that I've seen on [game-icons.net](http://game-icons.net), where is it?
    -   See the section "updating icons" below.
-   The layout of the cards is broken (e.g., cards are placed outside the page), what's wrong?
    -   Check your page size, card size, and cards/page settings. If you ask the generator to place 4x4 poker-sized cards on a A4 paper, they won't fit and they will overflow the page.

# updating icons

This project includes a copy of icons from the [game-icons](http://game-icons.net) project,
which regularly publishes new icons.
To download these new icons:

-   Install Imagemagick
-   Run the following commands from the root of the project:
    -   `npm install`
    -   `node ./resources/tools/update-icons.js`

# license

This generator is provided under the terms of the MIT License

Icons are made by various artists, available at [http://game-icons.net](http://game-icons.net).
They are provided under the terms of the Creative Commons 3.0 BY license.
