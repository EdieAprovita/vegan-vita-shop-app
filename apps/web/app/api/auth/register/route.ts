import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vegan-vita-shop/database";
import { validateEmail, validatePassword, validateName } from "@vegan-vita-shop/utils";
import bcrypt from "bcryptjs";
import { UserRole } from "@vegan-vita-shop/shared";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    const nameValidation = validateName(name);
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    if (!nameValidation.isValid) {
      return NextResponse.json(
        { message: nameValidation.errors[0] },
        { status: 400 }
      );
    }

    if (!emailValidation.isValid) {
      return NextResponse.json(
        { message: emailValidation.errors[0] },
        { status: 400 }
      );
    }

    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { message: passwordValidation.errors[0] },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with this email" },
        { status: 400 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: UserRole.USER,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}