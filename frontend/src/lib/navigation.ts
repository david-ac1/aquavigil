export type NavItem = {
  href: string;
  label: string;
  shortLabel: string;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dashboard", shortLabel: "Home" },
  { href: "/sentinel-map", label: "Sentinel Map", shortLabel: "Map" },
  {
    href: "/sensor-deep-dive",
    label: "Sensor Deep-Dive",
    shortLabel: "Deep-Dive",
  },
  { href: "/ngo-reporting", label: "NGO Reporting", shortLabel: "Reporting" },
  {
    href: "/transparency-feed",
    label: "Transparency Feed",
    shortLabel: "Feed",
  },
];
