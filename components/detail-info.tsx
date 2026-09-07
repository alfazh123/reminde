import { TableRowProps } from "@/app/type";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Separator } from "./ui/separator";
import { Field, FieldGroup } from "./ui/field";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function DetailInfo({ data }: { data: TableRowProps }) {
    return (
        <Dialog>
            <DialogTrigger className="m-1 text-sm">
                Detail
            </DialogTrigger>
			<DialogContent
				className="sm:max-w-lg">
					<DialogHeader>
						<DialogTitle>Infus info (kamar {data.roomId})</DialogTitle>
					</DialogHeader>
					<Separator />
					<FieldGroup>
						<Field>
							<Label htmlFor="room-id">Nomor Kamar</Label>
							<Input
								id="room-id"
								name="room-id"
								placeholder="Masukkan nomor kamar"
								disabled
                                value={data.roomId}
							/>
						</Field>
						<Field>
							<Label htmlFor="start-time">Waktu Mulai</Label>
							<Input
								id="start-time"
								name="start-time"
								type="datetime-local"
								disabled
                                value={new Date(data.timeStart).toISOString().slice(0, 16)}
							/>
						</Field>
						<Field>
							<Label htmlFor="range-time">
								Rentang Waktu (Jam)
							</Label>
							{/* Diubah menjadi type="number" step="any" agar perawat bisa isi angka jam/desimal */}
							<Input
								id="range-time"
								name="range-time"
								type="number"
								step="0.5"
								placeholder="Contoh: 4 (untuk 4 jam)"
								disabled
                                value={data.rangeTime}
							/>
						</Field>
						<Field>
							<Label htmlFor="volume">Volume (mL)</Label>
							<Input
								id="volume"
								name="volume"
								type="number"
								placeholder="Masukkan volume infus"
								disabled
                                value={data.volume}
							/>
						</Field>
						<Field>
							<Label htmlFor="drop-factor">Drop Factor</Label>
                            <Input
								id="drop-factor"
								name="drop-factor"
								type="number"
								disabled
                                value={data.dropFactor}
							/>
						</Field>
					</FieldGroup>
					<DialogFooter>
						<DialogClose
							render={
								<Button
									variant="outline"
									type="button">
									Close
								</Button>
							}
						/>
					</DialogFooter>
			</DialogContent>
		</Dialog>
    )
}