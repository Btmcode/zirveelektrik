import {
  Zap, SearchCheck, CircuitBoard, Activity, Cable, Lightbulb, Plug,
  ShieldCheck, AirVent, BellRing, Building2, Network, BatteryCharging,
  Wrench, Phone, Clock, MapPin, Star, CheckCircle2, AlertTriangle,
  Sparkles, FileText, Users, Award, ThumbsUp, CalendarClock, Wallet,
  Home, Factory, Tv, Wifi, Fan, Heater, Flame, Droplets, Settings,
  Gauge, Lock, KeyRound, Hammer, Drill, TriangleAlert,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Lucide ikon adı → bileşen eşlemesi.
 * Güvenlik: dinamik import yerine allow-list kullanılır;
 * veritabanındaki `icon` alanı yalnızca bu listeden çözülür.
 */
export const ICON_MAP: Record<string, LucideIcon> = {
  Zap, SearchCheck, CircuitBoard, Activity, Cable, Lightbulb, Plug,
  ShieldCheck, AirVent, BellRing, Building2, Network, BatteryCharging,
  Wrench, Phone, Clock, MapPin, Star, CheckCircle2, AlertTriangle,
  TriangleAlert, Sparkles, FileText, Users, Award, ThumbsUp, CalendarClock,
  Wallet, Home, Factory, Tv, Wifi, Fan, Flame, Droplets, Settings,
  Gauge, Lock, KeyRound, Hammer, Drill,
};

export function getIcon(name?: string | null): LucideIcon {
  if (name && ICON_MAP[name]) return ICON_MAP[name];
  return Zap;
}
