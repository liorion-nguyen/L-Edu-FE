import type { ThemeConfig } from "antd";

const theme: ThemeConfig = {
  token: {
    colorPrimary: "#BFECFF", // Màu chính
    colorBorder: "#9291A3",
    colorBgLayout: "#ffffff",
    colorBgBase: "#ffffff",
    colorTextBase: "#282846", 
    colorTextSecondary: "#BFECFF", // Màu chữ phụ
    colorBgContainer: "white", // Màu nền cho card, section
  },
  components: {
    Typography: {
      colorText: "#282846",
    },
    Button: {
      colorText: "#FFFFFF",
      colorPrimary: "#1677ff",
    }
  },
};

export default theme;
