import { useEffect, useState } from "react"
import { Button } from "antd"
import { useRecoilState } from "recoil"
import { followOA, unfollowOA, getUserID} from "zmp-sdk/apis"
import { memberZaloState, customerState } from "../recoil/member"
import { resizeLink, setDataToStorage, getDataToStorage, removeStorageData, isEmpty } from "../utils/tools"
import { postApi } from "../utils/request"
import settings from "../../app-settings.json"

const FollowOA = () => {
  const ZALO_OA_ID = settings ?.zalo_oa_id
  const ZALO_OA_NAME = settings ?.zalo_oa_name
  const ZALO_OA_LOGO = settings ?.zalo_oa_logo || "https://content.pancake.vn/1.1/s450x450/fwebp/87/12/e9/86/59eb6fdc125b4840df72b830615bafd86e3bfcc3bbf6a92beef2efca.png"
  const [userId, setUserId] = useState(null)
  const [memberZalo ,setMemberZalo] = useRecoilState(memberZaloState)
  const [customer, setCustomer] = useRecoilState(customerState)

  const getUserIdZalo = async (followedOA) => {
    try {
      const user_id = await getUserID()
      setDataToStorage('guest', {id: user_id, followedOA: followedOA})
    } catch (error) {
      console.log(error, "Error get user id zalo")
    }
  }

  const updateCustomer = async (followedOA) => {
    try {
      let url = "/login"
      let data = {...customer, zalo_followedOA: followedOA}
      const res = await postApi(url, data)
      if (res.status == 200) {
        setCustomer(res.data.customer)
        setDataToStorage('customerStore', res.data.customer)
        removeStorageData('guest')
      }
    } catch(error) {
      console.log(error, "Error login storecake")
    }
  }

  const unfollow = async () => {
    try {
      const res = await unfollowOA({
        id: ZALO_OA_ID
      });
      setMemberZalo({...memberZalo, followedOA: false})
      if (customer ?.id) {
        updateCustomer(false)
      } else {
        getUserIdZalo(false)
      }
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };

  const follow = async () => {
    try {
      const res = await followOA({
        id: ZALO_OA_ID
      });
      setMemberZalo({...memberZalo, followedOA: true})
      if (customer ?.id) {
        updateCustomer(true)
      } else {
        getUserIdZalo(true)
      }
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  }

  useEffect(() => {
    const guest = getDataToStorage('guest')
    if (!memberZalo?.id && !isEmpty(guest)) {
      setMemberZalo({...memberZalo, ...guest})
    }
  }, [])

  return (
    <div className="p-2 bg-[#fff]">
      <div className="p-2 border border-solid border-[#000] rounded-lg bg-[#f2f2f2]">
        <div className="border-b border-b-solid border-[#fff] pb-2">Quan tâm OA để nhận các đặc quyền ưu đãi </div>
        <div className="flex justify-between items-center pt-2">
          <div className="flex items-center">
            <img className="w-[30px] h-[30px] rounded-full bg-[#fff]" src={ resizeLink(ZALO_OA_LOGO) } />
            <div className="font-bold pl-2"> { ZALO_OA_NAME } </div>
          </div>
          {
            memberZalo ?.followedOA ?
            <Button onClick={() => unfollow()} color="default" variant="solid" className="font-bold text-[12px] rounded-full">Bỏ quan tâm</Button>
            :
            <Button onClick={() => follow()} color="default" variant="solid" className="font-bold text-[12px] rounded-full">Quan tâm</Button>
          }
        </div>
      </div>
    </div>
  )
}

export default FollowOA