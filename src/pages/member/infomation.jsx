import { customerState } from "../../recoil/member"
import { useRecoilState } from "recoil"
import { SignIn, CaretRight } from "@phosphor-icons/react"
import { authorize, getPhoneNumber, getAccessToken, getUserInfo } from "zmp-sdk/apis"
import { getApiAxios, postApi } from '../../utils/request'
import { setDataToStorage, getDataToStorage } from '../../utils/tools'
import { useEffect } from "react"

const Infomation = () => {
  const [customer, setCustomer] = useRecoilState(customerState)

  const getUser = async () => {
    try {
      const { userInfo } = await getUserInfo({})
      return userInfo
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error)
    }
  }

  const getTokenUser = async () => {
    try {
      let token = await getAccessToken({});
      return token
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error, "error get tokenn");
      return null
    }
  };

  const getCode = async () => {
    try {
      let res = await getPhoneNumber({})
      return res.token
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const getPhoneNumberFromToken = async () => {
    let token = await getTokenUser()
    let code = await getCode()
    let userInfo = await getUser()
    let secretKey = import.meta.env.VITE_ZALO_SECRET_KEY

    let url = "https://graph.zalo.me/v2.0/me/info"
    let options = {
      code: code,
      access_token: token,
      secret_key: secretKey,
    }

    console.log(options, "optionsss")

    getApiAxios(url, {headers: options})
    .then(res => {
      console.log(res, "get res phonenumber")
      if (res.status == 200) {
        let data = {
          phone_number: formatPhoneNumber(res.data.data.number),
          avatar: userInfo.avatar,
          name: userInfo.name,
          zalo_id_by_oa: userInfo.idByOA,
          zalo_followOA: userInfo.followedOA,
          zalo_user_id: userInfo.id
        }
        loginStorecake(data)

      }
    })
    .catch(err => console.log("get phonenumber error", err))
  }

  const authorizeUser = async () => {
    try {
      const data = await authorize({
        scopes: ["scope.userPhonenumber", "scope.userInfo"],
      });
      localStorage.setItem('isAuth', true)
      if (data['scope.userPhonenumber'] && data['scope.userInfo']) {
        //get sdt khách
        getPhoneNumberFromToken()
      }

    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };

  const loginStorecake = async (data) => {
    try {
      let url = "/login"
      const res = await postApi(url, data)
      if (res.status == 200) {
        setCustomer(res.data.customer)
        setDataToStorage('customerStore', res.data.customer)
      }
    } catch(error) {
      console.log(error, "Error login storecake")
    }
  }

  const formatPhoneNumber = (phone) => {
    phone = phone.replace(/\D/g, "");
    if (phone.startsWith("84")) phone = "0" + phone.slice(2)
    if (phone.length === 9 && phone.startsWith("3")) phone = "0" + phone
    return phone
  }

  useEffect(()=> {
    const customerStore = getDataToStorage('customerStore')
    if (customerStore) setCustomer(customerStore)
  }, [])

  return (
    <>
      <div>
        <div className="font-bold"> Thông tin khách hàng </div>
        {!customer ?.is_guest ?
          <div className="flex pt-2">
            <div>
              <img src={customer.avatar} className="w-[50px] h-[50px] rounded-full"/>
            </div>
            <div className="pl-2">
              <div>{customer.name}</div>
              <div>{customer.phone_number}</div>
            </div>
          </div>
        :
        <div>
          <div onClick={() => authorizeUser()} className="flex justify-between items-center py-2">
            <div className="flex items-center">
              <div><SignIn size={20} color="#141415" /></div>
              <div className="text-[12px] text-center pl-2">Đăng nhập / đăng ký thành viên</div>
            </div>
            <div>
              <CaretRight size={18} color="#141415" />
            </div>
          </div>
        </div>
        }
      </div>
      
    
    
   </>
  )
}

export default Infomation