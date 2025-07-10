import React, {useState} from "react";
import {QRCodeSVG} from 'qrcode.react';
import {CopySimple, ShareFat} from '@phosphor-icons/react'
import settings from "../../app-settings.json"
import { openShareSheet } from "zmp-sdk/apis";

const ShareLink = () => {
  const LOGO = settings ?.zalo_oa_logo
  const OA_NAME = settings ?.zalo_oa_name
  const link = `https://zalo.me/s/${import.meta.env.VITE_APP_ID}/`
  const copyToClipboard = () => {
    navigator.clipboard.writeText(link).then(() => {
      alert("Đã sao chép!");
    });
  };

  const shareLinkMiniApp = async () => {
    try {
      const data = await openShareSheet({
        type: "link",
        data: {
          link: link,
          chatOnly: false,
        },
      });
    } catch (err) {}
  }

  return (
    <div className="bg-[#fff] m-2 p-3 rounded-lg">
      <div className="font-bold text-center pb-2">Chia sẻ cửa hàng của bạn</div>
      <div className="flex justify-center">
        <QRCodeSVG
          className="border border-solid border-[#eee] rounded-lg p-2"
          value={link}
          title={"Title for my QR Code"}
          size={180}
          bgColor={"#ffffff"}
          fgColor={"#000000"}
          level={"L"}
          imageSettings={{
            src: LOGO,
            x: undefined,
            y: undefined,
            height: 36,
            width: 36,
            opacity: 1,
            excavate: true,
          }}
        />
      </div>
      <div className="pt-2">Mời bạn tham gia "{OA_NAME}" trên ứng dụng qua đường dẫn hoặc Quét mã QR tải</div>
      <div className="flex items-center justify-between bg-[#ccc] rounded-md h-[28px] px-2 mx-4 mt-4">
        <div className="truncate pr-1">{link}</div>
        <div className="w-[20px]" onClick={copyToClipboard}>
          <CopySimple size={18} color="#000" weight="thin"/>
        </div>
       
      </div>
      <div className="flex justify-around pt-4 mx-4">
        <div className="flex flex-col items-center" onClick={copyToClipboard}>
          <CopySimple size={18} color="#000" weight="fill" />
          <div className="text-[12px] font-medium pt-2">Sao chép link</div>
        </div>
        <div className="flex flex-col items-center" onClick={shareLinkMiniApp}>
          <ShareFat size={18} color="#000" weight="fill" />
          <div className="text-[12px] font-medium pt-2">Chia sẻ link</div>
        </div>
      </div>
    </div>
  )
}

export default ShareLink