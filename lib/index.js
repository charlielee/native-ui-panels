var process = require("process");

// Add panels CSS file
var cssFile = document.createElement("link");
    cssFile.setAttribute("rel", "stylesheet");
    cssFile.setAttribute("type", "text/css");
    //cssFile.setAttribute("href", "css/panels.css");
    cssFile.setAttribute("href", __dirname + "/../css/panels.css");
    document.getElementsByTagName("head")[0].appendChild(cssFile);

var panelList = {};
var topzIndex = 10;
// Create container for blocking panels
var container = document.createElement("div");
container.setAttribute("id", "nuiPanelContainer");

if (process.platform === "win32") {
  // Get theme color
  var Registry = require('winreg'),
      regKey = new Registry({
        hive: Registry.HKCU,
        key:  '\\Software\\Microsoft\\Windows\\DWM'
      });
}


function panel(id, options) {
  // Make sure panel name will not conflict
  var id = "nuiPanelId" + id;

  if (!panelList[id]) {
    // Add options to panel
    var options = {
      title: (options.title ? options.title : ""),
      content: (options.content ? options.content : ""),
      width: (options.width ? options.width : "auto"),
      height: (options.height ? options.height : "auto"),
      color: (options.color ? options.color : "#000000"),
      posX: (options.posX ? options.posX : "5em"),
      posY: (options.posY ? options.posY : "5em"),
      blocking: (options.blocking === true ? true : false), // Default value is false
      canClose: (options.canClose === false ? false : true), // Default value is true
      canDrag: (options.canDrag === false ? false : true), // Default value is true
      visible: (options.visible === false ? false : true), // Default value is true
      scrollPageIfOverflow: (options.scrollPageIfOverflow === true ? true : false) // Default value is false
    }
    // Push the panel to object
    panelList[id] = options;

    // Create frame node to contain panel contents
    var frame = document.createElement("div");
    frame.classList.add("nuiPanelFrame");
    frame.setAttribute("id", id);
    // Add current platform
    frame.classList.add(process.platform);

    if (options.blocking) {
      container.appendChild(frame);
      document.body.appendChild(container);
      container.addEventListener("click", function(e) {
        if (e.srcElement === container) {
          setColor(frame, "#fff");
          setTimeout(function() {
            setColor(frame, options.color)
          }, 50);
        }
      });
    } else {
      document.body.appendChild(frame);
    }

    // Set frame dimensions from options
    frame.style.width = options.width;
    frame.style.height = options.height;

    // Create title bar
    var title = document.createElement("div");
    title.classList.add("nuiPanelTitle");

    var titleText = document.createElement("span")
    titleText.appendChild(document.createTextNode(options.title));

    title.appendChild(titleText);
    frame.appendChild(title);

    // Set frame color
    setColor(frame, options.color);

    // Add close button
    if (options.canClose) {
      var closeBtn = document.createElement("div");
      closeBtn.classList.add("nuiPanelCloseBtn");
      // Add close symbol on Windows
      if (process.platform == "win32") {
        closeBtn.appendChild(document.createTextNode("✕"));
      }
      // Append to titlebar
      title.appendChild(closeBtn);

      closeBtn.addEventListener("click", function() {
        close(frame);
      });
    }

    // Set panel visibility
    if (!options.visible) {
      frame.classList.add("closing");
      frame.classList.add("closed");
    }

    // If content is a node
    if (options.content instanceof Object) {
      // If node is in the DOM remove it
      if (options.content.parentNode) {
        var parent = options.content.parentNode;
        parent.removeChild(options.content);
      }
      // Add node to frame
      frame.appendChild(options.content);
    } else {
      // If content is HTML
      frame.insertAdjacentHTML("beforeEnd", options.content);
    }

    // Position panel
    frame.style.left = options.posX;
    frame.style.top = options.posY;
    frame.style.left = window.getComputedStyle(frame).getPropertyValue("left");
    frame.style.top = window.getComputedStyle(frame).getPropertyValue("top");

    // Allowing the panel to be dragged
    if (options.canDrag) {
      title.addEventListener("mousedown", mouseDown);
      window.addEventListener("mouseup", mouseUp);
    }

    function mouseDown(e) {
      if (!options.scrollPageIfOverflow) { document.body.style.overflow = "hidden"; }
      offY = e.clientY - parseInt(title.offsetTop) - parseInt(frame.style.top);
      offX = e.clientX - parseInt(title.offsetLeft) - parseInt(frame.style.left);

      window.addEventListener("mousemove", divMove, true);
    }

    function divMove(e) {
      frame.style.top = (e.clientY - offY) + "px";
      frame.style.left = (e.clientX - offX) + "px";
    }
    
    function mouseUp() {
      window.removeEventListener("mousemove", divMove, true);
      if (!options.scrollPageIfOverflow) { document.body.style.overflow = "auto"; }
    }

    // Move currented selected panel to top
    frame.addEventListener("mousedown", function() {
      topzIndex++
      frame.style.zIndex = topzIndex;
      if (document.querySelector("#nuiPanelContainer")) {
        document.querySelector("#nuiPanelContainer").style.zIndex = topzIndex + 1;
      }
    })

  // If the panel already exists
  } else {
    var frame = document.querySelector(`#${id}`);

    // Check if options have been changed
    if (options.title != panelList[id].title) {
      frame.childNodes[0].childNodes[0].textContent = options.title;
      panelList[id].title = options.title;
    }
    if (options.content != panelList[id].content) {
      frame.childNodes[1] = options.content;
      panelList[id].content = options.content;
    }
    if (options.width != panelList[id].width) {
      frame.style.width = options.width;
      panelList[id].width= options.width;
    }
    if (options.height != panelList[id].height) {
      frame.style.height = options.height;
      panelList[id].height= options.height;
    }
    if (options.color != panelList[id].color) {
      setColor(frame, options.color)
      panelList[id].color = options.color;
    }
    if (options.posX != panelList[id].posX) {
      frame.style.left = options.posX;
      panelList[id].posX = options.posX;
    }
    if (options.posY != panelList[id].posY) {
      frame.style.top = options.posY;
      panelList[id].posY = options.posY;
    }
    if (options.visible) {
      if (options.visible === true) {
        restore(frame);
      } else {
        close(frame)
      }
    } else {
      // If no change to `options.visible` has been specified, restore the frame if it is not visible
      if (panelList[id].visible === false) {
        restore(frame);
      }
    }
    /*if (options.canClose != panelList[id].canClose) {
      //TODO
      panelList[id].canClose = options.canClose;
    }*/
  }
}

function close(frame) {
  panelList[frame.getAttribute("id")].visible = false;
  frame.classList.add("closing");
  setTimeout(function() {
    frame.classList.add("closed");
  }, 200);
  if (frame.parentElement === container) {
    container.classList.add("hidden");
  }
}

function restore(frame) {
  panelList[frame.getAttribute("id")].visible = true;
  frame.classList.remove("closed");
  frame.classList.remove("closing");
  if (frame.parentElement === container) {
    container.classList.remove("hidden");
  }
}

function setColor(frame, color) {
  if (color === "auto" && process.platform === "win32") {
    getWinRegColor(frame);
  } else {
    frame.style.border = "1px solid " + color;
    // Set title border color
    frame.childNodes[0].style.backgroundColor = color;
  }
}

function getWinRegColor(frame) {
  regKey.get("ColorizationColor", function(err, item) {
    if (err) {
      console.log(err);
    } else {
      var regColor = item.value;
      var rgb = [parseInt(regColor.substr(4,2),16), parseInt(regColor.substr(6,2), 16), parseInt(regColor.substr(8,2), 16)];
      // Fixes theme color from registry being 15% brighter than expected
      var r = Math.round(0.85 * rgb[0]);
      var g = Math.round(0.85 * rgb[1]);
      var b = Math.round(0.85 * rgb[2]);
      rgb = [r, g, b];

      var color = `rgb(${rgb})`;
      setColor(frame, color);
    }
  });
}

module.exports = panel;