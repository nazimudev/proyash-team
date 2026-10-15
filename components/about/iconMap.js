/**
 * Maps the string icon keys used in data/aboutProyash.js to lucide-react icons.
 * ASSUMPTION: the project uses `lucide-react`. If it uses another library
 * (react-icons, heroicons…), change only the imports in this one file.
 */
import {
  BadgeCheck,
  Eye,
  GraduationCap,
  Handshake,
  Heart,
  HandHeart,
  HeartHandshake,
  ScanEye,
  ShieldCheck,
  Sprout,
  Target,
  Users,
  UsersRound,
} from "lucide-react";

const icons = {
  badgeCheck: BadgeCheck,
  eye: Eye,
  graduationCap: GraduationCap,
  handHeart: HandHeart,
  handshake: Handshake,
  heart: Heart,
  heartHandshake: HeartHandshake,
  scanEye: ScanEye,
  shieldCheck: ShieldCheck,
  sprout: Sprout,
  target: Target,
  users: Users,
  usersRound: UsersRound,
};

export function getIcon(name) {
  return icons[name] ?? Heart;
}
