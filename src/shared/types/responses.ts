import { NextResponse } from "next/server";

export interface SuccessResponse<T> {
  success: true;
  data: T;
}

export interface ErrorResponse {
  success: false;
  message: string;
  code?: string;
}

export type ApiErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "BAD_REQUEST"
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

  static errorResponse(message: string, status = 400, code?: ApiErrorCode) {
    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        message,
        code,
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
}
