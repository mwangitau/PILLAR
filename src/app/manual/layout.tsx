
import AppLayout from "@/components/layout/AppLayout";

export default function ManualLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AppLayout>{children}</AppLayout>;
}
