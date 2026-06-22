const followingInput = document.querySelector("#followingInput");
const followersInput = document.querySelector("#followersInput");
const compareButton = document.querySelector("#compareButton");
const searchInput = document.querySelector("#searchInput");
const sortButton = document.querySelector("#sortButton");
const copyButton = document.querySelector("#copyButton");
const csvButton = document.querySelector("#csvButton");

const state = {
  followingFile: null,
  followersFile: null,
  followingUsers: [],
  followerUsers: [],
  notFollowingBack: [],
  sortDirection: "desc",
  searchTerm: "",
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
  document.querySelector("#sortLabel").textContent = state.sortDirection === "desc" ? "新到旧" : "旧到新";
  renderTable();
});
copyButton.addEventListener("click", copyUsernames);
csvButton.addEventListener("click", downloadCsv);

function handleFileSelect(type) {
  const input = type === "following" ? followingInput : followersInput;
  const file = input.files[0];
  const panel = document.querySelector(type === "following" ? "#followingPanel" : "#followersPanel");
  const nameEl = document.querySelector(type === "following" ? "#followingFileName" : "#followersFileName");
  const errorEl = document.querySelector(type === "following" ? "#followingError" : "#followersError");

  errorEl.textContent = "";

  if (!file) {
    panel.classList.remove("has-file");
    nameEl.textContent = "尚未选择文件";
    state[`${type}File`] = null;
    return;
  }

  if (!file.name.toLowerCase().endsWith(".json")) {
    input.value = "";
    panel.classList.remove("has-file");
    nameEl.textContent = "尚未选择文件";
    errorEl.textContent = "请上传 .json 文件。";
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
    showStatus("请先上传 following.json 和 followers_1.json。", true);
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
      throw new Error("following.json 中没有找到关注列表。请确认文件是否包含 relationships_following。");
    }

    if (state.followerUsers.length === 0) {
      throw new Error("followers_1.json 中没有找到粉丝列表。请确认文件是否为 Instagram 导出的 followers_1.json。");
    }

    const followerSet = new Set(state.followerUsers.map((user) => normalizeUsername(user.username)));
    const uniqueFollowing = uniqueUsersByUsername(state.followingUsers);

    state.notFollowingBack = uniqueFollowing.filter((user) => !followerSet.has(normalizeUsername(user.username)));
    state.searchTerm = "";
    searchInput.value = "";

    renderStats();
    renderTable();
    document.querySelector("#resultsSection").hidden = false;
    showStatus("筛选完成，结果只在当前浏览器中生成。", false);
  } catch (error) {
    document.querySelector("#resultsSection").hidden = true;
    showStatus(error.message || "解析文件失败，请检查 JSON 文件格式。", true);
  }
}

function readJsonFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        resolve(JSON.parse(reader.result));
      } catch {
        reject(new Error(`${file.name} 不是有效的 JSON 文件。`));
      }
    };

    reader.onerror = () => reject(new Error(`无法读取 ${file.name}。`));
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
    return "无时间信息";
  }

  return new Intl.DateTimeFormat("zh-CN", {
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
    showStatus("当前没有可复制的用户名。", true);
    return;
  }

  try {
    await navigator.clipboard.writeText(usernames);
    showStatus("已复制当前列表中的所有用户名。", false);
  } catch {
    fallbackCopy(usernames);
    showStatus("已复制当前列表中的所有用户名。", false);
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
    showStatus("当前没有可下载的结果。", true);
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
  showStatus("CSV 已开始下载。", false);
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
