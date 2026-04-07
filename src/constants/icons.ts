import type { ComponentType } from "react";
import type { IconProps } from "../components/icons/social";
import { FacebookIcon, LinkIcon, TikTokIcon, ZaloIcon } from "../components/icons/social";
import {
  BriefcaseBusiness,
  Bird,
  Camera,
  Code,
  Gamepad2,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  PhoneCall,
  PlaySquare,
  Printer,
  Send,
  Smartphone,
} from "lucide-react";

export type IconComponent = ComponentType<IconProps>;

export interface IconOption {
  name: string;
  value: string;
  icon: IconComponent;
  description: string;
}

export const CONTACT_ICONS: IconOption[] = [
  { name: "Email", value: "mail", icon: Mail, description: "Email address" },
  { name: "Phone", value: "phone", icon: Phone, description: "Phone number" },
  { name: "Address", value: "location", icon: MapPin, description: "Physical address" },
  { name: "Website", value: "globe", icon: Globe, description: "Website URL" },
  { name: "Fax", value: "fax", icon: Printer, description: "Fax number" },
  { name: "Mobile", value: "mobile", icon: Smartphone, description: "Mobile phone" },
];

export const SOCIAL_ICONS: IconOption[] = [
  { name: "Facebook", value: "facebook", icon: FacebookIcon, description: "Facebook profile" },
  { name: "Twitter", value: "twitter", icon: Bird, description: "Twitter profile" },
  { name: "Instagram", value: "instagram", icon: Camera, description: "Instagram profile" },
  { name: "LinkedIn", value: "linkedin", icon: BriefcaseBusiness, description: "LinkedIn profile" },
  { name: "YouTube", value: "youtube", icon: PlaySquare, description: "YouTube channel" },
  { name: "TikTok", value: "tiktok", icon: TikTokIcon, description: "TikTok profile" },
  { name: "Zalo", value: "zalo", icon: ZaloIcon, description: "Zalo contact" },
  { name: "Telegram", value: "telegram", icon: Send, description: "Telegram channel" },
  { name: "WhatsApp", value: "whatsapp", icon: MessageCircle, description: "WhatsApp contact" },
  { name: "Skype", value: "skype", icon: PhoneCall, description: "Skype contact" },
  { name: "Discord", value: "discord", icon: Gamepad2, description: "Discord server" },
  { name: "GitHub", value: "github", icon: Code, description: "GitHub profile" },
  { name: "Link", value: "link", icon: LinkIcon, description: "Generic link" },
];

export const ALL_ICONS: IconOption[] = [...CONTACT_ICONS, ...SOCIAL_ICONS];

export const getIconByValue = (value: string): IconOption | undefined => ALL_ICONS.find((i) => i.value === value);

export const getIconByType = (type: string): IconOption[] => {
  switch (type) {
    case "email":
    case "phone":
    case "address":
      return CONTACT_ICONS;
    case "social":
      return SOCIAL_ICONS;
    default:
      return ALL_ICONS;
  }
};


