import { FC } from "react";
import { notification } from "antd";
import { ToasterType } from "../../enum/toaster";

export const Toaster: FC = () => {
  notification.config({
    placement: "topRight",
    duration: 5, 
  });

  return null; 
};

export const showNotification = (
  type: ToasterType,
  message: string,
  description?: string
) => {
  notification[type]({
    message,
    description,
  });
};
