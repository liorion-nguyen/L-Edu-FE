export interface IconOption {
  name: string;
  value: string;
  emoji: string;
  description: string;
}

export const CONTACT_ICONS: IconOption[] = [
  { name: "Email", value: "mail", emoji: "📧", description: "Email address" },
  { name: "Phone", value: "phone", emoji: "📞", description: "Phone number" },
  { name: "Address", value: "location", emoji: "📍", description: "Physical address" },
  { name: "Website", value: "globe", emoji: "🌐", description: "Website URL" },
  { name: "Fax", value: "fax", emoji: "📠", description: "Fax number" },
  { name: "Mobile", value: "mobile", emoji: "📱", description: "Mobile phone" },
];

export const SOCIAL_ICONS: IconOption[] = [
  { name: "Facebook", value: "facebook", emoji: "📘", description: "Facebook profile" },
  { name: "Twitter", value: "twitter", emoji: "🐦", description: "Twitter profile" },
  { name: "Instagram", value: "instagram", emoji: "📷", description: "Instagram profile" },
  { name: "LinkedIn", value: "linkedin", emoji: "💼", description: "LinkedIn profile" },
  { name: "YouTube", value: "youtube", emoji: "📺", description: "YouTube channel" },
  { name: "TikTok", value: "tiktok", emoji: "🎵", description: "TikTok profile" },
  { name: "Zalo", value: "zalo", emoji: "💬", description: "Zalo contact" },
  { name: "Telegram", value: "telegram", emoji: "✈️", description: "Telegram channel" },
  { name: "WhatsApp", value: "whatsapp", emoji: "💚", description: "WhatsApp contact" },
  { name: "Skype", value: "skype", emoji: "💙", description: "Skype contact" },
  { name: "Discord", value: "discord", emoji: "🎮", description: "Discord server" },
  { name: "GitHub", value: "github", emoji: "🐙", description: "GitHub profile" },
];

export const ALL_ICONS: IconOption[] = [
  ...CONTACT_ICONS,
  ...SOCIAL_ICONS,
];

export const getIconByValue = (value: string): IconOption | undefined => {
  return ALL_ICONS.find(icon => icon.value === value);
};

export const getIconByType = (type: string): IconOption[] => {
  switch (type) {
    case 'email':
    case 'phone':
    case 'address':
      return CONTACT_ICONS;
    case 'social':
      return SOCIAL_ICONS;
    default:
      return ALL_ICONS;
  }
};


