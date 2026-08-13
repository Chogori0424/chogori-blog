WidgetMetadata = {
  id: "douban.exact",
  title: "豆瓣片单精准版",
  modules: [{
    title: "豆瓣片单（精准版）",
    requiresWebView: false,
    functionName: "loadDoubanExactList",
    cacheDuration: 21600,
    params: [
      { name: "url", title: "片单地址", type: "input", description: "支持豆瓣 subject_collection 地址和 App 分享链接" },
      { name: "page", title: "页码", type: "page" }
    ]
  }],
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "直接使用豆瓣 Subject ID，避免同名电影被 TMDB 模糊匹配错片",
  author: "Chogori0424"
};

function getCollectionId(input) {
  let value = String(input || "").trim();
  try { value = decodeURIComponent(value); } catch (_) {}
  const match = value.match(/subject_collection\/([A-Za-z0-9_-]+)/i);
  if (!match) throw new Error("无法识别豆瓣 subject_collection 地址");
  return match[1];
}

async function loadDoubanExactList(params = {}) {
  const listId = getCollectionId(params.url);
  const page = Math.max(1, Number(params.page) || 1);
  const count = 20;
  const start = (page - 1) * count;
  const api = `https://m.douban.com/rexxar/api/v2/subject_collection/${listId}/items?start=${start}&count=${count}&updated_at&items_only=1&type_tag&for_mobile=1`;

  const response = await Widget.http.get(api, {
    headers: { Referer: `https://m.douban.com/subject_collection/${listId}/` }
  });
  const source = response?.data?.subject_collection_items || [];
  const seen = new Set();
  return source
    .map(item => item?.id)
    .filter(id => id != null)
    .map(id => String(id))
    .filter(id => !seen.has(id) && seen.add(id))
    .map(id => ({ id, type: "douban" }));
}
