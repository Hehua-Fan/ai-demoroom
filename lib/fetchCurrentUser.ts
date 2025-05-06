export async function fetchCurrentUser(): Promise<{ userId: string } | null> {
  try {
    const res = await fetch("http://115.190.45.181/tutor/api/admin/account/info", {
      credentials: "include", // 🔥 关键，带上 cookie
    });

    if (!res.ok) throw new Error("接口请求失败");

    const data = await res.json();
    // 👇 请根据实际字段替换 userId 字段名
    return { userId: data.userId || data.id || data.username };
  } catch (error) {
    console.error("无法获取用户信息:", error);
    return null;
  }
}