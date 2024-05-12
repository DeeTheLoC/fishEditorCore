/**
 * Fish class for the fishing game.
 * Handles the initialization, movement, animation, and collision of a fish.
 */
class Fish extends glGame.movieClip {
    constructor(fishData) {
        super();
        this.ON_DESTROY_LISTENERS = [];

        this.WHIRLPOOL_RADIUS = 100;
        this.MOVE_INTERVAL = 0.017;

        this.initFish(fishData);
    }

    initFish(fishData) {
        this.fishData = fishData;
        this.moveList = fishData.moveList;
        this.posArray = fishData.posArray;
        this.showTime = fishData.showTime;
        this.runTime = fishData.runTime;
        this.frequency = fishData.frequency;

        this._startTime = this.getStartTime();
        this._allTime = this.runTime + this.showTime;

        if (this._startTime >= this._allTime) {
            this.death(CONST.dieType0);
            return;
        }

        this._bUpdate = true;
        this.startMove();

        this.node.getComponent(cc.Sprite).enabled = false;
        this.node.zIndex = this.getZIndex();
    }

    getStartTime() {
        const { serverTime, createTime } = this.fishData;
        return (serverTime - createTime) / 1000;
    }

    getZIndex() {
        const fishLocalData = glGame.fishTable[this.fishData.FishId] || { level: 100 };
        const level = fishLocalData.level + Math.ceil(Math.random() * 30);
        return CONST.nodeZIndex.zIndexFish + level;
    }

    setTips() {
        const lab_desc_id = glGame.editor.node.getChildByName("tips").getChildByName("layout").getChildByName("lab_desc_id");
        const lab_id = glGame.editor.node.getChildByName("tips").getChildByName("layout").getChildByName("lab_id");

        const onMouseEnter = (event) => {
            glGame.editor.node.getChildByName("tips").active = true;
            const data = glGame.fishTable[this.node.fishTypeId];
            lab_desc_id.getComponent(cc.Label).string = `fishTypeId:${data.fishTypeId}`;
            glGame.editor.node.getChildByName("tips").getChildByName("layout2").getChildByName("lab_d").getComponent(cc.Label).string = data.fishName;
            glGame.editor.node.getChildByName("tips").getChildByName("layout2").getChildByName("lab_d").active = true;
            glGame.editor.node.getChildByName("tips").getChildByName("layout2").getChildByName("lab_desc").active = true;
            glGame.editor.node.getChildByName("tips").getChildByName("bg").height = 150;
            glGame.editor.node.getChildByName("tips").getChildByName("bg").width = 300;
        };

        const onMouseMove = (event) => {
            const pos = glGame.editor.node.convertToNodeSpaceAR(event.getLocation());
            pos.x -= 10;
            glGame.editor.node.setPosition(pos);
        };

        const onMouseLeave = (event) => {
            glGame.editor.node.getChildByName("tips").active = false;
        };

        this.node.on(cc.Node.EventType.MOUSE_ENTER, onMouseEnter);
        this.node.on(cc.Node.EventType.MOUSE_MOVE, onMouseMove);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, onMouseLeave);
    }

    start() {
        if (this.node.name.indexOf("resList_fish_") !== -1) {
            this.setTips();
        }

        const onMouseDown = (event) => {
            if (event.getButton() === cc.Event.EventMouse.BUTTON_LEFT) {
                if (this.node.name.indexOf("resList_fish_") !== -1) {
                    // Do something for editing mode
                } else {
                    this.isMouseDown = true;
                }
            }

            if (event.getButton() === cc.Event.EventMouse.BUTTON_RIGHT) {
                // Do something for right-click
            }
        };

        const onMouseMove = (event) => {
            if (this.isMouseDown) {
                this.moveNode(event);
            }
        };

        const onMouseUp = () => {
            this.isMouseDown = false;
        };

        const onMouseEnter = (event) => {
            // Show tooltip
        };

        const onMouseMoveTooltip = (event) => {
            // Move tooltip
        };

        const onMouseLeaveTooltip = (event) => {
            // Hide tooltip
        };

        this.node.on(cc.Node.EventType.MOUSE_DOWN, onMouseDown);
        this.node.parent.on(cc.Node.EventType.MOUSE_MOVE, onMouseMove);
        this.node.on(cc.Node.EventType.MOUSE_UP, onMouseUp);
        this.node.on(cc.Node.EventType.MOUSE_ENTER, onMouseEnter);
        this.node.on(cc.Node.EventType.MOUSE_MOVE, onMouseMoveTooltip);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, onMouseLeaveTooltip);
    }

    moveNode(event) {
        const delta = event.getDelta();
        this.node.x += delta.x;
        this.node.y += delta.y;

        const moveTargetNode = glGame.drawBezier.node.getChildByName("point_0");
        if (moveTargetNode) {
            const mousePos = this.convertToNodeSpace(event);
            moveTargetNode.setPosition(mousePos);
        }
    }

    convertToNodeSpace(event) {
        return cc.find("Canvas").convertToNodeSpaceAR(event.getLocation());
    }

    death(dieType, isOne = true) {
        if (isOne) {
            return;
        }

        if (dieType === CONST.dieType1) {
            // Do something for dieType1
        } else if (dieType === CONST.dieType4) {
            // Do something for dieType4
        } else {
            // Do something for other dieTypes
        }
    }

    dispose() {
        this._bUpdate = false;
        this.node.off(cc.Node.EventType.TOUCH_START);
        this.fishData = null;
        this.fishLine = null;
        this.fishPath = null;
        this.timeIndex = 0;
        this.moveList = null;
        this.posArray = null;
        if (this.whirlpool) this.whirlpool.destroy();
        this.node.destroy();
    }

    settingIcing(isInFreeze) {
        this._bUpdate = isInFreeze;
    }

    getPostFormPath(i) {
        const startPos = cc.v2(
            this.path[i]["start"].x,
            this.path[i]["start"].y
        );
        const controlPos = cc.v2(
            this.path[i]["control"].x,
            this.path[i]["control"].y
        );
        const endPos = cc.v2(
            this.path[i]["end"].x,
            this.path[i]["end"].y
        );
        return { startPos, controlPos, endPos };
    }

    initEditorFish(resGroupId, restype, scale = 1, frequency = glGame.runSpeed) {
        this.editScale = scale;
        this.filename = `fish${resGroupId}`;
        this.resType = restype;
        this.fishPath = { type: 2, liveTime: Math.random() * 20000 + 1000 };
        this.fishLine = this.fishPath;
        this.fishData = { filename: this.filename };
        this.setFIsh(this.fishData);
        this.runSpeed = frequency;
        this.isPlayStartMc = true;
        this.showTime = 0;
    }

    initResEditorFish(filename, maxW, scale = 1, frequency = glGame.runSpeed) {
        this.editScale = scale;
        this.maxW = maxW;
        this.setResFIsh(filename);
        this.runSpeed = frequency;
        this.isPlayStartMc = true;
        this.showTime = 0;
        this.fishData = { fileName: filename };
    }

    updateData() {
        const info = glGame.FList[glGame.currGIndex].fishLine[this.node.lineID];
        this.moveList = info.moveList;
        this.posArray = info.posArray;
        const baseFrameRate = Number(glGame.editor.getFishResConfig(Number(info.fishTypeId)).frameRate);
        this.updateFrequency(baseFrameRate * info.frequency * 10);
    }

    setMoveData(fishLine) {
        this.posArray = fishLine.posArray;
        this.moveList = fishLine.moveList;
        this.showTime = fishLine.showTime;
    }

    editMove() {
        const info = glGame.FList[glGame.currGIndex].fishLine[this.node.lineID];
        this.moveList = info.moveList;
        this.posArray = info.posArray;
        this.showTime = info.showTime;
        this.startMove();
    }

    getRunTime() {
        const info = glGame.FList[glGame.currGIndex].fishLine[this.node.lineID];
        this.moveList = info.moveList;
        this.posArray = info.posArray;
        this.showTime = info.showTime;
        return this.getMaxIndexByTime();
    }

    startMove(isset = false) {
        this._runTimeALl = 0;
        this._startTime = 0;
        this._time = Date.now();
        this.node.x = this.posArray[0].x;
        this.node.y = this.posArray[0].y;
        this._bUpdate = true;
        this.allTime = this.getMaxIndexByTime();
        this.at = 0;
        if (isset) {
            glGame.editor.node.getChildByName("fishGroupProgress").getChildByName("slider").lineID = this.node.lineID;
        }
        const info = glGame.FList[glGame.currGIndex].fishLine[this.node.lineID];
        const baseFrameRate = Number(glGame.editor.getFishResConfig(Number(info.fishTypeId)).frameRate);
        this.updateFrequency(baseFrameRate * info.frequency * 10);
    }

    setProgress(progress) {
        this._startTime = progress * this.allTime;
        this._time = Date.now();
        this.delayedPause = 1;
        this._bUpdate = true;
    }

    getMaxIndexByTime() {
        let timeIndex = 0;
        let startTime = 0;
        let nowTime = 0;
        while (true) {
            timeIndex = this.getIndexByTime(startTime);
            if (timeIndex === -1) {
                break;
            }
            const i = timeIndex > 0 ? 3 * timeIndex : 2 * timeIndex;
            const a = this.posArray[i];
            if (!a) {
                break;
            }
            startTime += this.MOVE_INTERVAL;
            nowTime += this.MOVE_INTERVAL;
        }
        return nowTime;
    }

    move(dt) {
        if (!this._bUpdate || !this.moveList || this.showTime <= 0) {
            return;
        }

        this.showTime -= dt;
        if (this.showTime <= 0) {
            this._startTime = 0;
            this._time = Date.now();
            this.showTime = -1;
        }

        if (this.fishPath.type === 2) {
            this.timeIndex = this.getIndexByTime(this._startTime);
            if (this.timeIndex === -1) {
                this.death(CONST.dieType0);
                return;
            }

            const t = this.getTimeRatio(this._startTime);
            const { startPos, controlPos, endPos } = this.getPostFormPath(this.timeIndex);
            const pos = this.getBezierPoint(t, startPos, controlPos, endPos);
            const angle = this.getAngle(pos, this.node.position);

            this.node.angle = angle;
            this.node.x = pos.x;
            this.node.y = pos.y;
        } else if (this.fishPath.type === 1) {
            // Do something for type 1
        }

        if (this.delayedPause > 0) {
            this.delayedPause = 0;
            this._bUpdate = false;
        }
    }

    getIndexByTime(time) {
        let index = 0;
        let currTime = 0;
        for (let i = 0; i < this.moveList.length / 2; i++) {
            const one = 2 * i;
            const two = 2 * i + 1;
            currTime += this.moveList[one] + this.moveList[two];
            if (currTime >= time) {
                return i;
            }
        }
        return -1;
    }

    getTimeByIndex(index) {
        let time = 0;
        for (let i = 0; i < index; i++) {
            const one = 2 * i;
            const two = 2 * i + 1;
            time += this.moveList[one] + this.moveList[two];
        }
        return time;
    }

    getTimeRatio(time) {
        return time / this.fishLine.liveTime;
    }

    getBezierPoint(t, p0, p1, p2) {
        const u = 1 - t;
        const tt = t * t;
        const uu = u * u;

        const b0 = uu * p0;
        const b1 = 2 * u * t * p1;
        const b2 = tt * p2;

        return cc.v2(b0 + b1 + b2);
    }

    getAngle(pos, point) {
        const dx = pos.x - point.x;
        const dy = pos.y - point.y;
        return Math.atan2(dy, dx) * 180 / Math.PI;
    }

    updateFrequency(frequency) {
        this.frequency = frequency;
        this.node.getComponent(cc.Animation).defaultDuration = 1 / frequency;
    }

    playFishMovieClip(dt) {
        if (this.isPlayStartMc) {
            this.node.getComponent(cc.Animation).play();
            this.isPlayStartMc = false;
        }
    }

    OnDestroy() {
        this.ON_DESTROY_LISTENERS.forEach((listener) => {
            listener();
        });
        this.ON_DESTROY_LISTENERS = [];

        this.moveList = [];
        this.fishData = null;
        this.fishLine = null;
        this.fishPath = null;
        this.index = 0;
        this.posArray = null;
        this.isHit = false;
        this.hitTime = 0;
    }
}
