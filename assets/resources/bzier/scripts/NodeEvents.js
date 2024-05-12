const NodeEvents = (function () {
  let _this = {};
  let moveTargetNode = null;
  let isMouseDown = false;

  // Convert screen coordinates to node coordinates
  const convertToNodeSpace = (event) =>
    glGame.editor.node.getChildByName("deskUI").convertToNodeSpaceAR(event.getLocation());

  // Check if the node can be deleted
  const isDeleteNode = (node) => node.ident === lcl.Ident.point;

  // Check if the mouse position is within the drawing area
  const isAtDrawingArea = (pos) => {
    const resolution = lcl.BezierData.getResolution();
    const halfW = resolution.width / 2;
    const halfH = resolution.height / 2;

    return pos.x > -halfW && pos.x < halfW && pos.y > -halfH && pos.y < halfH;
  };

  // Check if the node can be dragged
  const isDragMove = (mousePos, target) => {
    switch (target.ident) {
      case lcl.Ident.point:
      case lcl.Ident.control:
        return isAtDrawingArea(mousePos);
      case lcl.Ident.window:
        return true;
      default:
        return false;
    }
  };

  _this.setMoveTargetNode = (target) => {
    moveTargetNode = target;
  };

  // Add drag events to a node
  _this.addDragEvents = (node, target = node) => {
    node.on(cc.Node.EventType.MOUSE_DOWN, (event) => {
      if (glGame.Ctrl) return;
      event.stopPropagation();

      if (event.button === cc.Event.EventMouse.BUTTON_LEFT) {
        moveTargetNode = target;
        isMouseDown = true;
      }
    });

    const move = (event) => {
      if (isMouseDown && moveTargetNode) {
        target.opacity = 100;
        cc.game.canvas.style.cursor = "all-scroll";

        const mousePos = convertToNodeSpace(event);
        if (isDragMove(mousePos, moveTargetNode)) moveTargetNode.setPosition(mousePos);
      } else {
        cc.game.canvas.style.cursor = "auto";
      }
    };

    node.parent.on(cc.Node.EventType.MOUSE_MOVE, move);

    node.on(cc.Node.EventType.MOUSE_LEAVE, () => {
      target.opacity = 255;
      cc.game.canvas.style.cursor = "auto";
    });

    node.on(cc.Node.EventType.MOUSE_UP, () => {
      isMouseDown = false;
      moveTargetNode = null;
      cc.game.canvas.style.cursor = "auto";
    });
  };

  // Add delete events to a node
  _this.addPointDeleteEvents = (node) => {
    node.on(cc.Node.EventType.MOUSE_DOWN, (event) => {
      if (glGame.Ctrl) return;
      event.stopPropagation();

      if (event.button === cc.Event.EventMouse.BUTTON_RIGHT) {
        if (isDeleteNode(event.target)) {
          event.isShowPointMenuDeleteAndTime = isDeleteNode(event.target);
          event.target.pos = convertToNodeSpace(event);
          lcl.BezierData.setDeleteTarget(event.target);
          lcl.Events.emit("showPointMenuView", event);
        }
      }
    });
  };

  // Add touch events to the canvas node
  _this.addCanvasTouchEvents = (canvasNode = cc.find("Canvas")) => {
    let target;

    canvasNode.on(cc.Node.EventType.MOUSE_DOWN, (event) => {
      if (glGame.Ctrl) return;
      event.stopPropagation();

      if (!glGame.currentFish) {
        glGame.editor.status("请创建一条鱼", glGame.Color.RED);
        return;
      }

      if (event.button === cc.Event.EventMouse.BUTTON_RIGHT) {
        const leftClickMenu = glGame.editor.node.getChildByName("leftClickMenu");
        leftClickMenu.setPosition(convertToNodeSpace(event));
        leftClickMenu.active = true;
      }

      if (event.button === cc.Event.EventMouse.BUTTON_LEFT) {
        const leftClickMenu = glGame.editor.node.getChildByName("leftClickMenu");
        leftClickMenu.active = false;
      }
    });

    canvasNode.on("addNewPoint", (event) => {
      if (glGame.Ctrl) return;
      event.stopPropagation();

      if (!glGame.currentFish) {
        glGame.editor.status("请创建一条鱼", glGame.Color.RED);
        return;
      }

      if (!isOperate) lcl.Events.emit("hidePointMenuView");

      const { target, bzierData } = event;
      glGame.isAdd = true;

      if (!bzierData) {
        target = event.target;
        const mousePos = convertToNodeSpace(event);

        if (!isAtDrawingArea(mousePos)) return;

        if (lcl.BezierData.getBezierCurveType() === lcl.BezierCurveType.SecondOrder) {
          lcl.BezierData.createCurve(mousePos);
        }

        if (lcl.BezierData.getBezierCurveType() === lcl.BezierCurveType.ThirdOrder) {
          lcl.BezierData.createThirdOrderCurve(mousePos);
        }

        isMouseDown = true;
      } else {
        if (!isOperate) lcl.Events.emit("hidePointMenuView");

        glGame.isAdd = true;

        if (lcl.BezierData.getBezierCurveType() === lcl.BezierCurveType.SecondOrder) {
          lcl.BezierData.createCurve(null, bzierData);
        }

        isMouseDown = true;
      }
    });

    canvasNode.on(cc.Node.EventType.MOUSE_MOVE, (event) => {
      if (!glGame.currentFish) {
        glGame.editor.status("请创建一条鱼", glGame.Color.RED);
        return;
      }

      const mousePos = convertToNodeSpace(event);
      lcl.Events.emit("setMouseLocation", mousePos);

      if (isMouseDown && moveTargetNode && isDragMove(mousePos, moveTargetNode)) {
        moveTargetNode.setPosition(mousePos);
      }
    });

    canvasNode.on(cc.Node.EventType.MOUSE_UP, () => {
      if (!glGame.currentFish) {
        glGame.editor.status("请创建一条鱼", glGame.Color.RED);
        return;
      }

      isMouseDown = false;
      moveTargetNode = null;
    });
  };

  return _this;
}());

module.exports = NodeEvents;
