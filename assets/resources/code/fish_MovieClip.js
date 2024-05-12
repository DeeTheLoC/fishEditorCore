/**
 * Fish Animation Player
 */
cc.Class({
    extends: cc.Component,

    name: "FishAnimationPlayer",

    properties: {
        movieClipType: {
            default: 1,
            displayName: "Animation Type",
            tooltip: "Animation type: 1 - Fish, 2 - Effect",
            type: cc.Integer,
        },
        atlas: {
            default: null,
            tooltip: "The atlas used for the animation",
        },
        payName: {
            default: "",
            tooltip: "The name prefix for the animation frames",
        },
        effectIndex: {
            default: 0,
            tooltip: "The current index of the animation frame",
            type: cc.Integer,
        },
        min: {
            default: 0,
            tooltip: "The minimum index of the animation frames",
            type: cc.Integer,
        },
        max: {
            default: 0,
            tooltip: "The maximum index of the animation frames",
            type: cc.Integer,
        },
        loop: {
            default: 0,
            tooltip: "The number of times the animation should loop. 0 - loop indefinitely, -1 - don't loop",
            type: cc.Integer,
        },
        playEffectTime: {
            default: 0,
            tooltip: "The elapsed time since the animation started playing",
            type: cc.Float,
        },
        playEffectSpeed: {
            default: 0,
            tooltip: "The speed at which the animation should play",
            type: cc.Float,
        },
        isHaveZero: {
            default: false,
            tooltip: "Whether the animation frame index has a leading zero",
            type: cc.Boolean,
        },
        isDestroy: {
            default: true,
            tooltip: "Whether the animation node should be destroyed after playing",
            type: cc.Boolean,
        },
        callBack: {
            default: null,
            tooltip: "The callback function to be called after the animation finishes playing",
        },
        lineID: {
            default: null,
            tooltip: "The line id of the fish",
        },
        fishMoveTimeId: {
            default: 0,
            tooltip: "The timer id for the fish animation",
        },
        runfrequency: {
            default: 10,
            tooltip: "The frequency of the fish animation timer",
            type: cc.Integer,
        },
        runSpeed: {
            default: 0.013 * 10,
            tooltip: "The speed of the fish animation per frame",
            type: cc.Float,
        },
        isStart: {
            default: false,
            tooltip: "Whether the fish animation is currently playing",
            type: cc.Boolean,
        },
        data: {
            default: null,
            tooltip: "The data for the fish animation",
        },
        index: {
            default: 0,
            tooltip: "The current index of the fish animation frame",
            type: cc.Integer,
        },
        MaxIndex: {
            default: 0,
            tooltip: "The maximum index of the fish animation frames",
            type: cc.Integer,
        },
        mcBaseName: {
            default: null,
            tooltip: "The base name of the fish animation frames",
        },
        currAtl: {
            default: null,
            tooltip: "The current atlas being used for the fish animation",
        },
        editScale: {
            default: 1,
            tooltip: "The scale of the fish animation in the editor",
        },
        maxW: {
            default: 0,
            tooltip: "The maximum width of the fish animation in the editor",
        },
    },

    // Initializes the atlas for the fish animation
    initAtlas(atlas) {
        this.atlas = atlas;
    },

    // Initializes the fish animation with the given parameters
    initFishAnimation(
        atlas,
        payName,
        min,
        max,
        loop,
        isHaveZero,
        speed,
        isDestroy,
        callBack = null
    ) {
        this.atlas = atlas;
        this.payName = payName;
        this.effectIndex = min;
        this.min = min;
        this.max = max;
        this.loop = loop;
        this.playEffectTime = 0;
        this.playEffectSpeed = speed;
        this.isHaveZero = isHaveZero;
        this.isDestroy = isDestroy;
        this.callBack = callBack;
        this.node.getComponent(cc.Sprite).spriteFrame = this.getSprName();
        this.isPlayEffect = true;
    },

    // Gets the sprite name for the current animation frame
    getSprName() {
        let sprName;
        if (this.isHaveZero) {
            if (this.effectIndex < 10) {
                sprName = this.payName + "0" + this.effectIndex;
            } else {
                sprName = this.payName + "" + this.effectIndex;
            }
        } else {
            sprName = this.payName + "" + this.effectIndex;
        }
        return sprName;
    },

    // Plays the fish animation
    playFishAnimation(dt) {
        if (this.isStart && this.lineID !== undefined) {
            this.fishMoveTimeId += dt;
            if (this.fishMoveTimeId > this.runSpeed) {
                let spriteFrame = this.getImg();
                if (!spriteFrame) {
                    if (this.MaxIndex === 0) {
                        this.MaxIndex = this.index;
                    }
                    this.index = 1;
                    spriteFrame = this.getImg();
                }
                this.initSpr(spriteFrame);
                this.index++;
                if (this.MaxIndex !== 0 && this.index >= this.MaxIndex) {
                    this.index = 1;
                }
                this.fishMoveTimeId = 0;
            }
        }
    },

    // Sets the fish animation data
    setFishAnimationData(res) {
        this.data = res;
        this.index = 1;
        this.mcBaseName = this.data.filename + "_move";
        let spriteFrame = this.getImg();
        this.initSpr(spriteFrame);
        this.node.setScale(this.editScale);
        this.isStart = true;
    },

    // Gets the image for the current animation frame
    getImg() {
        let spriteFrame = this.getSpriteAtlas(this.mcBaseName + this.index);
        if (!spriteFrame && this.index == 1) {
            console.error(
                "Cannot find fish image frame: " +
                    this.mcBaseName +
                    this.index +
                    " data: " +
                    this.data
            );
            this.mcBaseName = "fish1_move";
            this.index = 1;
            return spriteFrame = this.getSpriteAtlas(this.mcBaseName + this.index);
        }
        return spriteFrame;
    },

    // Initializes the sprite with the given image
    initSpr(spriteFrame) {
        this.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    },

    // Gets the sprite frame from the atlas
    getSpriteAtlas(frameName) {
        if (this.atlas != null) {
            if (this.currAtl && this.atlas[this.currAtl].getSpriteFrame(frameName) != null) {
                return this.atlas[this.currAtl].getSpriteFrame(frameName);
            }
            let length = this.atlas.length;
            let sprFrame;
            for (let i = 0; i < length; i++) {
                sprFrame = this.atlas[i].getSpriteFrame(frameName);
                if (sprFrame) {
                    this.currAtl = i;
                    return sprFrame;
                }
            }
        } else {
            return glGame.getAtlasForTexture(this.filename, frameName);
        }
    },

    onDestroy() {
        this.lineID = null;
        this.fishMoveTimeId = 0;
        this.runSpeed = 0;
        this.isStart = false;
        this.data = null;
        this.index = 0;
        this.mcBaseName = null;
        this.currAtl = null;
    },
});
