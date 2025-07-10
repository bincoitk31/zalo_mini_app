import React, { useEffect, useState } from "react"
import { QRCodeCanvas } from "qrcode.react"
import { getQRCodeBankPayment } from "../../utils/genQRBanking"
import { getBankingTransferContent, isEmpty, slugifyBankingContent } from "../../utils/tools"
import { Button, Spin, message } from "antd"
import { formatNumber } from "../../utils/formatNumber"
import { Socket } from "phoenix"
import { useParams } from "react-router-dom"
import {
  tcbStore,
  orderTransactionState,
  vituarlBankAccountState,
  loadingDetailState,
  visibleCancelTransactionState,
  errorFetchDetailState,
  errorFetchDetailMessageState,
  siteState,
  orderState
} from "../../recoil/tcb"
import { useRecoilState } from "recoil"
import { saveImageToGallery } from "zmp-sdk/apis"

import CountDownOrder from "./countdown-order"
import TcbTransactionSuccess from "./tcb-transaction-success"
import TcbTransactionError from "./tcb-transaction-error"
import PaymentInfomation from "./payment-infomation"
import OrderInfomation from "./order-infomation"
import TcbFooter from "./tcb-footer"
import TcbHeader from "./tcb-header"
import ModalCancelTransaction from "./modal-cancel-transaction"

const QrTcb = () => {
  const { render_id } = useParams()
  const [orderTransaction, setOrderTransaction] = useRecoilState(orderTransactionState)
  const [vituarlBankAccount, setVituarlBankAccount] = useRecoilState(vituarlBankAccountState)
  const [loadingDetail, setLoadingDetail] = useRecoilState(loadingDetailState)
  const [visibleCancelTransaction, setVisibleCancelTransaction] = useRecoilState(visibleCancelTransactionState)
  const [errorFetchDetail, setErrorFetchDetail] = useRecoilState(errorFetchDetailState)
  const [errorFetchDetailMessage, setErrorFetchDetailMessage] = useRecoilState(errorFetchDetailMessageState)
  const [site, setSite] = useRecoilState(siteState)
  const [order, setOrder] = useRecoilState(orderState)

  const [qrCode, setQrCode] = useState(null)

  const getBase64 = async (file) => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = function (error) {
        resolve(null)
      };
      })
    }

  const downloadQrCode = async () => {
    let canvas = document.getElementById("QRCode");
    var dataURL = canvas.toDataURL("image/png");

    try {
      await saveImageToGallery({
        imageBase64Data: dataURL.toString(),
      });
      message.success("Tải xuống thành công")
    } catch (error) {
      console.error(error, "Error save image to gallery");
    }
  }

  const transferContent = () => {
    let text = order.transfer_content

    if (text) {
      text = text.replaceAll('{ORDER_ID}', order.display_id || order.render_id)
        .replaceAll('{PHONE_NUMBER}', order.bill_phone_number)
        .replaceAll('{FULL_NAME}', order.bill_full_name)

      text = getBankingTransferContent(text, order.fields)
    } else {
      text = `Thanh toan don hang ${order.display_id || order.render_id}`
    }

    return slugifyBankingContent(text)
  }

  const connectSocket = () => {
    const siteId = import.meta.env.VITE_SITE_ID
    const renderId = render_id
    const uri = import.meta.env.VITE_ENV === 'DEV'
      ? "ws://localhost:24679/socket"
      : import.meta.env.VITE_ENV === 'STAGING'
        ? "wss://api.staging.storecake.io/socket"
        : "wss://api.storecake.io/socket"

    window.paymentSocket = new Socket(uri)
    window.paymentSocket.connect()

    const channelTcb = window.paymentSocket.channel(`tcb_payment::${siteId}:${renderId}`, {})

    channelTcb.on(`tcb_payment_success_${renderId}`, (msg) => {
      let payload = JSON.parse(msg.payload)
      setOrder({ ...order, transfer_money: payload.amount })
    })

    channelTcb
      .join()
      .receive("error", (resp) => {
        console.error('[ERROR_JOIN_CHANNEL_TCB_PAYMENT]', resp)
      })
  }

  useEffect(() => {
    connectSocket()
    return () => {
      window.paymentSocket.disconnect()
    }
  }, [])

  useEffect(() => {
    setLoadingDetail(true)
    tcbStore('getOrderDetail', {
      siteId: import.meta.env.VITE_SITE_ID,
      orderRenderId: render_id
    })
      .then(res => {
        if (res.status === 200) {
          const data = res.data.data
          setOrderTransaction(data.order_transaction)
          setVituarlBankAccount(data.vituarl_bank_account)
          setOrder(data.order)
          setSite(data.site)
        }
      })
      .catch(err => {
        setErrorFetchDetail(true)
        setErrorFetchDetailMessage(err?.response?.data?.reason?.message)
      })
      .finally(() => {
        setLoadingDetail(false)
      })
  }, [])

  useEffect(() => {
    const content = transferContent()
    if (isEmpty(order)) return
    const encodeText = getQRCodeBankPayment(
      vituarlBankAccount,
      order.invoice_value,
      content
    )
    if (encodeText) {
      setQrCode(encodeText)
    }
  }, [vituarlBankAccount])

  return (
    <>
      <TcbHeader />
      {
        false || loadingDetail ? (
          <div className="flex justify-center items-center h-[calc(100vh-194px)] bg-[#F3F4F4] relative">
            <Spin size="large" />
          </div>
        ) :
        (orderTransaction.is_expired || orderTransaction.is_cancel || errorFetchDetail) && !orderTransaction.paid_amount ? (
          <TcbTransactionError />
        ) : (
          <div className="p-4">
            {
              !order.transfer_money ? (
                <>
                  <div className="mb-4">
                    <CountDownOrder />
                  </div>
                  <div className="bg-[url('https://content.pancake.vn/1/s500x500/81/02/74/0a/68f6c4f088cae89f2aada53999474da01c01abfda75a9891a3822a46.png')] h-[508] lg:h-[484px] rounded-lg bg-tcb-payment bg-cover text-white flex flex-col items-center mb-4">
                    <div className="text-base leading-6 font-light my-6 max-w-[220px] lg:max-w-[500px] text-center px-4">
                      Sử dụng App ngân hàng hỗ trợ QR code để quét mã
                    </div>
                    <div onClick={() => downloadQrCode()} className="rounded w-[222px] h-[292px] bg-white overflow-hidden text-[#494C4E]">
                      <div className="text-sm text-center font-normal mt-4">
                        Quét mã QR chuyển khoản
                      </div>
                      <div className="w-full flex justify-center py-3">
                        <QRCodeCanvas id="QRCode" value={qrCode} size={180} />
                      </div>
                      <div className="text-[12px] text-center">
                        Nhấn vào QR để tải xuống
                      </div>
                    </div>
                    <div className="my-6 text-center">
                      <div className="text-base mb-2 font-light">Số tiền thanh toán</div>
                      <div className="text-3xl font-medium">
                        {formatNumber(order.invoice_value, site.currency)}
                      </div>
                    </div>
                  </div>
                  <PaymentInfomation />
                  <OrderInfomation />
                  <div className="mt-4">
                    <Button className="w-full h-[42px] text-sm" onClick={() => setVisibleCancelTransaction(true)}>
                      Hủy thanh toán
                    </Button>
                  </div>
                </>
              ) : (
                <TcbTransactionSuccess />
              )
            }
          </div>
        )
      }
      <TcbFooter />
      {visibleCancelTransaction && <ModalCancelTransaction />}
    </>
  )
}

export default QrTcb