'use client';

import { useEffect, useState } from "react";
import apiClient from "../../utils/api";
import { useRouter } from "next/navigation";
import { applyColors } from "../../utils/ThemeManager";

interface Theme {
    id: number;
    name: string;
    primary_color: string;
    secondary_color: string;
    accent_color: string;
}

const Profile: React.FC = () => {
    const [themes, setThemes] = useState<Theme[]>([]);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            router.push("/login");
        }
    }, [router]);

    useEffect(() => {
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
    }, []);

    useEffect(() => {
        apiClient.get("/themes/")
            .then(response => setThemes(response.data))
            .catch(error => console.error("Error loading themes:", error));
    }, []);
   
    const handleSelectTheme = (themeId: number) => {
        apiClient.post("/themes/select/", { theme_id: themeId })
          .then((response) => {
            const { primary_color, secondary_color, accent_color } = response.data;
            applyColors(primary_color, secondary_color, accent_color);
            alert("Motyw został zmieniony.");
          })
          .catch(error => {
            console.error("Error selecting theme.", error);
            alert("Błąd przy zmianie motywu.");
          });
      };
      

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 flex justify-center">Twoje konto</h1>
            <h1 className="text-2xl font-bold mb-4">Wybierz motyw</h1>
            <ul className="space-y-4">
                {themes.map(theme => (
                <li key={theme.id} className="p-4 border rounded">
                    <h2 className="text-xl font-bold">{theme.name}</h2>
                    <div className="flex gap-2 mt-2">
                    <div style={{ backgroundColor: theme.primary_color }} className="w-8 h-8 rounded-full"></div>
                    <div style={{ backgroundColor: theme.secondary_color }} className="w-8 h-8 rounded-full"></div>
                    <div style={{ backgroundColor: theme.accent_color }} className="w-8 h-8 rounded-full"></div>
                    </div>
                    <button
                    onClick={() => handleSelectTheme(theme.id)}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                    >
                    Wybierz
                    </button>
                </li>
                ))}
            </ul>
        </div>
    );
}

export default Profile;