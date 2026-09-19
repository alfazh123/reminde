"use client";

import { db } from "@/app/firebase";
import { TableRowProps } from "@/app/type";
import { columns } from "@/components/column";
import { DataTable } from "@/components/data-table";
import FormCateter from "@/components/form-cateter";
import FormInfus from "@/components/form-infus";
import HeaderIcons from "@/components/header-icons";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const [isInfusFormOpen, setIsInfusFormOpen] = useState(false);
    const [isCateterFormOpen, setIsCateterFormOpen] = useState(false);
    const [infusData, setInfusData] = useState<TableRowProps[]>([]);
    const router = useRouter();

    const handleCloseInfusForm = () => {
        setIsInfusFormOpen(false);
    };

    const handleOpenInfusForm = () => {
        setIsInfusFormOpen(true);
    }

    const handleCloseCateterForm = () => {
		setIsCateterFormOpen(false);
	};

	const handleOpenCateterForm = () => {
		setIsCateterFormOpen(true);
	};

    const params = useParams();
    const slug = params?.slug || [];
    const level = slug[0] ? slug[0] : "1";

    const handleDelete = async (id: string) => {
        try {
            const collectionName = `gdh-level-${level}`;
            await deleteDoc(doc(db, collectionName, id));
            // Tidak perlu setInfusData manual lagi di sini karena onSnapshot akan otomatis memperbarui UI!
        } catch (error) {
            console.error("Gagal menghapus data:", error);
        }
    }

    useEffect(() => {
        const un = sessionStorage.getItem("username");
        if (!un) {
            router.push("/auth/login");
        }
    }, []);

    useEffect(() => {
        if (!level) return;

        // Nama collection dinamis sesuai level (contoh: gdh-level-1)
        const collectionName = `gdh-level-${level}`;
        const colRef = collection(db, collectionName);

        // onSnapshot akan mendengarkan setiap perubahan di database secara real-time
        const unsubscribe = onSnapshot(colRef, (snapshot) => {
            const dataList: TableRowProps[] = snapshot.docs.map((docItem) => {
                const data = docItem.data();
                return {
                    id: docItem.id, // Mengambil ID dokumen Firestore
                    roomId: data.roomId,
                    // Konversi kembali timestamp Firestore ke objek Date JavaScript jika diperlukan
                    timeStart: data.timeStart?.toDate ? data.timeStart.toDate() : new Date(data.timeStart),
                    rangeTime: data.rangeTime,
                    volume: data.volume,
                    dropFactor: data.dropFactor,
                    result: data.result,
                    category: data.category,
                } as TableRowProps;
            });

            setInfusData(dataList);
        }, (e: Error) => {
            console.error("Gagal mendengarkan data real-time:", e);
        });

        // Cleanup listener saat komponen di-unmount atau level berubah
        return () => unsubscribe();
    }, [level]);

    return (
		<div className="flex flex-col gap-4 w-full min-h-[60vh] justify-center items-center">
			<HeaderIcons />
			{/* <h1 className="text-2xl font-bold text-center">SIMPAN RINDU</h1> */}
			<div className="border p-2 rounded-lg w-full max-w-6xl mx-2">
				<DataTable
					columns={columns(handleDelete)}
					data={infusData}
					handleOpenInfusForm={handleOpenInfusForm}
					handleOpenCateterForm={handleOpenCateterForm}
					levelValue={parseInt(level)}
				/>
			</div>

			{isInfusFormOpen && (
				<FormInfus
					isOpen={isInfusFormOpen}
					onClose={handleCloseInfusForm}
					level={slug[0]}
				/>
			)}
			{isCateterFormOpen && (
				<FormCateter
					isOpen={isCateterFormOpen}
					onClose={handleCloseCateterForm}
					level={slug[0]}
				/>
			)}
		</div>
	);
}