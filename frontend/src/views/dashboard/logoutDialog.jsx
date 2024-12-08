import { useNavigate } from "react-router";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
    AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const LogoutDialog = () => {
    const navigate = useNavigate();

    // Fungsi logout
    const handleLogout = () => {
        localStorage.removeItem("authToken");
        navigate("/auth");
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" className="md:absolute md:top-7 md:right-7">
                    Log Out
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Apakah kamu yakin ingin keluar?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Mengklik "Lanjutkan" akan menghapus sesi Anda dan mengarahkan ke halaman
                        login.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>Lanjutkan</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default LogoutDialog;
