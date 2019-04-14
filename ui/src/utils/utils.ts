export const isIE = () => {
  const agent = window.navigator.userAgent
  return agent.match(/(MSIE|Trident)/) && !agent.match(/Edge/)
}
