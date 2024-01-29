import { NextPage } from "next";
import DashboardLayout from "./dashboard.layout";
import SettingLayout from "./settings.layout";

type pageDashboardLayout = NextPage & { layout: typeof DashboardLayout }
type pageSettingslayout = NextPage & { layout: typeof SettingLayout }

type PageWithLayout = pageDashboardLayout | pageSettingslayout


export default PageWithLayout