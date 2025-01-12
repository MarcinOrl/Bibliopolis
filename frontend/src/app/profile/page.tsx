'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../utils/UserContext";
import apiClient from "../../utils/api";
import { applyColors } from "../../utils/ThemeManager";
import Link from 'next/link';

interface Theme {
    id: number;
    name: string;
    primary_color: string;
    secondary_color: string;
    accent_color: string;
}

const Profile: React.FC = () => {
    const { userData, isAuthenticated } = useUser();
    const [themes, setThemes] = useState<Theme[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            apiClient.get("/themes/select/")
                .then(response => {
                    const { primary_color, secondary_color, accent_color } = response.data;
                    applyColors(primary_color, secondary_color, accent_color);
                })
                .catch(error => {
                    console.error("Error loading selected theme:", error);
                    apiClient.get("/theme/default/")
                        .then(response => {
                            const { primary_color, secondary_color, accent_color } = response.data;
                            applyColors(primary_color, secondary_color, accent_color);
                        })
                        .catch(error => console.error("Error loading default theme:", error));
                });
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            apiClient.get("/themes/")
                .then(response => setThemes(response.data))
                .catch(error => console.error("Error loading themes:", error));
        }
    }, [isAuthenticated]);

    const handleSelectTheme = (themeId: number) => {
        apiClient.post("/themes/select/", { theme_id: themeId })
            .then((response) => {
                const { primary_color, secondary_color, accent_color } = response.data;
                applyColors(primary_color, secondary_color, accent_color);
            })
            .catch(error => {
                console.error("Error selecting theme.", error);
                alert("Error changing theme.");
            });
    };

    if (!userData) return <div>Ładowanie...</div>;
    
    return (
        <div>
            <div className="container mx-auto p-4">
                <h1 className="text-xl py-4 font-semibold">Hello, {userData.username}</h1>
                <ul className="flex flex-wrap gap-4">
                    {themes.map((theme) => (
                        <li key={theme.id} className="p-4 border rounded flex-shrink-0">
                            <h3 className="text-xl font-bold">{theme.name}</h3>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="flex gap-2">
                                    <div style={{ backgroundColor: theme.primary_color }} className="w-8 h-8 border rounded-full"></div>
                                    <div style={{ backgroundColor: theme.secondary_color }} className="w-8 h-8 border rounded-full"></div>
                                    <div style={{ backgroundColor: theme.accent_color }} className="w-8 h-8 border rounded-full"></div>
                                </div>
                                <button
                                    onClick={() => handleSelectTheme(theme.id)}
                                    className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Select
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Profile;
