// /src/data/links.ts
export type ILink = { name: string; href: string };

export const links: ILink[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Careers", href: "/careers" },
  { name: "Contact", href: "/contact" },
];

export const socialLinks = [
  { label: "Twitter", link: "#" },
  { label: "GitHub", link: "#" },
  { label: "LinkedIn", link: "#" },
];
