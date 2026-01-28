import { ApiResponse } from "@/server/types/responses";
import { BadRequestError, NotFoundError, UnauthorizedError } from "@/server/lib/errors";

export function handleApiError(error: unknown): Response {
  if (error instanceof NotFoundError) {
    return ApiResponse.notFound(error.message);
  } else if (error instanceof UnauthorizedError) {
    return ApiResponse.unauthorized(error.message);
  } else if (error instanceof BadRequestError) {
    return ApiResponse.badRequest(error.message);
  } else {
    return ApiResponse.serverError("Internal server error");
  }
}
