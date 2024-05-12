class DrawBezier extends cc.Component {
  static #instance;

  static get instance() {
    if (!DrawBezier.#instance) {
      DrawBezier.#instance = new DrawBezier();
    }

    return DrawBezier.#instance;
  }

  onLoad() {
    glGame.drawBezier = this;
    this.currPoint = null;
  }

  clearCurrFishLine() {
    lcl.BezierData.clearAllBezier();
    lcl.NodeEvents.setMoveTargetNode(null);
  }

  startDraw() {
    glGame.drawStart = true;
    this.init();
    lcl.Events.on("setMouseLocation", this.setMouseLocation);
    lcl.Events.on("showPointMenuView", this.showPointMenuView);
    lcl.Events.on("hidePointMenuView", this.hidePointMenuView);

    this.node.parent.on(cc.Node.EventType.MOUSE_UP, async () => {
      await lcl.BezierData.saveBezierPath();
      this.saveDataToFishPointList();
    });
  }

  init() {
    // Initialize the UI components
    this.infoWindow = this.node.getChildByName("infoWindow");
    this.notice = this.infoWindow.getChildByName("notice").getComponent(cc.Label);
    this.fileInputBox = this.infoWindow.getChildByName("Input").getChildByName("fileEditBox").getComponent(cc.EditBox);
    this.controlPanel = this.node.getChildByName("controlPanel");
    this.moveBtn = this.controlPanel.getChildByName("moveBtn");
    this.smoothnessInputBox = this.controlPanel.getChildByName("smoothnessInput").getChildByName("EditBox").getComponent(cc.EditBox);
    this.runTimeInputBox = this.controlPanel.getChildByName("runTimeInput").getChildByName("EditBox").getComponent(cc.EditBox);
    this.resolutionWidthInputBox = this.controlPanel.getChildByName("resolution").getChildByName("width").getComponent(cc.EditBox);
    this.resolutionHeightInputBox = this.controlPanel.getChildByName("resolution").getChildByName("height").getComponent
