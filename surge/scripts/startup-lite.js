// Chogori Startup Ads Lite
// Scope: Xianyu splash (request), JD and Meituan Waimai splash (responses).
// No external dependencies, persistent storage, telemetry, or network requests.
(() => {
  const url = ($request && $request.url) || "";

  // Xianyu: return a small, successful empty ad payload without a network round trip.
  if (typeof $response === "undefined") {
    if (/^https:\/\/iyes\.youku\.com\/uts\/v1\/start\//.test(url)) {
      $done({
        response: {
          status: 200,
          headers: { "Content-Type": "application/json" },
          body: "{}"
        }
      });
    } else {
      $done({});
    }
    return;
  }

  // Fail open: unrecognized payloads and malformed JSON are passed through untouched.
  if (typeof $response.body !== "string") {
    $done({});
    return;
  }
  try {
    const payload = JSON.parse($response.body);
    let modified = false;

    if (/^https?:\/\/api\.m\.jd\.com\/client\.action\?functionId=start(?:&|$)/.test(url)) {
      if (payload && Array.isArray(payload.images)) {
        payload.images.forEach((group) => {
          if (!Array.isArray(group)) return;
          group.forEach((item) => {
            if (!item || typeof item !== "object" || !("showTimes" in item)) return;
            item.showTimes = 0;
            item.onlineTime = "2030-12-24 00:00:00";
            item.referralsTime = "2030-12-25 00:00:00";
            item.time = 0;
            modified = true;
          });
        });
        if ("showTimesDaily" in payload) {
          payload.showTimesDaily = 0;
          modified = true;
        }
      }
    } else if (/^https?:\/\/wmapi\.meituan\.com\/api\/v\d+\/loadInfo(?:\?|$)/.test(url)) {
      const startpicture = payload && payload.data && payload.data.startpicture;
      if (startpicture && typeof startpicture === "object" && !Array.isArray(startpicture)) {
        if (Array.isArray(startpicture.ad)) {
          startpicture.ad = [];
          modified = true;
        }
        if (Array.isArray(startpicture.mk)) {
          startpicture.mk = [];
          modified = true;
        }
      }
    }

    $done(modified ? { body: JSON.stringify(payload) } : {});
  } catch (_) {
    $done({});
  }
})();
