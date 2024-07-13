"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

function Header() {
    const { user, isSignedIn } = useUser();
    const router = useRouter();
    // Navigate to home page on sign-in
    useEffect(() => {
        if (isSignedIn) {
            router.push('/dashboard');
        }
    }, [isSignedIn, router]);
    return (
        <div className="p-5 px-5 flex justify-between shadow-md w-full">
            <Image src="/logo.png" width={100} height={100} alt="logo" />

            {isSignedIn ? (
                <div
                    className="flex gap-2 items-center"
                >
                    <Link href={"/dashboard"}>
                        <Button variant={"outline"}>Dashboard</Button>
                    </Link>
                    <UserButton />
                </div>
            ) : (
                <Link href={"/auth/sign-in"}>
                    <Button className="hover:bg-white hover:border-[#11009E] hover:border-2 hover:text-[#11009E] border-2">
                        Get Started
                    </Button>
                </Link>

            )}

        </div>
    );
}

export default Header;
