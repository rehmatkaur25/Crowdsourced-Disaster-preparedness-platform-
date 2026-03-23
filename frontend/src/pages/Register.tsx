import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const Register = () => {
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    // Default location to 0,0 to prevent backend crash if geolocation fails
    const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
    
    const navigate = useNavigate();
    const { toast } = useToast();

    // 1. Get User Location on Page Load
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    console.warn("Location permission denied, using default.", error);
                    // Optional: Show a toast warning that location is off
                }
            );
        }
    }, []);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        // 2. Client-side Validation
        if (password !== confirmPassword) {
            toast({
                variant: "destructive",
                title: "Passwords do not match",
                description: "Please check your password again.",
            });
            return;
        }

        try {
            // 3. Send Data to Backend (Matching User.js requirements)
            const response = await fetch('http://localhost:5000/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name,
                    phone_number: phoneNumber,
                    password: password,
                    role: 'citizen', // Default role
                    location: location // VITAL: Backend crashes without this!
                })
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    title: "Registration Successful",
                    description: "You can now log in.",
                });
                navigate("/login");
            } else {
                toast({
                    variant: "destructive",
                    title: "Registration Failed",
                    description: data.message || "Could not register user.",
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Connection Error",
                description: "Could not connect to the server.",
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
                    <CardDescription className="text-center">
                        Enter your details to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                autoComplete="name" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="9876543210"
                                autoComplete="tel"
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
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Register
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Already have an account?{" "}
                        <Link to="/login" className="text-primary hover:underline font-medium">
                            Sign In
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Register;