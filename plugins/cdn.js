
export default (ctx, inject) => {

  /**
   * @property { Vue } $CDN
   */
  inject("CDN", (url) => {

    return (/^(http|https)/.test(url) ? url : process.env.CDN_DOMAIN + url)

  })

}
