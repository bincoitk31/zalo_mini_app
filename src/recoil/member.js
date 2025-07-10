import { atom } from "recoil"
import { getApi } from "../utils/request"
import settings from "../../app-settings.json"

export const customerState = atom({
  key: "customer",
  default: {
    avatar: settings?.avatar_customer_default || "https://content.pancake.vn/1.1/s450x450/fwebp/87/12/e9/86/59eb6fdc125b4840df72b830615bafd86e3bfcc3bbf6a92beef2efca.png",
    name: "Quý khách",
    zalo_followedOA: false,
    zalo_id_by_oa: "",
    zalo_user_id: "",
    id: "",
    is_guest: true
  }
})

export const openPointsHistoryState = atom({
  key: "openPointsHistory",
  default: false
})

export const customerLevelsPosState = atom({
  key: "customerLevelsPos",
  default: []
})

export const memberStore = (type, payload = {}) => {
  const getMemberShip = async () => {
    return await getApi("/membership", {params: payload})
  }

  const getPointsHistory = async () => {
    return await getApi("/membership/point_logs", {params: payload})
  }

  const getCustomerLevelsPos = async () => {
    return await getApi("/membership/customer_levels_pos", {params: payload})
  }

  const obj = {
    getMemberShip,
    getPointsHistory,
    getCustomerLevelsPos
  }

  return obj[type](payload)
}