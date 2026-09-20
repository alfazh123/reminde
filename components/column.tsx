"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { type DataTableFeatures } from "./data-table-features";
import { TableRowProps } from "@/app/type";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import DetailInfo from "./detail-info";
import { Badge } from "./ui/badge";

const columnHelper = createColumnHelper<DataTableFeatures, TableRowProps>();

export const columns = (onDelete: (id: string) => void) =>
	columnHelper.columns([
		columnHelper.accessor("roomId", {
			header: "Nomor Kamar",
		}),
		columnHelper.accessor("rangeTime", {
			header: "Rentang Waktu",
			cell: ({ getValue }) => {
				const hours = getValue() as number;
				return (
					<span className="flex items-center justify-center gap-2">
						<p>{hours} jam</p>
					</span>
				);
			},
		}),
		columnHelper.accessor("category", {
			header: "Kategori",
			cell: ({ getValue }) => {
				const category = getValue() as string;
				return (
					<Badge
						variant={category === "infus" ? "default" : "outline"}>
						{category === "infus" ? "Infus" : "IV Cateter"}
					</Badge>
				);
			},
		}),
		columnHelper.accessor("timeStart", {
			header: "Waktu Mulai",
			cell: ({ getValue }) => {
				const date = getValue() as Date;
				return date.toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
					day: "2-digit",
					month: "2-digit",
					year: "numeric",
				});
			},
		}),
		columnHelper.display({
			header: "Waktu Selesai",
			cell: ({ row }) => {
				const timeStart = row.original.timeStart;
				const rangeTime = row.original.rangeTime * 60 * 60 * 1000;
				const timeEnd = new Date(timeStart.getTime() + rangeTime);
				return timeEnd.toLocaleString([], {
					hour: "2-digit",
					minute: "2-digit",
					day: "2-digit",
					month: "2-digit",
					year: "numeric",
				});
			},
		}),
		columnHelper.accessor("volume", {
			header: "Volume",
			cell: ({ getValue, row }) => {
				const volume = getValue() as string;
				return (
					<span className="flex items-center justify-center gap-2">
						{row.original.category === "infus" ? (
							<p>{volume} ml</p>
						) : (
							<p></p>
						)}
					</span>
				);
			},
		}),
		columnHelper.accessor("dropFactor", {
			header: "Drop Factor",
			cell: ({ getValue, row }) => {
				return (
					<span className="flex items-center justify-center gap-2">
						{row.original.category === "infus" ? (
							<p>{row.original.dropFactor}</p>
						) : (
							<p></p>
						)}
					</span>
				);
			},
		}),
		columnHelper.accessor("result", {
			header: "Hasil",
			cell: ({ getValue, row }) => {
				const result = getValue() as string;
				return (
					<span className="flex items-center justify-center gap-2">
						{row.original.category === "infus" ? (
							<p>{result} tpm</p>
						) : (
							<p></p>
						)}
					</span>
				);
			},
		}),
		columnHelper.display({
			header: "Action",
			cell: ({ row }) => {
				const [isDue, setIsDue] = useState(false);
				const speechIntervalRef = useRef<number | null>(null);

				const rangeTime = row.original.rangeTime * 60 * 60 * 1000;
				const timeStart = row.original.timeStart;
				const endTime = new Date(timeStart.getTime() + rangeTime);

				// Pengecekan waktu due setiap 5 detik
				useEffect(() => {
					const checkDue = () => {
						const now = new Date();
						if (now > endTime) {
							setIsDue(true);
						}
					};

					checkDue();
					const interval = setInterval(checkDue, 5000);

					return () => clearInterval(interval);
				}, [endTime]);

				// Mengatur Speech Synthesis berulang kali saat isDue bernilai true
				useEffect(() => {
					if (isDue) {
						// 1. Munculkan Notifikasi Browser
						if (
							typeof window !== "undefined" &&
							"Notification" in window
						) {
							Notification.requestPermission().then((res) => {
								if (res === "granted") {
									new Notification("Peringatan Infus", {
										body: `Waktu untuk ganti Infus Kamar ${row.original.roomId}`,
									});
								}
							});
						}

						// Fungsi untuk membacakan teks dengan suara browser
						const speakAlarm = () => {
							if (
								typeof window !== "undefined" &&
								"speechSynthesis" in window
							) {
								const synth = window.speechSynthesis;
								synth.cancel(); // Batalkan antrean suara sebelumnya agar tidak menumpuk
								const utterThis = new SpeechSynthesisUtterance(
									`Waktu untuk ganti Infus Kamar ${row.original.roomId}`,
								);
								utterThis.lang = "id-ID";
								synth.speak(utterThis);
							}
						};

						// Ucapkan pertama kali
						speakAlarm();

						// Ulangi setiap 5 detik sekali (sesuaikan jeda waktu agar kalimat selesai diucapkan)
						if (!speechIntervalRef.current) {
							speechIntervalRef.current = window.setInterval(
								speakAlarm,
								5000,
							) as unknown as number;
						}
					}

					return () => {
						if (speechIntervalRef.current) {
							window.clearInterval(speechIntervalRef.current);
							speechIntervalRef.current = null;
						}
						if (
							typeof window !== "undefined" &&
							"speechSynthesis" in window
						) {
							window.speechSynthesis.cancel();
						}
					};
				}, [isDue, row.original.roomId]);

				const handleStopAlarm = () => {
					if (speechIntervalRef.current) {
						window.clearInterval(speechIntervalRef.current);
						speechIntervalRef.current = null;
					}
					if (
						typeof window !== "undefined" &&
						"speechSynthesis" in window
					) {
						window.speechSynthesis.cancel(); // Matikan suara saat tombol Stop ditekan
					}
					onDelete(row.original.id);
				};

				return (
					<span className="flex items-center justify-center gap-2">
						<DropdownMenu>
							<DropdownMenuTrigger
								className={`flex items-center justify-center rounded-md p-1 ${isDue ? "bg-red-500 text-white animate-pulse" : ""}`}>
								<EllipsisVertical className="h-4 w-4" />
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								{/* <DropdownMenuItem
                        onClick={() => console.log("Detail clicked")}>
                        
                    </DropdownMenuItem> */}
								<DetailInfo
									data={row.original}
									cateter={
										row.original.category === "cateter"
									}
								/>
								{isDue && (
									<DropdownMenuItem onClick={handleStopAlarm}>
										Stop
									</DropdownMenuItem>
								)}
								<DropdownMenuItem
									className="text-destructive focus:text-destructive"
									onClick={() => onDelete(row.original.id)}>
									Remove
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</span>
				);
			},
		}),
	]);
