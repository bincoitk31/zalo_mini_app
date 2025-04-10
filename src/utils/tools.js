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

export const resizeLink = (link) => {
  const { cdn, webp } = resizeLinkKeepSize(link)
  return cdn || webp
}

export const getUrlFromBackground = background => {
  if(typeof background != 'string') return

  const match = background.match(/url\((.+)\)/)
  return match?.[1]
}

export const parseInfoLink = link => {
  if(typeof link != 'string') return {}

  let info = {}

  link.split('-').filter(e => /^[w|h|l|t]\:/.test(e)).map(e => {
    let [key, value] = e.split(':')

    console.log("key, value::",key, value)

    if(['w', 'h'].includes(key)) value = value < 400 ? parseInt(value) + 400 : parseInt(value) * 2
    if(key == 'l') value = Math.round(parseInt(value) / 1e3)
    if(key == 't') value = value.split('.')[0]

    info[key] = value
  })

  return info
}

export const resizeLinkKeepSize = (link)  => {
  if(typeof link != 'string') return {}

  const info = parseInfoLink(link)

  // If image size < 300kb or image type is webp animated then uncompress
  if(info['l'] < 300 || link.includes('-ANIM')) return { webp: convertStaticToCDN(link) }

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