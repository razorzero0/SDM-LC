import { Card, CardTitle } from "@/components/ui/card";
import Dashboard from "./dashboard";

import LogoutDialog from "./logoutDialog";
export default function LayoutDashboard() {
    return (
        <div className=" py-4 min-h-[100vh] grid place-items-center bg-slate-400 ">
            <Card className="relative m-2 p-2 md:p-5 md:py-8  md:w-[800px] grid gap-5 place-items-center ">
                <LogoutDialog />
                <CardTitle className="text-2xl">SDM Language Center</CardTitle>
                <Dashboard />
            </Card>
        </div>
    );
}
