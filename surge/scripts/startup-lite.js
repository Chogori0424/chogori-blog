// 京东开屏候选。来源和状态见 rules/jd.json；无网络、存储或日志。
(() => {
  let result = {};
  try {
    if (typeof $request === "undefined" || typeof $response === "undefined") {
      $done(result);
      return;
    }
    const match = /^https:\/\/api\.m\.jd\.com\/client\.action\?([^#]+)$/.exec($request.url || "");
    const params = match ? match[1].split("&") : [];
    const ids = params.filter(p => /^functionId=/.test(p));
    if (ids.length !== 1 || ids[0] !== "functionId=start" ||
        !/^(GET|POST)$/.test($request.method || "") ||
        $response.status !== 200 || typeof $response.body !== "string") {
      $done(result);
      return;
    }
    const obj = JSON.parse($response.body);
    const record = x => x !== null && typeof x === "object" && !Array.isArray(x);
    const own = (x, k) => Object.prototype.hasOwnProperty.call(x, k);
    // 结构变化、部分坏数据、业务错误均原样放行。
    if (!record(obj) || !Array.isArray(obj.images) ||
        (own(obj, "code") && obj.code !== 0 && obj.code !== "0") ||
        !obj.images.every(g => Array.isArray(g) && g.every(record))) {
      $done(result);
      return;
    }
    let changed = false;
    for (const group of obj.images) {
      for (const item of group) {
        if (typeof item.showTimes === "number" && Number.isFinite(item.showTimes) && item.showTimes > 0) {
          item.showTimes = 0;
          if (typeof item.time === "number" && Number.isFinite(item.time)) item.time = 0;
          changed = true;
        }
      }
    }
    if (changed) {
      if (typeof obj.showTimesDaily === "number" && Number.isFinite(obj.showTimesDaily)) obj.showTimesDaily = 0;
      result = { body: JSON.stringify(obj) };
    }
  } catch (_) {
    // 不记录 URL、响应或异常详情。
  }
  $done(result);
})();
