// Add panels CSS file
var fileref = document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", "css/panels.css");
    document.getElementsByTagName("head")[0].appendChild(fileref);

var panelList = {};

function panel(id, options) {
  if (!panelList[id]) {
    // Add options to panel
    var options = {
      title: (options.title ? options.title : ""),
      content: (options.content ? options.content : ""),
      color: `rgb(${Math.round(73*0.78)}, ${Math.round(180*0.78)}, ${Math.round(244*0.78)})`,
      posX: (options.posX ? options.posX : "2em"),
      posY: (options.posY ? options.posY : "2em"),
      canClose: (options.canClose === false ? false : true),
      visible: (options.visible === false ? false : true)
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
        frame.classList.add("closing");
        setTimeout(function() {
          frame.classList.add("closed");
        }, 400);
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
    /////////////////////

    // Position panel
    frame.style.left = options.posX;
    frame.style.top = options.posY;

  // If the panel already exists
  } else {
    var frame = document.querySelector(`#${id}`);
    frame.classList.remove("closed");
    frame.classList.remove("closing");

    // Check if options have changed
    if (options.title != panelList[id].title) {
      frame.childNodes[0].childNodes[0].textContent = options.title;
    }
  }
}

function restorePanel() {
  
}

  /*
  structure:
    window
    - title + close
    - contents
  */

//module.exports = panel;