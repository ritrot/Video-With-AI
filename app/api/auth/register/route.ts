import User from "@/models/User";
import { NextResponse, NextRequest } from "next/server";
import { connectTodb } from "@/lib/db";

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();
        
        if (!email || !password) {
            return NextResponse.json(
                { error: ("Provide email and password"), },
                { status: 400 }
            )
        }
        const connect =  await connectTodb();
        const exists = await User.findOne({ email });
        
        if (exists) {
            return NextResponse.json(
                { error: "User already exits." },
                { status: 400 }
            )
        }

        const user = await User.create({
            email,
            password
        })
        
        return NextResponse.json(
            { message: "Resgistered" },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { error: error },
            { status: 500 }
        )
    }
}