let Bezier = require("Bezier");

let BezierData = (function () {
    let _this = {};

    // ------------------------【Private Properties】---------------------------
    let pointPrefab = null;
    let controlPrefab = null;
    let bezierCurveLists = [];
    let bezierCurveData = {
        time: 2, // Total run time of the curve
        length: 0, // Total length of the curve
        points: [], // List of curve points
    };
    let pointCurveDict = new Map();
    let deleteTarget = null;
    let pointNum = 0;
    let pointParent = null;
    let currentBezierType = 2;
    let pointCount = 100;

    let resolution = {
        width: glGame.width,
        height: glGame.height
    };

    // ------------------------【Public Methods】---------------------------

    // Initialize the BezierData object
    _this.init = function (point, control, parent, startPoint, controlPoint, endPoint, startSpeed, controlSpeed, endSpeed) {
        _this.clearAllBezier();
        pointPrefab = point;
        controlPrefab = control;
        pointParent = parent;
        if (startPoint && controlPoint && endPoint) {
            _this.initRandCurve(startPoint, controlPoint, endPoint, startSpeed, controlSpeed, endSpeed);
        }
    }

    // Get the resolution
    _this.getResolution = function () {
        return resolution;
    }

    // Set the resolution
    _this.setResolution = function (width, height) {
        resolution = { width, height };
        return resolution;
    }

    // Set the number of curve points
    _this.setPointCount = function (num) {
        pointCount = num;
    }

    // Set the type of Bezier curve
    _this.setBezierCurveType = function (type) {
        currentBezierType = type;
    }

    // Set the target node to be deleted
    _this.setDeleteTarget = function (node) {

