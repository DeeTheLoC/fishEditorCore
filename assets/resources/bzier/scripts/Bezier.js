const Bezier = function (pointArr, allTime = 2) {
  if (!Array.isArray(pointArr) || pointArr.length < 2) {
    throw new Error("pointArr must be a non-empty array");
  }

  if (typeof allTime !== "number" || allTime <= 0) {
    throw new Error("allTime must be a positive number");
  }

  let _this = {};
  let _pointLists = [];
  let totalLength = 0;
  let prevPos = { x: pointArr[0].x, y: pointArr[0].y, length: 0 };
  let currentRunTime = 0;
  let runTime = allTime;
  let pointArrLength = pointArr.length;

  const factorial = (i) => {
    if (i < 0) return 0;
    if (i === 0 || i === 1) return 1;
    return Array.from({ length: i }, (_, k) => k + 1).reduce((acc, val) => acc * val, 1);
  };

  const ComputeBezier = (dt, runTime) => {
    if (pointArrLength < 2) {
      throw new Error("pointArr must have at least two elements");
    }

    let t = currentRunTime / runTime;

    const x = pointArr.reduce((acc, item, index) => {
      if (index === 0) {
        return acc + item.x * Math.pow((1 - t), pointArrLength - index - 1) * Math.pow(t, index);
      }

      return (
        acc +
        (factorial(pointArrLength) / (factorial(index) * factorial(pointArrLength - index - 1))) *
          item.x *
          Math.pow((1 - t), pointArrLength - index - 1) *
          Math.pow(t, index)
      );
    }, 0);

    const y = pointArr.reduce((acc, item, index) => {
      if (index === 0) {
        return acc + item.y * Math.pow((1 - t), pointArrLength - index - 1) * Math.pow(t, index);
      }

      return (
        acc +
        (factorial(pointArrLength) / (factorial(index) * factorial(pointArrLength - index - 1))) *
          item.y *
          Math.pow((1 - t), pointArrLength - index - 1) *
          Math.pow(t, index)
      );
    }, 0);

    const length = Math.sqrt(Math.pow(prevPos.x - x, 2) + Math.pow(prevPos.y - y, 2));
    const v2 = { x, y, length };

    _pointLists.push(v2);
    prevPos = v2;
    totalLength += length;
    currentRunTime += dt;
  };

  _this.getPoints = (count = 200) => {
    resetData();
    const dt = runTime / count;

    for (let i = 0, len = count + 1; i < len; i++) {
      ComputeBezier(dt, runTime);
    }

    return _pointLists;
  };

  _this.getCurveLength = () => {
    return totalLength;
  };

  const resetData = () => {
    _pointLists = [];
    totalLength = currentRunTime = 0;
    prevPos = {
      x: pointArr[0].x,
      y: pointArr[0].y,
      length: 0,
    };
  };

  return _this;
};

module.exports = Bezier;
