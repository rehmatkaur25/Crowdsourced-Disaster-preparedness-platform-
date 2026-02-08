import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState(""); // Changed from email
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // --- FAKE BACKEND START ---
        // console.log("Bypassing Backend...");
        
        // // 1. Create a Fake Token
        // localStorage.setItem("token", "fake-token-123");
        // localStorage.setItem("userName", "Test User");

        // // 2. Show Success
        // toast({ title: "Login Successful (Offline Mode)", description: "Welcome back!" });

        // // 3. Go to Dashboard
        // navigate("/");
        // --- FAKE BACKEND END ---
        
        try {
            // 1. The Real Backend Connection
            const response = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone_number: phoneNumber, // Matches your Backend
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // 2. SAVE THE TOKEN (The "Wristband")
                localStorage.setItem("token", data.token);
                // Also save name to show in header if needed
                if(data.user && data.user.name) {
                    localStorage.setItem("userName", data.user.name);
                }

                toast({
                    title: "Login Successful",
                    description: "Welcome back!",
                });

                // 3. FIXED FLOW: GO TO DASHBOARD (MAP), NOT PROFILE
                navigate("/"); // Assuming "/" is your Dashboard/Map page
            } else {
                toast({
                    variant: "destructive",
                    title: "Login Failed",
                    description: data.message || "Invalid credentials",
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Connection Error",
                description: "Is the Backend Server running?",
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
                    <CardDescription className="text-center">
                        Enter your phone number to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            {/* CHANGED TO PHONE NUMBER */}
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="9876543210"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Sign In
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-primary hover:underline font-medium">
                            Register
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;