// Global game variables and util functions
var glGame = {
    // Global variables
    filePreFix: "fish",
    drawStart: false,
    isImport: false,
    scale: 1,
    runSpeed: 1,
    speed: 5,
    maxSpeed: 30,
    lineID: 1000,
    level: 10,
    showTime: 0,
    startPoint: cc.v2(-1122, 300),
    controlPoint: cc.v2(57, 290),
    endPoint: cc.v2(1207, 300),
    FishRunGap: 2,
    P13: [
        // ...
    ],
    FList: {},
    startGroupIndex: 100000,
    currGIndex: 100000,
    width: 3600,
    height: 2200,
    Color: {
        RED: cc.color(246, 92, 92),
        HAFEBCAK: cc.Color(156, 156, 156)
    },

    // Utility functions
    erxiangshi: function (start, end) {
        // ...
    },
    MultiPointBezier: function (points, t) {
        // ...
    },
    CreateBezierPoints: function (anchorpoints, pointsAmount, points) {
        // ...
    },
    getPOst: function (v) {
        // ...
    },
    getPosArrayAndmoveList: function (path, lineID, rate) {
        // ...
    },
    getPostFormPath: function (path, i) {
        // ...
    },
    calcBezierLength: function (list, t) {
        // ...
    },
    getMaxIndexByTime: function (posArray, moveList) {
        // ...
    },
    runTime: function (existTime, moveList) {
        // ...
    },
    range: function (timeListTmp, t) {
        // ...
    },
    edgeComputingToTime: function (posArray, moveList, runTime, showTime) {
        // ...
    },
    getArea: function (pos) {
        // ...
    },
    getPosFormTime_lastIndex: null,
    getPosFormTime_currTime: null,
    getPosFormTime_nextTime: null,
    getPosFormTime: function (_startTime, posArray, moveList) {
        // ...
    },
    getIndexByTime: function (existTime, moveList) {
        // ...
    },
    getTimeByIndex: function (index, moveList) {
        // ...
    },
    getAtlasForTexture: function (key, imgName) {
        // ...
    },
    atlasList: null,
    loadingAtlas: function (key, imageUrlStr, cb) {
        // ...
    },
    GetFrameData: function (imgName) {
        // ...
    },
    GetSizeData: function (str) {
        // ...
    },
    GetOffsetData: function (str) {
        // ...
    },
    EditOutConfig: {
        // ...
    },
    ServerOutConfig: {
        // ...
    },
    ClientOutConfig: {
        // ...
    },
    fishTableTest: {
        // ...
    }
};
