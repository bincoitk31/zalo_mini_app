import { nativeStorage } from "zmp-sdk/apis"
import settings from "../../app-settings.json"
const LESSER_COMPRESSION = settings ?.lesser_compression || false

export const validatePhoneNumber = (value) => {
  const cleanPhoneNumber = value.replace(/\s+/g, "").trim();
  const vietnamPhoneRegex = /^(?:\+84|0)(3[2-9]|5[2-9]|7[0-9]|8[1-9]|9[0-9])\d{7}$/;
  return vietnamPhoneRegex.test(cleanPhoneNumber);
};

export const isValidEmail= (email) =>  {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export const setDataToStorage = (key, value) => {
  try {
    let valueJson = JSON.stringify(value)
    nativeStorage.setItem(key, valueJson);
  } catch (error) {
    // xử lý khi gọi api thất bại
    console.log(error);
  }
};

export const getDataToStorage = (key) => {
  try {
    const value = nativeStorage.getItem(key);
    return JSON.parse(value)
  } catch (error) {
    // xử lý khi gọi api thất bại
    console.log(error);
  }
};

export const removeStorageData = (key) => {
  try {
    nativeStorage.removeItem(key);
  } catch (error) {
    // xử lý khi gọi api thất bại
    console.log(error);
  }
};

export const isEmpty = (val) => {
  if (val == null) return true; // null or undefined
  if (typeof val === 'string' && val.trim() === '') return true;
  if (Array.isArray(val) && val.length === 0) return true;
  if (typeof val === 'object' && Object.keys(val).length === 0) return true;
  return false;
};

const HOST_CDN = 'https://content.pancake.vn'
const BUCKET = 'web-media'
const BUCKET_MAPPING = {
  'web-media': '1',
  'web_content': '1.1',
  'user-content.pancake.vn': '2',
  'user-content-23.pancake.vn': '2-23'
}

const convertStaticToCDN = url => {
  if (url && typeof url == 'string') {
    let cdn = url.replace('statics.pancake.vn', 'content.pancake.vn')
      .replace('cdn.pancake.vn', 'content.pancake.vn')
      .replace('web-media', '1')
      .replace('web_content', '1.1')
      .replace('user-content.pancake.vn', '2')
      .replace('user-content-23.pancake.vn', '2-23')

    return cdn
  } else {
    return url
  }
}

const parseInfoLink = (link) => {
  if(typeof link != 'string') return {}

  let info = {}

  link.split('-').filter(e => /^[w|h|l|t]\:/.test(e)).map(e => {
    let [key, value] = e.split(':')

    if(['w', 'h'].includes(key)) value = parseInt(value)
    if(key == 'l') value = Math.round(parseInt(value) / 1e3)

    if(key == 'w') key = 'width'
    if(key == 'h') key = 'height'
    if(key == 't') value = value.split('.')[0]

    info[key] = value
  })

  return info
}

export const resizeLink = (link = '', width = 300, height = 300) => {
  let keep_solution = LESSER_COMPRESSION
  if (!link || typeof link !== 'string') return ''

  width = ~~width || 300
  height = ~~height || 300

  let splitted
  let bucket = BUCKET

  if (link.includes('web-media')) bucket = 'web-media'
  else if (link.includes('web_content')) bucket = 'web_content'
  else if (link.includes('user-content.pancake.vn')) bucket = 'user-content.pancake.vn'
  else if (link.includes('user-content-23.pancake.vn')) bucket = 'user-content-23.pancake.vn'
  splitted = link.split(bucket)

  let solution = keep_solution ? 'fwebp0' : 'fwebp'
  const resize = width < 400 || height < 400 ? 400 : 0

  let w = resize ? width + resize : width * 2
  let h = resize ? height + resize : height * 2

  const res = updateContent(link, w, h)

  if(res[0] == 'max' && res[1] != 'max') {
    w = Math.round(h * width / height)
  } else if(res[0] != 'max' && res[1] == 'max') {
    h = Math.round(w * height / width)
  } else if(res[0] && res[1]) {
    w = res[0] || w
    h = res[1] || h
  } else {
    const [a, b] =
      w > Math.round(h * width / height)
        ? [w, Math.round(w * height / width)]
        : [Math.round(h * width / height), h]

    w = a
    h = b
  }

  if(res[2]) keep_solution = true

  if(link.includes('-ANIM')) return { cdn: convertStaticToCDN(link) }

  if (splitted.length === 2) {
    const isGif = /\.gif$/.test(link)
    if (isGif) {
      const cdn = `${HOST_CDN}/${BUCKET_MAPPING[bucket]}/dlc${splitted[1]}`
      return cdn
    }

    let cdn, webp;
    let [ext] = splitted[1].split('.').reverse().map(e => (e || '').toLowerCase())
    ext.toLowerCase()

    const info = parseInfoLink(link)

    if(['png', 'jpg', 'jpeg', 'webp', 'jfif'].includes(ext)) {
      if(keep_solution) {
        if(w == 'max' && h == 'max') {
          webp = `${HOST_CDN}/${BUCKET_MAPPING[bucket]}/fwebp0${splitted[1]}`
          cdn = `${HOST_CDN}/${BUCKET_MAPPING[bucket]}${splitted[1]}`

          return ext == 'png' || info['t'] == 'image/png'
            ? webp
            : cdn
        }

        const solution = ext == 'png' || info['t'] == 'image/png' ? '/fwebp0' : ext == 'webp' || info['t'] == 'image/webp' ? '/fwebp' : ''

        webp = `${HOST_CDN}/${BUCKET_MAPPING[bucket]}/s${w}x${h}${solution}${splitted[1]}`
        return webp
      }

      if(w == 'max' && h == 'max') {
        webp = `${HOST_CDN}/${BUCKET_MAPPING[bucket]}${splitted[1]}`
        cdn = `${HOST_CDN}/${BUCKET_MAPPING[bucket]}/fwebp${splitted[1]}`

        return ext == 'webp' || info['t'] == 'image/webp'
          ? webp
          : cdn
      }

      webp = `${HOST_CDN}/${BUCKET_MAPPING[bucket]}/s${w}x${h}/fwebp${splitted[1]}`

      return webp
    }

    if(ext === 'svg' || info['t'] == 'image/svg+xml') {
      const solution = keep_solution ? 'fwebp0' : 'fwebp'
      const webp = `${HOST_CDN}/${BUCKET_MAPPING[bucket]}/${solution}${splitted[1]}`

      return webp
    } else {
      return convertStaticToCDN(link)
    }
  }

  // use domain content.pancake.vn
  link = link.replace('cdn.pancake.vn', 'content.pancake.vn')

  if (splitted.length === 1 && link.includes('https://content.pancake.vn')) {
    const [ext] = link.split('.').reverse().map(e => e.toLowerCase())

    const webp = link.replace(/(https:\/\/content.pancake.vn\/2(-[0-9]{2})?\/)(.+)/, (x, x1, _, x3) => {
      return `${x1}s${w}x${h}${['png', 'webp', 'avif'].includes(ext) ? `/${solution}` : ''}/${x3}`
    })

    return webp
  }

  return convertStaticToCDN(link)
}

const updateContent = (url, w, h) => {
  let keep_solution = LESSER_COMPRESSION


  let info = parseInfoLink(url)
  info['maxWidth'] = info['width']
  info['maxHeight'] = info['height']
  info.ratio = info['width'] / info['height']
  info['width'] = info['height'] = 0
  info['widthNormal'] = info['heightNormal'] = 0

  if(keep_solution) {
    if(w > info.width) {
      let wh1 = {width: Math.max(info.width, Math.min(info.maxWidth, w)), height: Math.max(info.height, Math.min(info.maxHeight, Math.ceil(w / info.ratio)))}
      let wh2 = {width: Math.max(info.height, Math.min(info.maxHeight, Math.ceil(h * info.ratio))), height: Math.max(info.height, Math.min(info.maxHeight, h))}

      if (wh1.width > wh2.width && wh1.height > wh2.height) {
        info.width = wh1.width
        info.height = wh1.height
      } else {
        info.width = wh2.width
        info.height = wh2.height
      }
    }

    info.width = Math.min(info.width, info.maxWidth)
    info.height = Math.min(info.height, info.maxHeight)

    return [
      info.width == info.maxWidth ? 'max' : info.width,
      info.height == info.maxHeight ? 'max' : info.height
    ]
  }

  if(w > info.widthNormal) {
    let wh1 = {width: Math.max(info.width, Math.min(info.maxWidth, w)), height: Math.max(info.height, Math.min(info.maxHeight, Math.ceil(w / info.ratio)))}
    let wh2 = {width: Math.max(info.height, Math.min(info.maxHeight, Math.ceil(h * info.ratio))), height: Math.max(info.height, Math.min(info.maxHeight, h))}

    if (wh1.width > wh2.width && wh1.height > wh2.height) {
      info.widthNormal = wh1.width
      info.heightNormal = wh1.height
    } else {
      info.widthNormal = wh2.width
      info.heightNormal = wh2.height
    }
  }

  info.widthNormal = Math.min(info.maxWidth, info.widthNormal)
  info.heightNormal = Math.min(info.maxHeight, info.heightNormal)

  return [
    info.widthNormal == info.maxWidth ? 'max' : info.widthNormal,
    info.heightNormal == info.maxHeight ? 'max' : info.heightNormal,
    info.widthNormal == info.width && info.heightNormal == info.height
  ]
}

export const resizeDescription = (description) => {
  const div = document.createElement('div')
  div.innerHTML = description
  div.querySelectorAll('img').forEach(el => {
    const src = el.src || el.getAttribute('data-src')
    el.setAttribute('src', resizeLink(src, parseInt(el.width) < window.innerWidth ? parseInt(el.width) + 400 : window.innerWidth + 400, parseInt(el.height)))
  })
  return div.innerHTML
}