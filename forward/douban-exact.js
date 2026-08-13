WidgetMetadata = {
  id: "douban.exact",
  title: "豆瓣片单精准版",
  modules: [{
    title: "豆瓣片单（精准版）",
    requiresWebView: false,
    functionName: "loadDoubanExactList",
    cacheDuration: 300,
    params: [
      {
        name: "url",
        title: "片单地址",
        type: "input",
        description: "支持豆瓣 subject_collection 地址和 App 分享链接；自动读取完整片单"
      }
    ]
  }],
  version: "1.0.1",
  requiredVersion: "0.0.1",
  description: "直接使用豆瓣 Subject ID，并自动翻页读取完整片单，避免 TMDB 同名误匹配和只显示前 20 条",
  author: "Chogori0424"
};

function getCollectionId(input) {
  let value = String(input || "").trim();

  // 豆瓣 App dispatch 链接中的 uri 可能经过 URL 编码，最多尝试解码两次。
  for (let i = 0; i < 2; i++) {
    try {
      const decoded = decodeURIComponent(value);
      if (decoded === value) break;
      value = decoded;
    } catch (_) {
      break;
    }
  }

  const match = value.match(/subject_collection\/([A-Za-z0-9_-]+)/i);
  if (!match) {
    throw new Error("无法识别豆瓣 subject_collection 地址");
  }
  return match[1];
}

async function fetchCollectionPage(listId, start, count) {
  const api = `https://m.douban.com/rexxar/api/v2/subject_collection/${listId}/items?start=${start}&count=${count}&updated_at&items_only=1&type_tag&for_mobile=1`;
  const response = await Widget.http.get(api, {
    headers: {
      Referer: `https://m.douban.com/subject_collection/${listId}/`,
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148"
    }
  });

  return response?.data?.subject_collection_items || [];
}

async function loadDoubanExactList(params = {}) {
  const listId = getCollectionId(params.url);
  const count = 20;
  const maxPages = 100;
  const allItems = [];

  // 豆瓣 subject_collection 接口每次最多稳定返回 20 条，
  // 因此由 Widget 主动连续翻页，直到完整读取整个片单。
  for (let pageIndex = 0; pageIndex < maxPages; pageIndex++) {
    const start = pageIndex * count;
    const pageItems = await fetchCollectionPage(listId, start, count);

    if (!pageItems.length) break;
    allItems.push(...pageItems);

    if (pageItems.length < count) break;
  }

  // 保留豆瓣原始排序，仅按 Subject ID 去重。
  const seen = new Set();
  return allItems
    .map(item => item?.id)
    .filter(id => id != null)
    .map(id => String(id))
    .filter(id => {
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    })
    .map(id => ({
      id,
      type: "douban"
    }));
}
