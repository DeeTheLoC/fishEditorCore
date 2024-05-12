// Set Panel
cc.Class({
  extends: cc.Component,
  start() {
    const speedEditbox = this.getNodeByName("layourt", "speed_editbox");
    const runSpeedEditbox = this.getNodeByName("layourt", "runSpeed_editbox");
    const fishIDEditbox = this.getNodeByName("layourt", "fishID_editbox");
    const groupIDEditbox = this.getNodeByName("layourt", "groupID_editbox");

    if (speedEditbox && speedEditbox.getComponent) {
      speedEditbox.getComponent(cc.EditBox).string = glGame.speed || "";
    }
    if (fishIDEditbox && fishIDEditbox.getComponent) {
      fishIDEditbox.getComponent(cc.EditBox).string = glGame.lineID || "";
    }
    if (groupIDEditbox && groupIDEditbox.getComponent) {
      groupIDEditbox.getComponent(cc.EditBox).string = glGame.startGroupIndex || "";
    }

    speedEditbox.on("text-changed", this.onTextChanged.bind(this, "speed"));
    runSpeedEditbox.on("text-changed", this.onTextChanged.bind(this, "runSpeed"));
    fishIDEditbox.on("text-changed", this.onTextChanged.bind(this, "lineID"));
    groupIDEditbox.on("text-changed", this.onTextChanged.bind(this, "startGroupIndex"));

    this.updateFishAndGroupCount();
  },
  getNodeByName(name, childName) {
    const node = this.node.getChildByName(name);
    if (node) {
      return node.getChildByName(childName);
    }
    return null;
  },
  onTextChanged(property, editbox) {
    if (glGame && glGame[property] !== undefined) {
      const value = Number(editbox.string);
      if (isNaN(value)) {
        console.error(`Invalid value for ${property}`);
      } else {
        glGame[property] = value;
      }
    }
  },
  updateFishAndGroupCount() {
    if (glGame && glGame.FList && typeof glGame.FList === "object") {
      let len = 0;
      let len2 = 0;
      for (const key in glGame.FList) {
        len++;
        const groupList = glGame.FList[key];
        for (const key in groupList.fishLine) {
          len2++;
        }
      }
      const label1 = this.node.getChildByName("lab_info1").getComponent(cc.Label);
      const label2 = this.node.getChildByName("lab_info2").getComponent(cc.Label);
      if (label1 && label2) {
        label1.string = `当前鱼组数量：${len}`;
        label2.string = `当前总鱼线：${len2}`;
      }
    }
  },
  closeView() {
    this.node.active = false;
  },
});
