// Add panels CSS file
var cssFile = document.createElement("link");
    cssFile.setAttribute("rel", "stylesheet");
    cssFile.setAttribute("type", "text/css");
    cssFile.setAttribute("href", __dirname + "/../css/panels.css");
    document.getElementsByTagName("head")[0].appendChild(cssFile);

var panelList = {};

function panel(id, options) {
  if (!panelList[id]) {
    // Add options to panel
    var options = {
      title: (options.title ? options.title : ""),
      content: (options.content ? options.content : ""),
      color: (options.color ? options.color : "#000000"),
      posX: (options.posX ? options.posX : "5em"),
      posY: (options.posY ? options.posY : "5em"),
      canClose: (options.canClose === false ? false : true), // Default value is true
      visible: (options.visible === false ? false : true) // Default value is true
    }
    // Push the panel to object
    panelList[id] = options;

    // Create frame node to contain panel contents
    var frame = document.createElement("div");
    frame.classList.add("frame");
    frame.setAttribute("id", id);
    // Frame border color from options
    frame.style.border = "1px solid " + options.color;
    document.body.appendChild(frame);

    // Create title bar
    var title = document.createElement("div");
    title.classList.add("title");
    title.style.backgroundColor = options.color;

    var titleText = document.createElement("span")
    titleText.appendChild(document.createTextNode(options.title));

    title.appendChild(titleText);
    frame.appendChild(title);

    // Add close button
    if (options.canClose) {
      var closeBtn = document.createElement("div");
      closeBtn.classList.add("closeBtn");
      // Add close symbol
      closeBtn.appendChild(document.createTextNode("✕"));
      // Append to titlebar
      title.appendChild(closeBtn);

      closeBtn.addEventListener("click", function() {
        close(frame);
      });
    }

    // Set panel visibility
    if (!options.visible) {
      frame.classList.add("closed");
    }

    // If content is a node
    if (options.content.parentNode) {
      var parent = options.content.parentNode;
      parent.removeChild(options.content);
      frame.appendChild(options.content);
    }
    // If content is html
    // TODO

    // Position panel
    frame.style.left = options.posX;
    frame.style.top = options.posY;
    frame.style.left = window.getComputedStyle(frame).getPropertyValue("left");
    frame.style.top = window.getComputedStyle(frame).getPropertyValue("top");

    // Allowing the panel to be dragged
    title.addEventListener("mousedown", mouseDown);
    window.addEventListener("mouseup", mouseUp);
    
    function mouseUp() {
      window.removeEventListener("mousemove", divMove, true);
    }

    function mouseDown(e) {
      offY = e.clientY - parseInt(title.offsetTop) - parseInt(frame.style.top);
      offX = e.clientX - parseInt(title.offsetLeft) - parseInt(frame.style.left);

      window.addEventListener("mousemove", divMove, true);
    }

    function divMove(e) {
      if (offY != 0) {
        frame.style.top = (e.clientY - offY) + "px";
      }
      if (offY != 0) {
        frame.style.left = (e.clientX - offX) + "px";
      }
    }



  // If the panel already exists
  } else {
    var frame = document.querySelector(`#${id}`);

    // Check if options have been changed
    if (options.title != panelList[id].title) {
      frame.childNodes[0].childNodes[0].textContent = options.title;
      panelList[id].title = options.title;
    }
    if (options.content != panelList[id].content) {
      frame.childNodes[1] = options.contentp
      panelList[id].content = options.content;
    }
    if (options.color != panelList[id].color) {
      frame.style.border = "1px solid " + options.color;
      frame.childNodes[0].style.backgroundColor = options.color;
      panelList[id].color = options.color;
    }
    if (options.posX != panelList[id].posX) {
      frame.style.left = options.posX;
      panelList[id].posX = options.posX
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
      // If no change to `option.visible` has been specified, restore the frame if it is not visible
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
  }, 300);
}

function restore(frame) {
  panelList[frame.getAttribute("id")].visible = true;
  frame.classList.remove("closed");
  frame.classList.remove("closing");
}

module.exports = panel;