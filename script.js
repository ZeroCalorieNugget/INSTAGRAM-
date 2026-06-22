const followingInput = document.querySelector("#followingInput");
const followersInput = document.querySelector("#followersInput");
const compareButton = document.querySelector("#compareButton");
const searchInput = document.querySelector("#searchInput");
const sortButton = document.querySelector("#sortButton");
const copyButton = document.querySelector("#copyButton");
const csvButton = document.querySelector("#csvButton");
const languageButtons = document.querySelectorAll(".language-button");

const translations = {
  zh: {
    pageTitle: "Instagram 未回关筛选工具",
    eyebrow: "本地处理 · 不上传文件",
    title: "Instagram 未回关筛选工具",
    intro: "上传 Instagram 导出的 following.json 和 followers_1.json，快速找出你关注了、但对方没有关注你的用户。",
    privacy: "所有 JSON 都只在你的浏览器里读取和对比，不会上传到任何服务器。",
    stepOne: "步骤 1",
    stepTwo: "步骤 2",
    followingHelp: "我正在关注的人，通常包含 relationships_following。",
    followersHelp: "正在关注我的人，通常是包含 string_list_data 的数组。",
    followingChoose: "选择 following.json",
    followersChoose: "选择 followers_1.json",
    noFile: "尚未选择文件",
    compare: "筛选未回关用户",
    resultsEyebrow: "结果",
    resultsTitle: "未回关名单",
    followingCount: "我关注的人",
    followersCount: "关注我的人",
    notFollowingBackCount: "没有回关我",
    searchLabel: "搜索用户名",
    searchPlaceholder: "输入 username",
    copy: "复制用户名",
    downloadCsv: "下载 CSV",
    username: "用户名",
    instagramLink: "Instagram 链接",
    followedAt: "关注时间",
    sortDesc: "新到旧",
    sortAsc: "旧到新",
    empty: "没有找到匹配的未回关用户。",
    invalidJsonFile: "请上传 .json 文件。",
    missingFiles: "请先上传 following.json 和 followers_1.json。",
    missingFollowing: "following.json 中没有找到关注列表。请确认文件是否包含 relationships_following。",
    missingFollowers: "followers_1.json 中没有找到粉丝列表。请确认文件是否为 Instagram 导出的 followers_1.json。",
    invalidJson: "{fileName} 不是有效的 JSON 文件。",
    cannotRead: "无法读取 {fileName}。",
    parseFailed: "解析文件失败，请检查 JSON 文件格式。",
    complete: "筛选完成，结果只在当前浏览器中生成。",
    noCopy: "当前没有可复制的用户名。",
    copied: "已复制当前列表中的所有用户名。",
    noDownload: "当前没有可下载的结果。",
    csvStarted: "CSV 已开始下载。",
    noDate: "无时间信息",
    guideEyebrow: "教程",
    guideTitle: "如何下载这两个 JSON 文件",
    guideStep1Title: "打开 Instagram 设置",
    guideStep1Text: "进入个人主页，点击右上角菜单，打开 Settings and Activity（设置和动态）。",
    guideStep2Title: "搜索下载入口",
    guideStep2Text: "在顶部搜索框输入 Download your information（下载你的信息），进入 Meta Accounts Center。",
    guideStep3Title: "选择对应账户",
    guideStep3Text: "选择 Download or transfer information，然后勾选你要导出数据的 Instagram 账户。",
    guideStep4Title: "只导出关注数据",
    guideStep4Text: "选择 Some of your information，在列表里找到 Followers and following（粉丝和关注），然后继续。",
    guideStep5Title: "选择 JSON 格式",
    guideStep5Text: "选择 Download to device，日期范围建议 All time，格式选择 JSON，然后创建文件。",
    guideStep6Title: "解压并上传",
    guideStep6Text: "收到 Instagram 通知后下载压缩包，解压后找到 connections/followers_and_following 里的 following.json 和 followers_1.json。",
    guideLink: "打开 Download your information",
  },
  en: {
    pageTitle: "Instagram Follow Back Checker",
    eyebrow: "Local only · no uploads",
    title: "Instagram Follow Back Checker",
    intro: "Upload your Instagram following.json and followers_1.json files to find people you follow who do not follow you back.",
    privacy: "Your JSON files are read and compared only inside your browser. Nothing is uploaded to a server.",
    stepOne: "Step 1",
    stepTwo: "Step 2",
    followingHelp: "People you follow, usually stored under relationships_following.",
    followersHelp: "People following you, usually an array with string_list_data.",
    followingChoose: "Choose following.json",
    followersChoose: "Choose followers_1.json",
    noFile: "No file selected",
    compare: "Find non-followers",
    resultsEyebrow: "Results",
    resultsTitle: "Not following back",
    followingCount: "Following",
    followersCount: "Followers",
    notFollowingBackCount: "Not following back",
    searchLabel: "Search username",
    searchPlaceholder: "Type a username",
    copy: "Copy usernames",
    downloadCsv: "Download CSV",
    username: "Username",
    instagramLink: "Instagram link",
    followedAt: "Followed at",
    sortDesc: "Newest first",
    sortAsc: "Oldest first",
    empty: "No matching users found.",
    invalidJsonFile: "Please upload a .json file.",
    missingFiles: "Please upload both following.json and followers_1.json first.",
    missingFollowing: "No following list found in following.json. Please check that it contains relationships_following.",
    missingFollowers: "No follower list found in followers_1.json. Please check that it is the Instagram export file.",
    invalidJson: "{fileName} is not a valid JSON file.",
    cannotRead: "Could not read {fileName}.",
    parseFailed: "Could not parse the files. Please check the JSON format.",
    complete: "Done. The result was generated only in this browser.",
    noCopy: "There are no usernames to copy.",
    copied: "Copied all usernames in the current list.",
    noDownload: "There are no results to download.",
    csvStarted: "CSV download started.",
    noDate: "No date available",
    guideEyebrow: "Guide",
    guideTitle: "How to download these two JSON files",
    guideStep1Title: "Open Instagram settings",
    guideStep1Text: "Go to your profile, tap the menu in the top right, then open Settings and Activity.",
    guideStep2Title: "Search for the download page",
    guideStep2Text: "Use the search bar at the top and search Download your information to open Meta Accounts Center.",
    guideStep3Title: "Choose the right account",
    guideStep3Text: "Select Download or transfer information, then choose the Instagram account you want to export.",
    guideStep4Title: "Export only follower data",
    guideStep4Text: "Choose Some of your information, find Followers and following, then continue.",
    guideStep5Title: "Choose JSON format",
    guideStep5Text: "Select Download to device, use All time for the date range, choose JSON format, then create the file.",
    guideStep6Title: "Unzip and upload",
    guideStep6Text: "After Instagram notifies you, download and unzip the archive. Find following.json and followers_1.json inside connections/followers_and_following.",
    guideLink: "Open Download your information",
  },
};

const state = {
  followingFile: null,
  followersFile: null,
  followingUsers: [],
  followerUsers: [],
  notFollowingBack: [],
  sortDirection: "desc",
  searchTerm: "",
  lang: localStorage.getItem("preferredLanguage") || "zh",
};

followingInput.addEventListener("change", () => handleFileSelect("following"));
followersInput.addEventListener("change", () => handleFileSelect("followers"));
compareButton.addEventListener("click", compareLists);
searchInput.addEventListener("input", () => {
  state.searchTerm = searchInput.value.trim().toLowerCase();
  renderTable();
});
sortButton.addEventListener("click", () => {
  state.sortDirection = state.sortDirection === "desc" ? "asc" : "desc";
  updateSortLabel();
  renderTable();
});
copyButton.addEventListener("click", copyUsernames);
csvButton.addEventListener("click", downloadCsv);
languageButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});

setLanguage(state.lang);

function t(key, values = {}) {
  const text = translations[state.lang][key] || translations.zh[key] || key;
  return Object.entries(values).reduce((result, [name, value]) => result.replace(`{${name}}`, value), text);
}

function setLanguage(lang) {
  state.lang = translations[lang] ? lang : "zh";
  localStorage.setItem("preferredLanguage", state.lang);
  document.documentElement.lang = state.lang === "zh" ? "zh-CN" : "en";
  document.title = t("pageTitle");

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });
  languageButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.lang === state.lang);
  });

  refreshFileLabels();
  updateSortLabel();
  renderTable();
}

function handleFileSelect(type) {
  const input = type === "following" ? followingInput : followersInput;
  const file = input.files[0];
  const panel = document.querySelector(type === "following" ? "#followingPanel" : "#followersPanel");
  const nameEl = document.querySelector(type === "following" ? "#followingFileName" : "#followersFileName");
  const errorEl = document.querySelector(type === "following" ? "#followingError" : "#followersError");

  errorEl.textContent = "";

  if (!file) {
    panel.classList.remove("has-file");
    nameEl.textContent = t("noFile");
    state[`${type}File`] = null;
    return;
  }

  if (!file.name.toLowerCase().endsWith(".json")) {
    input.value = "";
    panel.classList.remove("has-file");
    nameEl.textContent = t("noFile");
    errorEl.textContent = t("invalidJsonFile");
    state[`${type}File`] = null;
    return;
  }

  panel.classList.add("has-file");
  nameEl.textContent = file.name;
  state[`${type}File`] = file;
}

async function compareLists() {
  clearStatus();

  if (!state.followingFile || !state.followersFile) {
    showStatus(t("missingFiles"), true);
    return;
  }

  try {
    const [followingJson, followersJson] = await Promise.all([
      readJsonFile(state.followingFile),
      readJsonFile(state.followersFile),
    ]);

    state.followingUsers = parseFollowing(followingJson);
    state.followerUsers = parseFollowers(followersJson);

    if (state.followingUsers.length === 0) {
      throw new Error(t("missingFollowing"));
    }

    if (state.followerUsers.length === 0) {
      throw new Error(t("missingFollowers"));
    }

    const followerSet = new Set(state.followerUsers.map((user) => normalizeUsername(user.username)));
    const uniqueFollowing = uniqueUsersByUsername(state.followingUsers);

    state.notFollowingBack = uniqueFollowing.filter((user) => !followerSet.has(normalizeUsername(user.username)));
    state.searchTerm = "";
    searchInput.value = "";

    renderStats();
    renderTable();
    document.querySelector("#resultsSection").hidden = false;
    showStatus(t("complete"), false);
  } catch (error) {
    document.querySelector("#resultsSection").hidden = true;
    showStatus(error.message || t("parseFailed"), true);
  }
}

function readJsonFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        resolve(JSON.parse(reader.result));
      } catch {
        reject(new Error(t("invalidJson", { fileName: file.name })));
      }
    };

    reader.onerror = () => reject(new Error(t("cannotRead", { fileName: file.name })));
    reader.readAsText(file);
  });
}

function parseFollowing(json) {
  const records = Array.isArray(json) ? json : json.relationships_following;

  if (!Array.isArray(records)) {
    return [];
  }

  return records
    .map((record) => {
      const stringData = Array.isArray(record.string_list_data) ? record.string_list_data[0] : null;
      const username = cleanUsername(record.title || stringData?.value);
      const timestamp = toTimestamp(record.timestamp ?? stringData?.timestamp);

      return username ? buildUser(username, timestamp) : null;
    })
    .filter(Boolean);
}

function parseFollowers(json) {
  const records = Array.isArray(json) ? json : json.relationships_followers;

  if (!Array.isArray(records)) {
    return [];
  }

  return records
    .map((record) => {
      const stringData = Array.isArray(record.string_list_data) ? record.string_list_data[0] : null;
      const username = cleanUsername(record.title || stringData?.value);
      const timestamp = toTimestamp(record.timestamp ?? stringData?.timestamp);

      return username ? buildUser(username, timestamp) : null;
    })
    .filter(Boolean);
}

function buildUser(username, timestamp) {
  return {
    username,
    normalizedUsername: normalizeUsername(username),
    url: `https://www.instagram.com/${encodeURIComponent(username)}`,
    timestamp,
    followedAt: timestamp ? new Date(timestamp * 1000) : null,
  };
}

function cleanUsername(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().replace(/^@/, "");
}

function normalizeUsername(username) {
  return username.trim().replace(/^@/, "").toLowerCase();
}

function toTimestamp(value) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : null;
}

function uniqueUsersByUsername(users) {
  const seen = new Set();

  return users.filter((user) => {
    if (seen.has(user.normalizedUsername)) {
      return false;
    }

    seen.add(user.normalizedUsername);
    return true;
  });
}

function renderStats() {
  document.querySelector("#followingCount").textContent = uniqueUsersByUsername(state.followingUsers).length;
  document.querySelector("#followersCount").textContent = uniqueUsersByUsername(state.followerUsers).length;
  document.querySelector("#notFollowingBackCount").textContent = state.notFollowingBack.length;
}

function renderTable() {
  const tbody = document.querySelector("#resultBody");
  const emptyState = document.querySelector("#emptyState");
  const rows = getVisibleRows();

  tbody.innerHTML = "";
  emptyState.hidden = rows.length > 0;

  rows.forEach((user) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${escapeHtml(user.username)}</td>
      <td><a href="${user.url}" target="_blank" rel="noopener noreferrer">${user.url}</a></td>
      <td>${formatDate(user.followedAt)}</td>
    `;

    tbody.appendChild(tr);
  });
}

function getVisibleRows() {
  return state.notFollowingBack
    .filter((user) => user.normalizedUsername.includes(state.searchTerm))
    .slice()
    .sort((a, b) => {
      const aTime = a.timestamp ?? 0;
      const bTime = b.timestamp ?? 0;
      return state.sortDirection === "desc" ? bTime - aTime : aTime - bTime;
    });
}

function formatDate(date) {
  if (!date) {
    return t("noDate");
  }

  return new Intl.DateTimeFormat(state.lang === "zh" ? "zh-CN" : "en", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

async function copyUsernames() {
  const usernames = getVisibleRows().map((user) => user.username).join("\n");

  if (!usernames) {
    showStatus(t("noCopy"), true);
    return;
  }

  try {
    await navigator.clipboard.writeText(usernames);
    showStatus(t("copied"), false);
  } catch {
    fallbackCopy(usernames);
    showStatus(t("copied"), false);
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function downloadCsv() {
  const rows = getVisibleRows();

  if (rows.length === 0) {
    showStatus(t("noDownload"), true);
    return;
  }

  const header = ["username", "instagram_url", "followed_at"];
  const csvRows = rows.map((user) => [
    user.username,
    user.url,
    user.followedAt ? user.followedAt.toISOString() : "",
  ]);
  const csv = [header, ...csvRows].map((row) => row.map(csvEscape).join(",")).join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "instagram_not_following_back.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showStatus(t("csvStarted"), false);
}

function refreshFileLabels() {
  document.querySelector("#followingFileName").textContent = state.followingFile ? state.followingFile.name : t("noFile");
  document.querySelector("#followersFileName").textContent = state.followersFile ? state.followersFile.name : t("noFile");
}

function updateSortLabel() {
  document.querySelector("#sortLabel").textContent = state.sortDirection === "desc" ? t("sortDesc") : t("sortAsc");
}

function csvEscape(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showStatus(message, isError) {
  const status = document.querySelector("#statusMessage");
  status.textContent = message;
  status.style.color = isError ? "var(--danger)" : "var(--brand)";
}

function clearStatus() {
  showStatus("", false);
  document.querySelector("#followingError").textContent = "";
  document.querySelector("#followersError").textContent = "";
}
