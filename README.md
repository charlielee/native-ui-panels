# native-ui-panels
A node module to allow the easy creation of native looking panel windows.

## Install
```shell
npm install native-ui-panels
```

## Example
```js
var panels = require("native-ui-panels");

// Create some content to put in the panel
var div = document.createElement("div");
var content = document.createTextNode("content");
div.appendChild(content);

panels(id, {
  title: "Hello world",
  content: div,
  width: "250px",
  height: "250px"
});

```
