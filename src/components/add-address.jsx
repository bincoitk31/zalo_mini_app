import React, { useState, useEffect} from "react"
import { Drawer, Button, message, Input, Select, Switch } from 'antd'
import { openAddAddressState, listAddressState, customerInfoState, editAddressState } from "../recoil/order"
import { useRecoilState } from "recoil"
import { ArrowLeft } from "@phosphor-icons/react"
import { decode } from "html-entities"
import { setDataToStorage } from "../utils/tools"
const { TextArea } = Input

const AddAddress = () => {
  const country_id = 84
  const [openAddAddress, setOpenAddAddress] = useRecoilState(openAddAddressState)
  const [listAddress, setListAddress] = useRecoilState(listAddressState)
  const [customerInfo, setCustomerInfo] = useRecoilState(customerInfoState)
  const [editAddress, setEditAddress] = useRecoilState(editAddressState)

  const [fullName, setFullName] = useState()
  const [provinceId, setProvinceId] = useState()
  const [districtId, setDistrictId] = useState()
  const [communeId, setCommuneId] = useState()
  const [phoneNumber, setPhoneNumber] = useState()
  const [email, setEmail] = useState()
  const [detectAddress, setDetectAddress] = useState()
  const [defaultValue, setDefaultValue] = useState(false)
  const [provinces, setProvinces] = useState({})
  const [districts, setDistricts] = useState({})
  const [communes, setCommunes] = useState({})

  const renderProvince = () => {
    if(!window.WebAddress[country_id]) return
    const provinces = window.WebAddress[country_id] || {}
    let options = Object.keys(provinces).sort((a, b) => provinces[a].name.localeCompare(provinces[b].name))
    if (country_id == 84) {
      const idxHCM = options.findIndex(el => el == '701')
      options.splice(idxHCM, 1)
      options.unshift('701')

      const idxHN = options.findIndex(el => el == '101')
      options.splice(idxHN, 1)
      options.unshift('101')
    }

    setProvinces(options.map(el => ({value: el, label: <span>{provinces[el].name}</span>})))
  }

  const renderDistricts = () => {
    if (!provinceId) return
    const districts = window.WebAddress[country_id][provinceId] || {}
    let options = Object.keys(districts).filter(el => !['id', 'name', 'name_en'].includes(el))
    options.sort((a, b) => districts[a].name.localeCompare(districts[b].name))

    setDistricts(options.map(el => ({value: el, label: <span>{districts[el].name}</span>})))
  }

  const renderCommunes = () => {
    if (!districtId && !provinceId) return
    const communes = window.WebAddress[country_id][provinceId][districtId] || {}
    let options = Object.keys(communes).filter(el => !['id', 'name', 'name_en'].includes(el))
    options.sort((a, b) => communes[a].name.localeCompare(communes[b].name))
    setCommunes(options.map(el => ({value: el, label: <span>{communes[el].name}</span>})))
  }

  const onClose = () => {
    setOpenAddAddress(false)
    setEditAddress(null)
  }
  const generateRandomInteger = () => {
    // Generate an 8-character random integer as a string
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  };

  const handleAdd = () => {
    let list_address = localStorage.getItem('list-address') || '[]'
    list_address = JSON.parse(list_address)

    if (defaultValue) {
      list_address = list_address.map(el => ({...el, default: false}))
    }

    let address = {
      id: generateRandomInteger(),
      country_id: country_id,
      full_name: fullName,
      phone_number: phoneNumber,
      detect_address: detectAddress,
      province_id: provinceId,
      district_id: districtId,
      commune_id: communeId,
      default: defaultValue || false,
      decode_address: decodeAddress()
    }

    console.log(list_address, "list_addresss")

    list_address.push(address)

    setListAddress(list_address)
    localStorage.setItem('list-address', JSON.stringify(list_address))
    if (defaultValue) setCustomerInfo(address)
    onClose()
  }

  const handleChange = (key, value) => {
    switch(key) {
      case 'full_name':
        setFullName(value)
        break
      case 'phone_number':
        const formatPhone = value.replace(/\D/g, "");
        setPhoneNumber(formatPhone)
        break
      case 'detect_address':
        setDetectAddress(value)
      break

    }
  }

  const decodeAddress = () => {
    console.log(provinces, "provincess")
    console.log(provinceId, "provinceeId")
    if ( provinceId && districtId && communeId) {
      let province = window.WebAddress[country_id][provinceId].name
      let district = window.WebAddress[country_id][provinceId][districtId].name
      let commune =  window.WebAddress[country_id][provinceId][districtId][communeId].name
  
      console.log(province, "provinceee")
      console.log(district, "districcc")
      console.log(commune, "communeeee")

      return `${detectAddress + ", " + commune + ", " + district + ", " + province}`
    }
    return ""
  }

  const onChangeDefault = (checked) => {
    setDefaultValue(checked)
  }

  const handleChangeProvince = (value, option) => {
    if (value != provinceId) {
      setCommuneId(null)
      setDistrictId(null)
      setCommunes([])
      setDistricts([])
    }
    setProvinceId(value)
  }

  const handleChangeDistrict = (value, option) => {
    if (value != districtId) {
      setCommuneId(null)
      setCommunes([])
    }
    setDistrictId(value)
  }

  const handleChangeCommune = (value, option) => {
    setCommuneId(value)
  }

  const handleSaveEdit = () => {
    console.log('save editt', editAddress)
    let updateList = [...listAddress]
    if (defaultValue) {
      updateList = updateList.map(el => ({...el, default: false}))
    }

    updateList = updateList.map(el =>
      el.id == editAddress.id
      ?
        {
          ...el,
          full_name: fullName,
          phone_number: phoneNumber,
          detect_address: detectAddress,
          province_id: provinceId,
          district_id: districtId,
          commune_id: communeId,
          default: defaultValue || false,
          decode_address: decodeAddress()
         }
      :
        el
    )

    setListAddress(updateList)
    localStorage.setItem('list-address', JSON.stringify(updateList))

    if (defaultValue) {
      let address = {
        ...editAddress,
        full_name: fullName,
        phone_number: phoneNumber,
        detect_address: detectAddress,
        province_id: provinceId,
        district_id: districtId,
        commune_id: communeId,
        default: defaultValue || false,
        decode_address: decodeAddress()
      }

      setCustomerInfo(address)
    }
    onClose()
  }

  const handleRemove = (id) => {
    let updateList = listAddress.filter(el => el.id != id)
    setListAddress(updateList)
    localStorage.setItem('list-address', JSON.stringify(updateList))
    onClose()
  }

  useEffect(() => {
      renderProvince()
    }, [window.WebAddress])

  useEffect(() => {
    renderDistricts()
  },[provinceId])

  useEffect(() => {
    renderCommunes()
  }, [districtId])

  useEffect(() => {
    if (editAddress) {
      setFullName(editAddress.full_name)
      setProvinceId(editAddress.province_id)
      setDistrictId(editAddress.district_id)
      setCommuneId(editAddress.commune_id)
      setPhoneNumber(editAddress.phone_number)
      setDetectAddress(editAddress.detect_address)
      setDefaultValue(editAddress.default)
    }
  }, [editAddress])

  useEffect(() => {
    setDataToStorage('customer-info', customerInfo)
  }, [customerInfo])

  return (
    <div>
      <Drawer
        placement={'bottom'}
        closable={false}
        onClose={onClose}
        open={openAddAddress}
        className="custom-drawer"
        height={'calc(100vh - 36px)'}
      >
        <div className="flex items-center p-3 border-b border-b-solid border-b-[#d9d9d9]">
          <div onClick={onClose}><ArrowLeft size={24} color="#000" weight="light" /></div>
          <div className="font-bold flex-1 text-center">Thêm địa chỉ</div>
        </div>
        <div className="bg-[#f3f3f3] h-[calc(100vh-140px)] pt-3 overflow-y-auto">
          <div className="p-3 bg-[#fff]">
            <div>
              <div>Họ và tên <span className="pl-1 text-red-600">*</span></div>
              <Input
                className="mb-2"
                placeholder="Nhập họ và tên"
                size="large"
                onChange={e => handleChange('full_name', e.target.value)}
                value={fullName}
              />
            </div>
            <div>
              <div>Số điện thoại<span className="pl-1 text-red-600">*</span></div>
              <Input
                className="mb-2"
                placeholder="Số điện thoại"
                size="large"
                onChange={e => handleChange('phone_number', e.target.value)}
                value={phoneNumber}
              />
            </div>
            
            <div className="mb-2">
            <div>Chọn Tỉnh/ Thành phố <span className="pl-1 text-red-600">*</span></div>
            <Select 
              className="w-full h-10"
              placeholder="Chọn Tỉnh/ Thành phố"
              options={provinces}
              value={provinceId}
              onChange={handleChangeProvince}
            /> 
          </div>
          <div className="mb-2">
            <div>Chọn Quận/ Huyện <span className="pl-1 text-red-600">*</span></div>
            <Select
              value={districtId}
              className="w-full h-10"
              placeholder="Chọn Quận/ Huyện"
              options={districts}
              onChange={handleChangeDistrict}
            />
          </div>

          <div className="mb-2">
          <div>Chọn Phường/ Xã <span className="pl-1 text-red-600">*</span></div>
            <Select
              value={communeId}
              className="w-full h-10"
              placeholder="Chọn Phường/ Xã"
              options={communes}
              onChange={handleChangeCommune}
            />
          </div>

            <div>
              <div>
                Địa chỉ cụ thể
                <span className="text-[12px] text-zinc-500">(Số nhà, Tên tòa nhà, Tên đường, Tên khu vực)</span>
                <span className="pl-1 text-red-600">*</span>
              </div>
              <TextArea
                onChange={e => handleChange('detect_address', e.target.value)}
                value={detectAddress}
                rows={3}
                placeholder="Nhập địa chỉ cụ thể"
              />
            </div>
          </div>
          <div className="bg-[#fff] p-3 flex justify-between items-center mt-3">
            <div>Đặt làm địa chỉ mặc định</div>
            <Switch checked={defaultValue} size="small" onChange={onChangeDefault} />
          </div>

          { editAddress &&
            <div onClick={() => handleRemove(editAddress.id)} className="bg-[#fff] p-3 flex justify-between items-center my-3">
              <div className="text-red-600">Xóa</div>
            </div>
          }
        </div>
        <div>
          <div className="px-3 pt-1 bg-[#fff] border-t border-t-solid border-t-[#efefef] fixed bottom-0 w-full">
            <div className="flex">
              {
                editAddress
                ?
                <div className="flex w-full">
                  <Button color="default" variant="solid" className="w-full h-[36px] my-2 font-medium rounded-[4px]" onClick={handleSaveEdit}> Lưu thay đổi</Button>
                </div>
                :
                <>
                  <div className="w-1/2 pr-1">
                    <Button color="default" variant="filled" className="w-full h-[36px] my-2 font-medium rounded-[4px]" onClick={onClose}> Đóng</Button>
                  </div>
                  <div className="flex w-1/2 pl-1">
                    <Button color="default" variant="solid" className="w-full h-[36px] my-2 font-medium rounded-[4px]" onClick={handleAdd}> Thêm mới</Button>
                  </div>
                </>
              }
              
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  )
}

export default AddAddress