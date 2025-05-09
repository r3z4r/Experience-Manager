import React from 'react'
import { OrderSuccessModalStyles } from './OrderSuccessModal.styles'

interface OrderSuccessModalProps {
  message: string
  requestId: string
  subMessage: string
  //   onClose: () => void
}

export const OrderSuccessModal = ({
  requestId,
  message,
  subMessage,
  //   onClose,
}: OrderSuccessModalProps) => {
  return (
    <>
      <style>{OrderSuccessModalStyles}</style>
      <div className="order-success-modal">
        <div className="success-icon">✓</div>
        <h2>{message}</h2>
        <p>{subMessage} Added to your Account</p>
        <div className="request-id">Request ID : {requestId}</div>
        <button>Done</button>
      </div>
    </>
  )
}
