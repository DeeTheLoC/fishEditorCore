// FishLineItem class
cc.Class({
  extends: cc.Component,

  constructor(type) {
    super();
    this.type = type;
    this.$tips = null;
    this.$labDescId = null;
    this.$labId = null;
    this.$layout2 = null;
    this.$labD = null;
    this.$labDesc = null;
  },

  properties: {
    type: 0, // 1 组 item ， 2资源item ，3 线
  },

  onLoad() {
    this.$tips = glGame.editor.node.getChildByName("tips");
    this.$labDescId = this.$tips.getChildByName("layout").getChildByName("lab_desc_id");
    this.$labId = this.$tips.getChildByName("layout").getChildByName("lab_id");
    this.$layout2 = this.$tips.getChildByName("layout2");
    this.$labD = this.$layout2.getChildByName("lab_d");
    this.$labDesc = this.$layout2.getChildByName("lab_desc");

    this.node.on(cc.Node.EventType.MOUSE_ENTER, this.onMouseEnter, this.node);
    this.node.on(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this.node);
    this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this.node);
  },

  onMouseEnter() {
    if (this.type === 1) {
      this.showGroupInfo();
    } else if (this.type === 3) {
      this.showFishLineInfo();
    }
  },

  onMouseMove(event) {
    const pos = this.node.convertToNodeSpaceAR(event.getLocation());
    if (this.type === 1) {
      pos.x = pos.x + this.$tips.width + 10;
    } else if (this.type === 3) {
      pos.x -= 10;
    }
    this.$tips.setPosition(pos);
  },

  onMouseLeave() {
    this.hideTips();
  },

  showGroupInfo() {
    this.node.getChildByName("moveHeight").active = true;
    this.$tips.active = true;
    this.$labId.active = true;
    const info = glGame.FList[this.node.groupID];
    this.$labDescId.getComponent(cc.Label).string = "鱼组ID";
    this.$labId.getComponent(cc.Label).string = `${this.node.groupID}`;
    this.$labD.getComponent(cc.Label).string = info?.desc || "";
    this.$labD.active = true;
    this.$labDesc.active = true;
    this.$tips.getChildByName("bg").height = 150;
    this.$tips.getChildByName("bg").width = 300;
    this.emit("groupInfoChanged", this.node.groupID, info);
  },

  showFishLineInfo() {
    this.node.getChildByName("moveHeight").active = true;
    this.$tips.active = true;
    this.$labId.active = true;
    const lineInfo = glGame.FList[glGame.currGIndex].fishLine[this.node.lineID];
    this.$labId.getComponent(cc.Label).string = `${this.node.lineID}`;
    const fishName = lineInfo?.fishTypeId
      ? glGame.fishTable[Number(lineInfo.fishTypeId)].fishName
      : "找不到配置 " + lineInfo?.lineID || this.node.fishTypeId;
    this.$labDescId.getComponent(cc.Label).string = fishName;
    this.$labD.getComponent(cc.Label).string = lineInfo?.desc || "";
    this.$labD.active = true;
    this.$labDesc.active = true;
    this.$tips.getChildByName("bg").height = 150;
    this.$tips.getChildByName("bg").width = 300;
    this.emit("fishLineInfoChanged", this.node.lineID, lineInfo);
  },

  hideTips() {
    this.node.getChildByName("moveHeight").active = false;
    this.$tips.active = false;
  },
});
