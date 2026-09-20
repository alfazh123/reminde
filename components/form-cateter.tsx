"use client";

import { useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Field, FieldGroup } from "./ui/field";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { dropFactorList } from "@/app/utils";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/app/firebase";
import { Separator } from "./ui/separator";

export default function FormCateter({isOpen, onClose, level}: {isOpen: boolean, onClose: () => void, level: string}) {
    const [form, setForm] = useState({
        roomId: "",
        startTime: Date.now(),
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const startDate = new Date(form.startTime);

        const cateterData = {
            id: Math.random().toString(36).substr(2, 9), // Generate random ID
            roomId: form.roomId,
            timeStart: startDate,
            rangeTime: 72,             // Rentang waktu dalam bentuk jam
            volume: "-",
            dropFactor: "-",
            result: "-", // Hasil TPM yang dihitung otomatis
            createdAt: new Date(),
            category: "cateter"
        };

        try {
            // 2. Tentukan nama collection secara dinamis berdasarkan nilai level
            const collectionName = `gdh-level-${level || "1"}`;

            // 3. Simpan ke Firestore (Collection otomatis dibuat jika belum ada)
            await addDoc(collection(db, collectionName), cateterData);

            console.log("Data Cateter Berhasil Disimpan ke:", collectionName);
            
            // Karena Dashboard Anda menggunakan onSnapshot, data di tabel 
            // akan otomatis sinkron tanpa perlu setInfusData manual lagi.
            onClose(); 
        } catch (error) {
            console.error("Gagal menyimpan data infus:", error);
            alert("Terjadi kesalahan saat menyimpan data.");
        }
    }

    return (
		<Dialog
			open={isOpen}
			onOpenChange={onClose}>
			<DialogContent
				className="sm:max-w-lg"
				showCloseButton={false}>
				<form
					onSubmit={handleSubmit}
					className="flex flex-col gap-2">
					<DialogHeader>
						<DialogTitle>Cateter Form (Level {level})</DialogTitle>
					</DialogHeader>
					<Separator />
					<FieldGroup>
						<Field>
							<Label htmlFor="room-id">Nomor Kamar</Label>
							<Input
								id="room-id"
								name="room-id"
								placeholder="Masukkan nomor kamar"
								onChange={(e) =>
									setForm({ ...form, roomId: e.target.value })
								}
								required
							/>
						</Field>
						<Field>
							<Label htmlFor="start-time">Waktu Mulai</Label>
							<Input
								id="start-time"
								name="start-time"
								type="datetime-local"
								onChange={(e) =>
									setForm({
										...form,
										startTime: new Date(
											e.target.value,
										).getTime(),
									})
								}
								required
							/>
						</Field>
					</FieldGroup>
					<DialogFooter>
						<DialogClose
							onClick={onClose}
							render={
								<Button
									variant="outline"
									type="button">
									Cancel
								</Button>
							}
						/>
						<Button type="submit">Simpan Cateter</Button>
					</DialogFooter>
					<DialogPrimitive.Close
						onClick={onClose}
						data-slot="dialog-close"
						render={
							<Button
								variant="ghost"
								className="absolute top-2 right-2 bg-secondary"
								size="icon-sm"
								type="button"
							/>
						}>
						<XIcon />
						<span className="sr-only">Close</span>
					</DialogPrimitive.Close>
				</form>
			</DialogContent>
		</Dialog>
	);
}