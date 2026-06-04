import { waLink } from "./brand";
import { MessageCircle, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

export const SOCIAL_LINKS = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: MessageCircle,
    url: waLink("Hi Amazing Groups, I would like to connect with you!"),
    ariaLabel: "Contact us on WhatsApp",
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: Facebook,
    url: "https://facebook.com/amazinggroups",
    ariaLabel: "Visit our Facebook page",
  },
  {
    id: "instagram",
    label: "Instagram",
    icon: Instagram,
    url: "https://www.instagram.com/amazing_groups_/",
    ariaLabel: "Follow us on Instagram",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: Linkedin,
    url: "https://linkedin.com/company/amazinggroups",
    ariaLabel: "Connect with us on LinkedIn",
  },
  {
    id: "youtube",
    label: "YouTube",
    icon: Youtube,
    url: "https://youtube.com/@amazing_groups?si=fqIoaVZJfSzqcdzY",
    ariaLabel: "Subscribe to our YouTube channel",
  },
];
