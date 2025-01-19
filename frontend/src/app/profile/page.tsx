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
    const [newThemeName, setNewThemeName] = useState("");
    const [newPrimaryColor, setNewPrimaryColor] = useState("#ffffff");
    const [newSecondaryColor, setNewSecondaryColor] = useState("#ffffff");
    const [newAccentColor, setNewAccentColor] = useState("#ffffff");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
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

            if (userData) {
                setFirstName(userData.first_name || "");
                setLastName(userData.last_name || "");
                setEmail(userData.email || "");
                setAddress(userData.address || "");
                setCity(userData.city || "");
                setPostalCode(userData.postal_code || "");
                setPhoneNumber(userData.phone_number || "");
            }
        }
    }, [isAuthenticated, userData]);

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

    const handleCreateTheme = () => {
        if (!newThemeName) {
            alert("Please enter a theme name.");
            return;
        }

        apiClient
            .post("/themes/manage/", {
                name: newThemeName,
                primary_color: newPrimaryColor,
                secondary_color: newSecondaryColor,
                accent_color: newAccentColor,
            })
            .then(() => {
                alert("Theme created successfully!");
                setNewThemeName("");
                setNewPrimaryColor("#ffffff");
                setNewSecondaryColor("#ffffff");
                setNewAccentColor("#ffffff");
                apiClient.get("/themes/").then(response => setThemes(response.data));
            })
            .catch(error => {
                console.error("Error creating theme:", error);
                alert("Failed to create theme.");
            });
    };

    const handleDeleteTheme = (themeId: number) => {
        if (!confirm("Are you sure you want to delete this theme?")) return;
    
        apiClient
            .delete(`/themes/manage/${themeId}/`)
            .then(() => {
                alert("Theme deleted successfully!");
                apiClient.get("/themes/").then(response => setThemes(response.data));
            })
            .catch((error) => {
                console.error("Error deleting theme:", error);
                alert("Failed to delete theme.");
            });
    };

    const handleUpdateProfile = () => {
        apiClient.put('/user/update/', {
            first_name: firstName,
            last_name: lastName,
            email,
            address,
            city,
            postal_code: postalCode,
            phone_number: phoneNumber,
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
        })
        .then(() => {
            alert("Profile updated successfully!");
        })
        .catch((error) => {
            console.error("Error updating profile:", error);
        });
    };

    if (!userData) return <div>Ładowanie...</div>;
    
    return (
        <div>
            <div className="container mx-auto p-4">
                <h1 className="text-xl py-4 font-semibold accent-text">Hello, {userData.username}</h1>
                <ul className="flex flex-wrap gap-4">
                {themes.map((theme) => (
                    <li
                        key={theme.id}
                        className="secondary-color p-4 border rounded-lg flex-shrink-0 shadow-lg"
                    >
                        <h3 className="text-xl font-bold accent-text">{theme.name}</h3>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex gap-2">
                                <div
                                    style={{ backgroundColor: theme.primary_color }}
                                    className="w-8 h-8 border rounded-full"
                                ></div>
                                <div
                                    style={{ backgroundColor: theme.secondary_color }}
                                    className="w-8 h-8 border rounded-full"
                                ></div>
                                <div
                                    style={{ backgroundColor: theme.accent_color }}
                                    className="w-8 h-8 border rounded-full"
                                ></div>
                            </div>
                            <button
                                onClick={() => handleSelectTheme(theme.id)}
                                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Select
                            </button>
                            {userData?.is_admin && (
                                <button
                                    onClick={() => handleDeleteTheme(theme.id)}
                                    className="ml-2 bg-red-500 text-white px-4 py-2 rounded"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </li>
                ))}
                </ul>
                {userData?.is_admin && (
                    <div className="my-8">
                        <h2 className="text-2xl font-semibold mb-4">Create New Theme</h2>
                        <div className="flex items-center gap-x-4 mb-4">
                            <div className="flex flex-col">
                                <label htmlFor="themeName" className="font-semibold">Theme Name</label>
                                <input
                                    type="text"
                                    id="themeName"
                                    value={newThemeName}
                                    onChange={(e) => setNewThemeName(e.target.value)}
                                    className="p-2 border rounded-lg secondary-color"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="font-semibold">Primary Color</label>
                                <input
                                    type="color"
                                    value={newPrimaryColor}
                                    onChange={(e) => setNewPrimaryColor(e.target.value)}
                                    className="w-16 h-10 secondary-color"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="font-semibold">Secondary Color</label>
                                <input
                                    type="color"
                                    value={newSecondaryColor}
                                    onChange={(e) => setNewSecondaryColor(e.target.value)}
                                    className="w-16 h-10 secondary-color"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="font-semibold">Third Color (Text)</label>
                                <input
                                    type="color"
                                    value={newAccentColor}
                                    onChange={(e) => setNewAccentColor(e.target.value)}
                                    className="w-16 h-10 secondary-color"
                                />
                            </div>
                            <button
                                onClick={handleCreateTheme}
                                className="bg-blue-500 text-white px-4 mt-6 py-2 rounded"
                            >
                                Create Theme
                            </button>
                        </div>
                    </div>
                )}
                <div className="my-8">
                    <Link href="/create_book">
                        <button className="bg-blue-500 px-6 py-3 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all">
                            Create New Book
                        </button>
                    </Link>
                </div>
                <div className="my-8">
                    <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>

                    <div className="mb-6">
                        <label htmlFor="firstName" className="accent-text block text-lg font-semibold mb-2">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            placeholder="Enter first name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="secondary-color w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="lastName" className="accent-text block text-lg font-semibold mb-2">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            placeholder="Enter last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="secondary-color w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="email" className="accent-text block text-lg font-semibold mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="secondary-color w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="address" className="accent-text block text-lg font-semibold mb-2">Address</label>
                        <input
                            type="text"
                            id="address"
                            placeholder="Enter address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="secondary-color w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="city" className="accent-text block text-lg font-semibold mb-2">City</label>
                        <input
                            type="text"
                            id="city"
                            placeholder="Enter city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="secondary-color w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="postalCode" className="accent-text block text-lg font-semibold mb-2">Postal Code</label>
                        <input
                            type="text"
                            id="postalCode"
                            placeholder="Enter postal code"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            className="secondary-color w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="phoneNumber" className="accent-text block text-lg font-semibold mb-2">Phone Number</label>
                        <input
                            type="text"
                            id="phoneNumber"
                            placeholder="Enter phone number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="secondary-color w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        onClick={handleUpdateProfile}
                        className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition"
                    >
                        Update Profile
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profile;
