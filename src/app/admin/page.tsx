import dynamicImport from 'next/dynamic';

const AdminContent = dynamicImport(() => import('./AdminContent'), { ssr: false });

export const dynamic = "force-dynamic";

export default function AdminPage() {
    return <AdminContent />;
}
