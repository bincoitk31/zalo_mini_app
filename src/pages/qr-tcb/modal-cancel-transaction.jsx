import React from "react"
import { Modal, Button, message } from "antd"
import { visibleCancelTransactionState, tcbStore, orderTransactionState } from "../../recoil/tcb"
import { useRecoilState } from "recoil"
import { useNavigate } from "react-router-dom"

const ModalCancelTransaction = () => {
  const navigate = useNavigate()
  const [visibleCancelTransaction, setVisibleCancelTransaction] = useRecoilState(visibleCancelTransactionState)
  const [orderTransaction, setOrderTransaction] = useRecoilState(orderTransactionState)
  const handleCancelModal = () => {
    setVisibleCancelTransaction(false)
  }

  const onClickSave = () => {
    tcbStore('cancelOrderTransaction', {
      siteId: orderTransaction.site_id,
      orderRenderId: orderTransaction.order_render_id,
      type: orderTransaction.type
    })
    .then(res => {
      if (res.status == 200) {
        message.success('Hủy giao dịch thành công')
      }
    })
    .catch(err => {
      console.log(err, 'err cancel order transaction')
      message.error('Lỗi hủy giao dịch')
    })
    .finally(() => {
      handleCancelModal()
      navigate('/')
    })
  }

  return (
    <Modal
      centered
      open={visibleCancelTransaction}
      footer={null}
      className="!w-[400px] lg:!w-[416px]"
      onCancel={handleCancelModal}
    >
      <div className="p-2">
        <div className="text-base font-semibold">
          Hủy giao dịch thanh toán
        </div>
        <div className="mt-4 text-sm text-[#A5A8AA]">Bạn chắc chắn muốn hủy giao dịch thanh toán</div>

        <div className="flex justify-end mt-6 text-base">
          <Button className="h-[38px]" onClick={() => handleCancelModal()}>Hủy</Button>
          <Button className="ml-3 h-[38px]" color="danger" variant="solid" onClick={() => onClickSave()}>Hủy giao dịch</Button>
        </div>
      </div>
    </Modal>
  )
}

export default ModalCancelTransaction