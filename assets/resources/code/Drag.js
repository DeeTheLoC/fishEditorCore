cc.Class({
    extends: cc.Component,

    properties: {
        isSelf: {
            default: false,
            displayName: "Drag self or parent",
            tooltip: "Drag self: true, parent: false",
            type: cc.Boolean,
        },
        isEnterCtrl: {
            default: false,
            displayName: "Require Ctrl key press",
            tooltip: "True: require Ctrl key press, false: no requirement",
            type: cc.Boolean,
        },
    },

    start() {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
            this.opacity = 255;
            const widget = this.node.parent.getComponent(cc.Widget);
            if (widget) {
                widget.enabled = false;
            }
            const delta = event.touch.getDelta();
            if (this.isEnterCtrl) {
                if (typeof glGame.Ctrl === 'undefined' || !glGame.Ctrl) {
                    return;
                }
            }
            if (this.isSelf) {
                this.node.x += delta.x;
                this.node.y += delta.y;
            } else {
                this.node.parent.x += delta.x;
                this.node.parent.y += delta.y;
            }
        }, this.node);
    },
});
