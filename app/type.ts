export type TableRowProps = {
    id: string;
    roomId: string;
    timeStart: Date;      // Waktu mulai infus dipasang
    rangeTime: number;    // Rentang waktu / durasi habisnya dalam satuan jam (bisa desimal, misal 2.5)
    volume: string;
    dropFactor: string;
    result: string;       // Hasil perhitungan kecepatan (tpm)
    createdAt?: Date;     // Waktu data dibuat
    category?: string;    // Kategori infus (misal: "Infus A", "Infus B", dll.)
}