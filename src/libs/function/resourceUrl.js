/*
 * @Author: qinuoyun
 * @Date:   2021-04-17 14:28:55
 * @Last Modified by:   qinuoyun
 * @Last Modified time: 2021-06-16 16:06:42
 */
function resourceUrl(action, siteInfo, type = false) {
  var url = siteInfo.siteroot + '?r=wechat&';
  if (type) {
    return url;
  } else {
    return url + 'q=';
  }
}

export default resourceUrl;
