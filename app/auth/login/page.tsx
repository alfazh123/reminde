"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { db } from "../../firebase";
import HeaderIcons from "@/components/header-icons";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Mengambil data dari Firestore collection "admin", dokumen "admin-data"
            const docRef = doc(db, "admin", "admin-data");
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const adminData = docSnap.data();

                // Validasi pencocokan input dengan data di Firestore
                if (
                    adminData.username === username &&
                    adminData.password === password
                ) {
                    // Jika cocok, simpan status login ke session
                    sessionStorage.setItem("isLoggedIn", "true");
                    sessionStorage.setItem("username", username);

                    // Redirect ke dashboard
                    router.push("/");
                } else {
                    setError("Username atau password salah!");
                }
            } else {
                setError("Data admin tidak ditemukan di database.");
            }
        } catch (err) {
            console.error("Error saat login:", err);
            setError("Terjadi kesalahan saat login. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    }

    return (
		<div className="flex flex-col justify-center items-center min-h-screen w-full">
			<HeaderIcons />
			<FieldGroup className="w-full flex flex-col justify-center items-center">
				{/* 1. Tambahkan onSubmit={handleSubmit} di sini */}
				<form
					className="w-full max-w-md p-8 bg-white rounded-lg shadow-md border"
					onSubmit={handleSubmit}>
					<FieldSet>
						<FieldLegend>Login</FieldLegend>
						<FieldDescription>Start monitoring</FieldDescription>

						{/* Tampilkan pesan error jika ada */}
						{error && (
							<div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
								{error}
							</div>
						)}

						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="username">
									Username
								</FieldLabel>
								<Input
									id="username"
									placeholder="Enter your username"
									value={username}
									onChange={(e) =>
										setUsername(e.target.value)
									}
									required
								/>
							</Field>
							<Field>
								<FieldLabel htmlFor="password">
									Password
								</FieldLabel>
								<Input
									id="password"
									placeholder="Please enter your password"
									type="password"
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									required
								/>
							</Field>
						</FieldGroup>
					</FieldSet>

					<Field
						orientation="horizontal"
						className="mt-4">
						{/* 2. Hapus onClick yang salah, biarkan type="submit" memicu form */}
						<Button
							type="submit"
							className="w-full"
							disabled={loading}>
							{loading ? "Memeriksa..." : "Login"}
						</Button>
					</Field>
				</form>
			</FieldGroup>
		</div>
	);
}