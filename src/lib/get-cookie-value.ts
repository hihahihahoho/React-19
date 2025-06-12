export const getCookieValue = () => {
  const cookies = document.cookie.split(";")
  const sidebarCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("sidebar_state=")
  )
  return sidebarCookie ? sidebarCookie.split("=")[1] === "true" : true
}
