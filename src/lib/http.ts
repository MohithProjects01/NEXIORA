import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function created<T>(data: T) {
  return NextResponse.json(data, { status: 201 });
}

export function badRequest(message: string, errors?: Record<string, string[]>) {
  return NextResponse.json({ message, errors }, { status: 400 });
}

export function unauthorized(message = "Authentication required") {
  return NextResponse.json({ message }, { status: 401 });
}

export function forbidden(message = "You do not have access to this resource") {
  return NextResponse.json({ message }, { status: 403 });
}

export function notFound(message = "Resource not found") {
  return NextResponse.json({ message }, { status: 404 });
}

export function conflict(message: string) {
  return NextResponse.json({ message }, { status: 409 });
}

export function tooManyRequests(message = "Too many requests. Please try again later.") {
  return NextResponse.json({ message }, { status: 429 });
}

export function serverError(message = "Something went wrong. Please try again.") {
  return NextResponse.json({ message }, { status: 500 });
}

export function zodErrorResponse(error: ZodError) {
  return badRequest("Validation failed", error.flatten().fieldErrors);
}
