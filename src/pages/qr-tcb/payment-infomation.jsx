import React from "react"
import { CopySimple } from "@phosphor-icons/react"
import { message } from "antd"
import { capitalize, getBankingTransferContent, slugifyBankingContent } from "../../utils/tools"
import { useRecoilValue } from "recoil"
import { orderTransactionState, orderState } from "../../recoil/tcb"


const PaymentInfomation = () => {
  const paymentInfo = useRecoilValue(orderTransactionState)?.payment_info || {}
  const order = useRecoilValue(orderState)

  const onClickCopy = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => message.success("Đã copy"))
      .catch((err) => {
        console.error('[ERROR_COPY_CLIPBOARD]', err)
      })
  }

  const transferContent = () => {
    let text = order.transfer_content
    
    if (text) {
      text = text.replaceAll('{ORDER_ID}', order.display_id || order.render_id)
        .replaceAll('{PHONE_NUMBER}', order.bill_phone_number)
        .replaceAll('{FULL_NAME}', order.bill_full_name)

      text = getBankingTransferContent(text, data.order.fields)
    }
    else text = `Thanh toan don hang ${order.display_id || order.render_id}`

    return slugifyBankingContent(text)
  }

  return (
    <div className="py-4 px-4 bg-white rounded-lg mb-4">
      <div className="text-base font-medium text-[#25282A] mb-4">Thông tin thanh toán</div>

      {
        paymentInfo?.bank_code && (
          <div className="h-6 flex justify-between items-center mb-2">
            <div className="text-sm font-light">Mã ngân hàng</div>
            <div className="flex items-center">
              <div className="text-sm font-semibold">{capitalize(paymentInfo?.bank_code)}</div>
              <CopySimple className="ml-2 cursor-pointer shrink-0" size={18} onClick={() => onClickCopy(paymentInfo?.bank_code)}/>
            </div>
          </div>
        )
      }

      {
        paymentInfo?.token_code && (
        <div className="h-6 flex justify-between items-center mb-2">
            <div className="text-sm font-light">Mã token</div>
            <div className="flex items-center">
              <div className="text-sm font-semibold">{paymentInfo?.token_code}</div>
              <CopySimple className="ml-2 cursor-pointer shrink-0" size={18} onClick={() => onClickCopy(paymentInfo?.token_code)}/>
            </div>
          </div>
        )
      }

      {
        paymentInfo?.merchant_name && (
          <div className="h-6 flex justify-between items-center mb-2">
            <div className="text-sm font-light">Tên người nhận</div>
            <div className="flex items-center">  
              <div className="text-sm font-semibold">{paymentInfo?.merchant_name}</div>
              <CopySimple className="ml-2 cursor-pointer shrink-0" size={18} onClick={() => onClickCopy(paymentInfo?.merchant_name)}/>
            </div>
          </div>
        )
      }

      <div className="min-h-6 flex justify-between items-center">
        <div className="text-sm font-light flex-1">Nội dung thanh toán</div>
        <div className="flex items-center flex-2 justify-end text-right">
          <div className="text-sm font-semibold">{transferContent()}</div>
          <CopySimple className="ml-2 cursor-pointer shrink-0" size={18} onClick={() => onClickCopy(transferContent())}/>
        </div>
      </div>
    </div>
  )
}

export default PaymentInfomation