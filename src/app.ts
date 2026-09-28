// 运行时配置。这个站点没有布局、没有登录态，唯一的全局副作用是禁用浏览器
// 的滚动位置恢复——刷新时必须从第 0 章重新开场。
export function onRouteChange() {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }
}
