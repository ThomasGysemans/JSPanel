# JSPanel

A library that helps you write a static dropdown menu, a panel, that follows the digital accessibility recommendations.

## Get started

First of all, get the source code in the `src` folder of this repository. You need to copy the javascript file & the css file:

```html
<link rel="stylesheet" src="src/panel-style.css">
```

```html
<script src="src/JSPanel.js">
```

**Note:** the source code is available in TypeScript & JavaScript.

## Create your own panel

According to the digital accessibility recommendations, the panel needs to be opened by a button. Here is an example of what your code should be:

```html
<html>
<head>
  <style>
    #container {
      position: fixed;
      bottom: 30px;
      right: 30px;
    }
  </style>
</head>
<body>

  <div id="container">
    <button id="panel-controller">
  </div>

  <script src="src/JSPanel.js"></script>
  <script>
    const button = document.querySelector("#panel-controller");
    const panel = new JSPanel(button, {
      bottom: 0 + button.getBoundingClientRect().height,
      right: 0,
      items: [
        { title: "My Profile", onclick: () => console.log("et voilà") }
      ],
    });
  </script>
</body>
</html>
```

**Note:** the `aria-` attributes are added dynamically.

A panel has 5 different options:

|name|type|default value|description|
|----|----|-------------|-----------|
|`top`|number|null|The `top` CSS property.|
|`right`|number|null|The `right` CSS property.|
|`bottom`|number|null|The `bottom` CSS property.|
|`left`|number|null|The `left` CSS property.|
|`items`|Array of items|_required_|The items to be displayed in the panel.|

By default, the panel is placed in the upper left corner (`top:0,left:0`).

The items have also specific options:

|name|type|default value|description|
|----|----|-------------|-----------|
|`title`|string|(_required_)|The title of the item.|
|`icon`|string|null|The path to an image.|
|`fontawesome_icon`|string|null|The className of a Fontawesome icon.|
|`onclick`|() => void|null|The callback function when the user clicks on the item.|
|`separator`|boolean|false|Displays a line. This item cannot have any other options.|

In order to use `fontawesome_icon`, make sure you've installed [Fontawesome](https://cdnjs.com/libraries/font-awesome) in your project.

## Digital Accessibility

Following the digital accessibility recommendations for this kind of panels, it is necessary to open or close the panel by clicking either the Enter or Space key. See <https://www.accede-web.com/en/guidelines/rich-interface-components/show-hide-panels/> for more information.

## License

MIT License