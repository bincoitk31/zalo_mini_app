import { nativeStorage } from "zmp-sdk/apis"

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

const HOST_CDN = 'https://content.pancake.vn'
const BUCKET = 'web-media'
const BUCKET_MAPPING = {
  'web-media': '1',
  'web_content': '1.1',
  'user-content.pancake.vn': '2',
  'user-content-23.pancake.vn': '2-23'
}

export const resizeLink = (link, w = 160, h = 160) => {
  const { cdn, webp } = resizeLinkKeepSize(link, w, h)
  return cdn || webp
}

export const getUrlFromBackground = background => {
  if(typeof background != 'string') return

  const match = background.match(/url\((.+)\)/)
  return match?.[1]
}

export const parseInfoLink = (link, width = 160, height = 160) => {
  if(typeof link != 'string') return {}

  let info = {}

  link.split('-').filter(e => /^[w|h|l|t]\:/.test(e)).map(e => {
    let [key, value] = e.split(':')

    // if(['w', 'h'].includes(key)) value = value < 400 ? parseInt(value) + 400 : parseInt(value) * 2
    if(key == 'w') value = width < 400 ? parseInt(width) + 400 : parseInt(width) * 2
    if(key == 'h') value = height < 400 ? parseInt(height) + 400 : parseInt(height) * 2
    if(key == 'l') value = Math.round(parseInt(value) / 1e3)
    if(key == 't') value = value.split('.')[0]

    info[key] = value
  })

  return info
}

export const resizeLinkKeepSize = (link, w, h)  => {
  if(typeof link != 'string') return {}

  const info = parseInfoLink(link, w, h)
  // If image size < 300kb or image type is webp animated then uncompress
  if(info['l'] < 300 || link.includes('-ANIM')) return { webp: convertStaticToCDN(link) }

  if (isEmpty(info)) return resizeOldLink(link)

  let splitted
  let bucket = BUCKET

  if (link.includes('web-media')) bucket = 'web-media'
  if (link.includes('web_content')) bucket = 'web_content'
  if (link.includes('user-content.pancake.vn')) bucket = 'user-content.pancake.vn'
  if (link.includes('user-content-23.pancake.vn')) bucket = 'user-content-23.pancake.vn'

  splitted = link.split(bucket)

  if(splitted.length === 2) {
    const isGif = info['t'] == 'image/gif'
    if(isGif) {
      const cdn = `${HOST_CDN}/${BUCKET_MAPPING[bucket]}/dlc${splitted[1]}`
      return { cdn }
    }

    const [ext] = splitted[1].split('.').reverse().map(e => (e || '').toLowerCase())

    const cdn = `${HOST_CDN}/${BUCKET_MAPPING[bucket]}${splitted[1]}`
    const webp = `${HOST_CDN}/${BUCKET_MAPPING[bucket]}/fwebp0${splitted[1]}`

    if(info['t'] == 'image/png' || info['t'] == 'image/svg+xml' || ['png'].includes(ext)) {
      return { webp }
    }

    return { cdn }
  }

  return { cdn: convertStaticToCDN(link) }
}

export const convertStaticToCDN = url => {
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

export const resizeOldLink = (link = '', width = 300, height = 300, keep_resolution = false) => {
  if (!link || typeof link !== 'string') return {}
  if (width == 0 || !isFinite(width)) width = 300
  if (height == 0 || !isFinite(height)) height = 300

  width = Math.ceil(width / 50) * 50
  height = Math.ceil(height / 50) * 50

  const resize = width < 400 || height < 400 ? 400 : 0

  const w = resize ? width + resize : width * 2
  const h = resize ? height + resize : height * 2

  const resizeFlag = keep_resolution ? 'fwebp0' : 'fwebp'

  const H = Math.ceil(Math.max(h, w / width * height))
  const W = Math.ceil(Math.max(w, h / height * width))

  let splitted
  let bucket = BUCKET

  if (link.includes('web-media')) bucket = 'web-media'
  if (link.includes('web_content')) bucket = 'web_content'
  if (link.includes('user-content.pancake.vn')) bucket = 'user-content.pancake.vn'
  if (link.includes('user-content-23.pancake.vn')) bucket = 'user-content-23.pancake.vn'

  splitted = link.split(bucket)

  if (splitted.length === 2) {
    const isGif = /\.gif$/.test(link)
    if (isGif) {
      const cdn = `${HOST_CDN}/${BUCKET_MAPPING[bucket]}/dlc${splitted[1]}`
      return { cdn }
    }

    const [ext] = splitted[1].split('.').reverse().map(e => (e || '').toLowerCase())

    if (['png', 'jpg', 'jpeg', 'webp', 'jfif'].includes(ext)) {
      const cdn = `${HOST_CDN}/${BUCKET_MAPPING[bucket]}/s${W}x${H}${splitted[1]}`
      const webp = `${HOST_CDN}/${BUCKET_MAPPING[bucket]}/s${W}x${H}/${resizeFlag}${splitted[1]}`

      return { cdn, webp }
    }
  }

  if (splitted.length === 1 && link.includes('https://content.pancake.vn')) {
    const webp = link.replace(/(https:\/\/content.pancake.vn\/2(-[0-9]{2})?\/)(.+)/, (x, x1, _, x3) => {
      return `${x1}s${w}x${h}/${resizeFlag}/${x3}`
    })

    return { webp }
  }

  return { cdn: link }
}

export const isEmpty = (val) => {
  if (val == null) return true; // null or undefined
  if (typeof val === 'string' && val.trim() === '') return true;
  if (Array.isArray(val) && val.length === 0) return true;
  if (typeof val === 'object' && Object.keys(val).length === 0) return true;
  return false;
};