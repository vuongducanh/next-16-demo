import { NextResponse } from "next/server";

export interface SuccessResponse<T> {
  success: true;
  data: T;
}

export interface ErrorResponse {
  success: false;
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export type ApiErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "BAD_REQUEST"
  | "VALIDATION_ERROR"
  | "INTERNAL_ERROR";

export class ApiResponse {
  static successResponse<T>(data: T, status = 200) {
    return NextResponse.json<SuccessResponse<T>>(
      {
        success: true,
        data,
      },
      { status },
    );
  }

  static errorResponse(
    message: string,
    status = 400,
    code: ApiErrorCode,
    errors?: Record<string, string[]>,
  ) {
    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        message,
        code,
        errors,
      },
      { status },
    );
  }

  // Shortcut thường dùng
  static unauthorized(message = "Unauthorized") {
    return this.errorResponse(message, 401, "UNAUTHORIZED");
  }

  static forbidden(message = "Forbidden") {
    return this.errorResponse(message, 403, "FORBIDDEN");
  }

  static notFound(message = "Not Found") {
    return this.errorResponse(message, 404, "NOT_FOUND");
  }

  static badRequest(message = "BAD_REQUEST") {
    return this.errorResponse(message, 400, "BAD_REQUEST");
  }

  static serverError(message = "Internal Server Error") {
    return this.errorResponse(message, 500, "INTERNAL_ERROR");
  }

  static validationError(
    errors: Record<string, string[]>,
    message = "Validation failed",
  ) {
    return this.errorResponse(message, 400, "VALIDATION_ERROR", errors);
  }
}
