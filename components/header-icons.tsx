import Image from "next/image";

export default function HeaderIcons() {
    return (
        <div className="flex gap-4 justify-center items-center">
            <Image
                src="/simpan-rindu-logo.png"
                alt="Logo"
                width={100}
                height={100}
            />
            <Image
                src="/rsud-logo.png"
                alt="Logo"
                width={80}
                height={80}
            />
        </div>
    )
}